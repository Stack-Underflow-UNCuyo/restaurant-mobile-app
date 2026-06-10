package com.cm.restaurant_server.business.logic.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.cm.restaurant_server.business.domain.dto.mercadopago.CajaCreateDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.CajaDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.EstadoOrdenDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.OrdenCreateDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.OrdenDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.SucursalCreateDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.SucursalDto;
import com.cm.restaurant_server.business.domain.dto.mercadopago.SyncResultDto;
import com.cm.restaurant_server.business.domain.entity.Caja;
import com.cm.restaurant_server.business.domain.entity.Orden;
import com.cm.restaurant_server.business.domain.entity.Sucursal;
import com.cm.restaurant_server.business.domain.enumeration.TipoPago;
import com.cm.restaurant_server.business.repository.CajaRepository;
import com.cm.restaurant_server.business.repository.OrdenRepository;
import com.cm.restaurant_server.business.repository.SucursalRepository;
import com.cm.restaurant_server.config.MercadoPagoProperties;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * crear sucursal (store) y caja (POS).
 * Hace las llamadas HTTP salientes a la API de MP y persiste lo necesario para
 * las Orders y para que el mozo muestre el QR de cobro.
 */
@Service
public class MercadoPagoService {

    private static final Long CATEGORIA_DEFAULT = 621102L;

    private final RestTemplate restTemplate;
    private final MercadoPagoProperties props;
    private final SucursalRepository sucursalRepository;
    private final CajaRepository cajaRepository;
    private final OrdenRepository ordenRepository;
    private final FacturaService facturaService;

    public MercadoPagoService(RestTemplate restTemplate,
                              MercadoPagoProperties props,
                              SucursalRepository sucursalRepository,
                              CajaRepository cajaRepository,
                              OrdenRepository ordenRepository,
                              FacturaService facturaService) {
        this.restTemplate = restTemplate;
        this.props = props;
        this.sucursalRepository = sucursalRepository;
        this.cajaRepository = cajaRepository;
        this.ordenRepository = ordenRepository;
        this.facturaService = facturaService;
    }

    public List<Sucursal> listarSucursales() {
        return sucursalRepository.findAllByEliminadoFalse();
    }

    public List<Caja> listarCajas() {
        return cajaRepository.findAllByEliminadoFalse();
    }

    public List<Orden> listarOrdenes() {
        return ordenRepository.findAllByEliminadoFalse();
    }

    /** Crea la sucursal en Mercado Pago y la persiste. */
    public Sucursal crearSucursal(SucursalCreateDto dto) throws Exception {
        Map<String, Object> location = Map.of(
                "street_number", nullToEmpty(dto.getStreetNumber()),
                "street_name", nullToEmpty(dto.getStreetName()),
                "city_name", nullToEmpty(dto.getCityName()),
                "state_name", nullToEmpty(dto.getStateName()),
                "latitude", dto.getLatitude() != null ? dto.getLatitude() : 0.0,
                "longitude", dto.getLongitude() != null ? dto.getLongitude() : 0.0,
                "reference", nullToEmpty(dto.getReferencia()));

        Map<String, Object> body = Map.of(
                "name", nullToEmpty(dto.getNombre()),
                "external_id", nullToEmpty(dto.getExternalId()),
                "business_hours", businessHoursPorDefecto(),
                "location", location);

        String url = props.getBaseUrl() + "/users/" + props.getUserId() + "/stores";
        JsonNode res = post(url, body);

        Sucursal sucursal = new Sucursal();
        sucursal.setMpStoreId(asLong(res.get("id")));
        sucursal.setNombre(asText(res.get("name"), dto.getNombre()));
        sucursal.setExternalId(asText(res.get("external_id"), dto.getExternalId()));
        JsonNode loc = res.get("location");
        if (loc != null) {
            sucursal.setAddressLine(asText(loc.get("address_line"), null));
            sucursal.setLatitude(loc.hasNonNull("latitude") ? loc.get("latitude").asDouble() : dto.getLatitude());
            sucursal.setLongitude(loc.hasNonNull("longitude") ? loc.get("longitude").asDouble() : dto.getLongitude());
            sucursal.setReferencia(asText(loc.get("reference"), dto.getReferencia()));
        }
        return sucursalRepository.save(sucursal);
    }

    /** Crea la caja (POS) en Mercado Pago, ligada a una sucursal nuestra, y la persiste. */
    public Caja crearCaja(CajaCreateDto dto) throws Exception {
        Sucursal sucursal = sucursalRepository.findByIdAndEliminadoFalse(dto.getSucursalId())
                .orElseThrow(() -> new Exception("Sucursal not found: " + dto.getSucursalId()));

        Long category = dto.getCategory() != null ? dto.getCategory() : CATEGORIA_DEFAULT;
        boolean fixedAmount = Boolean.TRUE.equals(dto.getFixedAmount());

        Map<String, Object> body = Map.of(
                "name", nullToEmpty(dto.getNombre()),
                "fixed_amount", fixedAmount,
                "store_id", sucursal.getMpStoreId(),
                "external_store_id", nullToEmpty(sucursal.getExternalId()),
                "external_id", nullToEmpty(dto.getExternalId()),
                "category", category);

        String url = props.getBaseUrl() + "/pos";
        JsonNode res = post(url, body);

        Caja caja = new Caja();
        caja.setMpPosId(asLong(res.get("id")));
        caja.setNombre(asText(res.get("name"), dto.getNombre()));
        caja.setExternalId(asText(res.get("external_id"), dto.getExternalId()));
        caja.setExternalStoreId(asText(res.get("external_store_id"), sucursal.getExternalId()));
        caja.setCategory(category);
        caja.setFixedAmount(fixedAmount);
        caja.setStatus(asText(res.get("status"), null));
        caja.setUuid(asText(res.get("uuid"), null));
        JsonNode qr = res.get("qr");
        if (qr != null) {
            caja.setQrImage(asText(qr.get("image"), null));
            caja.setQrTemplateDocument(asText(qr.get("template_document"), null));
            caja.setQrTemplateImage(asText(qr.get("template_image"), null));
        }
        caja.setSucursal(sucursal);
        return cajaRepository.save(caja);
    }

    /**
     * Sincroniza las sucursales y cajas existentes en Mercado Pago hacia la
     * DB (upsert por externalId). Sirve para repoblar la base sin recrear nada en
     * MP (ej. tras borrar la base local).
     */
    public SyncResultDto syncDesdeMercadoPago() throws Exception {
        // 1) Sucursales (stores)
        JsonNode storesRes = get(props.getBaseUrl() + "/users/" + props.getUserId() + "/stores/search");
        List<Sucursal> sucursales = new ArrayList<>();
        for (JsonNode store : results(storesRes)) {
            String externalId = asText(store.get("external_id"), null);
            Sucursal sucursal = sucursalRepository.findByExternalIdAndEliminadoFalse(externalId)
                    .orElseGet(Sucursal::new);
            sucursal.setMpStoreId(asLong(store.get("id")));
            sucursal.setNombre(asText(store.get("name"), sucursal.getNombre()));
            sucursal.setExternalId(externalId);
            JsonNode loc = store.get("location");
            if (loc != null) {
                sucursal.setAddressLine(asText(loc.get("address_line"), sucursal.getAddressLine()));
                if (loc.hasNonNull("latitude")) sucursal.setLatitude(loc.get("latitude").asDouble());
                if (loc.hasNonNull("longitude")) sucursal.setLongitude(loc.get("longitude").asDouble());
                sucursal.setReferencia(asText(loc.get("reference"), sucursal.getReferencia()));
            }
            sucursales.add(sucursalRepository.save(sucursal));
        }

        // 2) Cajas (POS)
        JsonNode posRes = get(props.getBaseUrl() + "/pos");
        List<Caja> cajas = new ArrayList<>();
        for (JsonNode pos : results(posRes)) {
            String externalId = asText(pos.get("external_id"), null);
            Caja caja = cajaRepository.findByExternalIdAndEliminadoFalse(externalId)
                    .orElseGet(Caja::new);
            caja.setMpPosId(asLong(pos.get("id")));
            caja.setNombre(asText(pos.get("name"), caja.getNombre()));
            caja.setExternalId(externalId);
            String externalStoreId = asText(pos.get("external_store_id"), caja.getExternalStoreId());
            caja.setExternalStoreId(externalStoreId);
            if (pos.hasNonNull("category")) caja.setCategory(pos.get("category").asLong());
            if (pos.hasNonNull("fixed_amount")) caja.setFixedAmount(pos.get("fixed_amount").asBoolean());
            caja.setStatus(asText(pos.get("status"), caja.getStatus()));
            caja.setUuid(asText(pos.get("uuid"), caja.getUuid()));
            JsonNode qr = pos.get("qr");
            if (qr != null) {
                caja.setQrImage(asText(qr.get("image"), caja.getQrImage()));
                caja.setQrTemplateDocument(asText(qr.get("template_document"), caja.getQrTemplateDocument()));
                caja.setQrTemplateImage(asText(qr.get("template_image"), caja.getQrTemplateImage()));
            }
            if (externalStoreId != null) {
                sucursalRepository.findByExternalIdAndEliminadoFalse(externalStoreId)
                        .ifPresent(caja::setSucursal);
            }
            cajas.add(cajaRepository.save(caja));
        }

        return new SyncResultDto(
                sucursales.stream().map(SucursalDto::from).toList(),
                cajas.stream().map(CajaDto::from).toList());
    }

    /**
     * Crea una order de cobro por QR (modelo dinámico) en Mercado Pago y la
     * persiste. Devuelve un OrdenDto con el qrData a renderizar como QR.
     */
    public OrdenDto crearOrden(OrdenCreateDto dto) throws Exception {
        if (dto.getAmount() == null || dto.getAmount() <= 0) {
            throw new Exception("El monto de la order es obligatorio y debe ser mayor a 0");
        }
        Caja caja = resolverCaja(dto.getCajaExternalId());

        String externalReference = (dto.getExternalReference() != null && !dto.getExternalReference().isBlank())
                ? dto.getExternalReference()
                : "ord-" + UUID.randomUUID();
        String montoStr = String.format(Locale.US, "%.2f", dto.getAmount());
        String expirationTime = (dto.getExpirationTime() != null && !dto.getExpirationTime().isBlank())
                ? dto.getExpirationTime()
                : "PT30M";

        Map<String, Object> body = Map.of(
                "type", "qr",
                "total_amount", montoStr,
                "description", dto.getDescription() != null ? dto.getDescription() : "Cobro",
                "external_reference", externalReference,
                "expiration_time", expirationTime,
                "config", Map.of("qr", Map.of(
                        "external_pos_id", caja.getExternalId(),
                        "mode", "dynamic")),
                "transactions", Map.of("payments", List.of(Map.of("amount", montoStr))));

        HttpHeaders headers = authHeaders();
        headers.add("X-Idempotency-Key", UUID.randomUUID().toString());
        JsonNode res = postJson(props.getBaseUrl() + "/v1/orders", body, headers);

        Orden orden = new Orden();
        orden.setOrderId(asText(res.get("id"), null));
        orden.setStatus(asText(res.get("status"), null));
        orden.setStatusDetail(asText(res.get("status_detail"), null));
        JsonNode pagos = res.path("transactions").path("payments");
        if (pagos.isArray() && pagos.size() > 0) {
            orden.setPaymentId(asText(pagos.get(0).get("id"), null));
        }
        orden.setQrData(asText(res.path("type_response").get("qr_data"), null));
        orden.setAmount(dto.getAmount());
        orden.setExternalReference(externalReference);
        orden.setMode("dynamic");
        orden.setComandaId(dto.getComandaId());
        orden.setPromocionId(dto.getPromocionId());
        orden.setCaja(caja);
        return OrdenDto.from(ordenRepository.save(orden));
    }

    /** Devuelve la caja por externalId; si es null y hay una sola caja, usa esa. */
    private Caja resolverCaja(String cajaExternalId) throws Exception {
        if (cajaExternalId != null && !cajaExternalId.isBlank()) {
            return cajaRepository.findByExternalIdAndEliminadoFalse(cajaExternalId)
                    .orElseThrow(() -> new Exception("Caja not found: " + cajaExternalId));
        }
        List<Caja> cajas = cajaRepository.findAllByEliminadoFalse();
        if (cajas.size() == 1) return cajas.get(0);
        if (cajas.isEmpty()) {
            throw new Exception("No hay cajas creadas. Cree una caja (PASO 1) antes de generar una order.");
        }
        throw new Exception("Hay varias cajas; indique cajaExternalId en la solicitud.");
    }

    /**
     * Consulta el estado de una order en Mercado Pago (polling). Si está pagada y
     * la comanda aún no fue facturada, genera la factura (TRANSFERENCIA), finaliza
     * la comanda y libera la mesa. Es idempotente: re-consultar no duplica.
     */
    public EstadoOrdenDto confirmarPago(String ordenId) throws Exception {
        Orden orden = ordenRepository.findByIdAndEliminadoFalse(ordenId)
                .orElseThrow(() -> new Exception("Orden not found: " + ordenId));

        JsonNode res = get(props.getBaseUrl() + "/v1/orders/" + orden.getOrderId());
        orden.setStatus(asText(res.get("status"), orden.getStatus()));
        orden.setStatusDetail(asText(res.get("status_detail"), orden.getStatusDetail()));
        JsonNode pagos = res.path("transactions").path("payments");
        if (pagos.isArray() && pagos.size() > 0) {
            orden.setPaymentId(asText(pagos.get(0).get("id"), orden.getPaymentId()));
        }
        ordenRepository.save(orden);

        boolean paid = esPagada(res);
        if (paid && orden.getComandaId() != null && !orden.getComandaId().isBlank()
                && !facturaService.comandaYaFacturada(orden.getComandaId())) {
            facturaService.generarFacturaPagada(orden.getComandaId(), TipoPago.TRANSFERENCIA, orden.getPromocionId());
        }
        return new EstadoOrdenDto(orden.getStatus(), paid);
    }

    /**
     * Considera "pagada" la order si su status es processed/paid/closed o si algún
     * pago está approved/processed. 
     */
    private static boolean esPagada(JsonNode res) {
        if (res == null) return false;
        String status = res.path("status").asText("");
        if (status.equals("processed") || status.equals("paid") || status.equals("closed")) {
            return true;
        }
        JsonNode pagos = res.path("transactions").path("payments");
        if (pagos.isArray()) {
            for (JsonNode p : pagos) {
                String ps = p.path("status").asText("");
                if (ps.equals("approved") || ps.equals("processed")) return true;
            }
        }
        return false;
    }



    private HttpHeaders authHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(props.getAccessToken());
        return headers;
    }

    private JsonNode post(String url, Map<String, Object> body) throws Exception {
        return postJson(url, body, authHeaders());
    }

    private JsonNode postJson(String url, Object body, HttpHeaders headers) throws Exception {
        try {
            return restTemplate.postForObject(url, new HttpEntity<>(body, headers), JsonNode.class);
        } catch (HttpStatusCodeException e) {
            throw new Exception("Mercado Pago: " + e.getResponseBodyAsString());
        }
    }

    private JsonNode get(String url) throws Exception {
        try {
            return restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(authHeaders()), JsonNode.class)
                    .getBody();
        } catch (HttpStatusCodeException e) {
            throw new Exception("Mercado Pago: " + e.getResponseBodyAsString());
        }
    }

    /** Devuelve la lista de resultados de una respuesta de MP (campo "results" o array directo). */
    private static Iterable<JsonNode> results(JsonNode res) {
        if (res == null) return List.of();
        if (res.has("results")) return res.get("results");
        if (res.isArray()) return res;
        return List.of();
    }

    private static Map<String, Object> businessHoursPorDefecto() {
        List<Map<String, String>> turno = List.of(Map.of("open", "00:00", "close", "23:59"));
        return Map.of(
                "monday", turno, "tuesday", turno, "wednesday", turno,
                "thursday", turno, "friday", turno, "saturday", turno, "sunday", turno);
    }

    private static String nullToEmpty(String s) {
        return s != null ? s : "";
    }

    private static Long asLong(JsonNode node) {
        return node != null && !node.isNull() ? node.asLong() : null;
    }

    private static String asText(JsonNode node, String fallback) {
        return node != null && !node.isNull() ? node.asText() : fallback;
    }
}
