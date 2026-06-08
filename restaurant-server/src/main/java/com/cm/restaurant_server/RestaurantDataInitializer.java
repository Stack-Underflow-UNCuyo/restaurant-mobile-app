package com.cm.restaurant_server;

import com.cm.restaurant_server.business.domain.entity.*;
import com.cm.restaurant_server.business.domain.enumeration.*;
import com.cm.restaurant_server.business.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class RestaurantDataInitializer implements CommandLineRunner {

    private final UnidadDeMedidaRepository unidadDeMedidaRepo;
    private final CategoriaRepository categoriaRepo;
    private final ArticuloRepository articuloRepo;
    private final MesaRestauranteRepository mesaRepo;
    private final FormaDePagoRepository formaDePagoRepo;
    private final EmpleadoRepository empleadoRepo;
    private final UsuarioRepository usuarioRepo;
    private final SeccionCartaRepository seccionCartaRepo;
    private final DetalleSeccionCartaArticuloIndividualRepository detalleArticuloRepo;
    private final DetalleSeccionCartaMenuRepository detalleMenuSeccionRepo;
    private final MenuRepository menuRepo;
    private final CartaRepository cartaRepo;
    private final ComandaRestaurantRepository comandaRestaurantRepo;
    private final DetalleComandaRepository detalleComandaRepo;
    private final PasswordEncoder passwordEncoder;

    public RestaurantDataInitializer(
            UnidadDeMedidaRepository unidadDeMedidaRepo,
            CategoriaRepository categoriaRepo,
            ArticuloRepository articuloRepo,
            MesaRestauranteRepository mesaRepo,
            FormaDePagoRepository formaDePagoRepo,
            EmpleadoRepository empleadoRepo,
            UsuarioRepository usuarioRepo,
            SeccionCartaRepository seccionCartaRepo,
            DetalleSeccionCartaArticuloIndividualRepository detalleArticuloRepo,
            DetalleSeccionCartaMenuRepository detalleMenuSeccionRepo,
            MenuRepository menuRepo,
            CartaRepository cartaRepo,
            ComandaRestaurantRepository comandaRestaurantRepo,
            DetalleComandaRepository detalleComandaRepo,
            PasswordEncoder passwordEncoder) {
        this.unidadDeMedidaRepo = unidadDeMedidaRepo;
        this.categoriaRepo = categoriaRepo;
        this.articuloRepo = articuloRepo;
        this.mesaRepo = mesaRepo;
        this.formaDePagoRepo = formaDePagoRepo;
        this.empleadoRepo = empleadoRepo;
        this.usuarioRepo = usuarioRepo;
        this.seccionCartaRepo = seccionCartaRepo;
        this.detalleArticuloRepo = detalleArticuloRepo;
        this.detalleMenuSeccionRepo = detalleMenuSeccionRepo;
        this.menuRepo = menuRepo;
        this.cartaRepo = cartaRepo;
        this.comandaRestaurantRepo = comandaRestaurantRepo;
        this.detalleComandaRepo = detalleComandaRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!cartaRepo.findAllByEliminadoFalse().isEmpty())
            return;

        Map<String, UnidadDeMedida> unidades = crearUnidadesDeMedida();
        Map<String, Categoria> categorias = crearCategorias();
        Map<String, Articulo> articulos = crearArticulos(unidades);
        Map<Integer, MesaRestaurante> mesas = crearMesas();
        crearFormasDePago();
        Map<TipoEmpleado, Empleado> empleados = crearEmpleados();
        Map<String, DetalleSeccionCarta> itemsCarta = crearCartaCompleta(categorias, articulos);
        crearComandas(mesas, empleados, itemsCarta);
    }

    private Map<String, UnidadDeMedida> crearUnidadesDeMedida() {
        String[] nombres = { "Unidad", "Kilogramo", "Gramo", "Litro", "Mililitro", "Porción" };
        Map<String, UnidadDeMedida> resultado = new HashMap<>();
        for (String nombre : nombres) {
            UnidadDeMedida unidad = new UnidadDeMedida();
            unidad.setNombre(nombre);
            resultado.put(nombre, unidadDeMedidaRepo.save(unidad));
        }
        return resultado;
    }

    private Map<String, Categoria> crearCategorias() {
        String[] nombres = { "Entradas", "Platos Principales", "Pastas y Pizzas", "Postres", "Bebidas", "Combos" };
        Map<String, Categoria> resultado = new HashMap<>();
        for (String nombre : nombres) {
            Categoria categoria = new Categoria();
            categoria.setNombre(nombre);
            resultado.put(nombre, categoriaRepo.save(categoria));
        }
        return resultado;
    }

    private record ArticuloSeed(String nombre, String descripcion, boolean sinTAC, boolean esIngrediente,
            String unidad) {
    }

    private Map<String, Articulo> crearArticulos(Map<String, UnidadDeMedida> unidades) {
        List<ArticuloSeed> seeds = List.of(
                new ArticuloSeed("Empanadas de Carne",
                        "Empanadas criollas rellenas de carne cortada a cuchillo, porción de 3 unidades", false, false,
                        "Porción"),
                new ArticuloSeed("Provoleta", "Provolone a la parrilla con orégano y aceite de oliva", false, false,
                        "Porción"),
                new ArticuloSeed("Tabla de Fiambres", "Selección de fiambres y quesos artesanales para compartir",
                        false, false, "Porción"),
                new ArticuloSeed("Bife de Chorizo", "Corte de carne vacuna a la parrilla con guarnición a elección",
                        true, false, "Porción"),
                new ArticuloSeed("Milanesa Napolitana", "Milanesa de carne con jamón, queso y salsa de tomate", false,
                        false, "Porción"),
                new ArticuloSeed("Pollo al Verdeo", "Suprema de pollo grillada con salsa de crema y cebolla de verdeo",
                        true, false, "Porción"),
                new ArticuloSeed("Lomo a la Pimienta", "Lomo de res en salsa de pimienta verde con papas rústicas",
                        true, false, "Porción"),
                new ArticuloSeed("Salmón Grillado", "Filete de salmón rosado a la plancha con vegetales salteados",
                        true, false, "Porción"),
                new ArticuloSeed("Papas Fritas", "Papas fritas crocantes con sal, en porción para compartir", true,
                        false, "Porción"),
                new ArticuloSeed("Sorrentinos de Jamón y Queso", "Pasta rellena casera servida con salsa rosa", false,
                        false, "Porción"),
                new ArticuloSeed("Ñoquis de Papa", "Ñoquis caseros de papa con salsa a elección", false, false,
                        "Porción"),
                new ArticuloSeed("Pizza Muzzarella", "Pizza grande con salsa de tomate y abundante muzzarella", false,
                        false, "Unidad"),
                new ArticuloSeed("Pizza Especial", "Pizza grande con jamón, morrones, aceitunas y muzzarella", false,
                        false, "Unidad"),
                new ArticuloSeed("Flan Casero", "Flan casero con dulce de leche y crema", false, false, "Porción"),
                new ArticuloSeed("Tiramisú", "Postre italiano elaborado con café, mascarpone y cacao", false, false,
                        "Porción"),
                new ArticuloSeed("Helado Artesanal", "Dos bochas de helado artesanal a elección del cliente", true,
                        false, "Porción"),
                new ArticuloSeed("Agua Mineral", "Botella de agua mineral de 500 ml, con o sin gas", true, false,
                        "Mililitro"),
                new ArticuloSeed("Gaseosa Cola", "Botella de gaseosa cola de 500 ml", true, false, "Mililitro"),
                new ArticuloSeed("Cerveza Artesanal", "Cerveza artesanal estilo IPA de 500 ml", false, false,
                        "Mililitro"),
                new ArticuloSeed("Copa de Vino Malbec", "Copa de vino tinto Malbec de la región de Mendoza", true,
                        false, "Mililitro"),
                new ArticuloSeed("Café", "Café espresso, cortado o lágrima", true, false, "Mililitro"));
        Map<String, Articulo> resultado = new HashMap<>();
        for (ArticuloSeed seed : seeds) {
            Articulo articulo = new Articulo();
            articulo.setNombre(seed.nombre());
            articulo.setDescripcion(seed.descripcion());
            articulo.setSinTAC(seed.sinTAC());
            articulo.setEsIngrediente(seed.esIngrediente());
            articulo.setUnidadDeMedida(unidades.get(seed.unidad()));
            resultado.put(seed.nombre(), articuloRepo.save(articulo));
        }
        return resultado;
    }

    private record MesaSeed(int identificador, EstadoMesa estado, int capacidad, String zona) {
    }

    private Map<Integer, MesaRestaurante> crearMesas() {
        List<MesaSeed> seeds = List.of(
                new MesaSeed(1, EstadoMesa.OCUPADA, 2, "Salón Principal"),
                new MesaSeed(2, EstadoMesa.LIBRE, 4, "Salón Principal"),
                new MesaSeed(3, EstadoMesa.OCUPADA, 4, "Terraza"),
                new MesaSeed(4, EstadoMesa.LIBRE, 6, "Terraza"),
                new MesaSeed(5, EstadoMesa.RESERVADA, 2, "Barra"),
                new MesaSeed(6, EstadoMesa.OCUPADA, 4, "Salón Principal"),
                new MesaSeed(7, EstadoMesa.LIBRE, 8, "Salón Privado"),
                new MesaSeed(8, EstadoMesa.FUERA_DE_SERVICIO, 4, "Terraza"));
        Map<Integer, MesaRestaurante> resultado = new HashMap<>();
        for (MesaSeed seed : seeds) {
            MesaRestaurante mesa = new MesaRestaurante();
            mesa.setIdentificadorMesa(seed.identificador());
            mesa.setEstadoMesa(seed.estado());
            mesa.setCapacidadPersonas(seed.capacidad());
            mesa.setZonaFisica(seed.zona());
            resultado.put(seed.identificador(), mesaRepo.save(mesa));
        }
        return resultado;
    }

    private record FormaDePagoSeed(TipoPago tipo, String observacion) {
    }

    private void crearFormasDePago() {
        List<FormaDePagoSeed> seeds = List.of(
                new FormaDePagoSeed(TipoPago.EFECTIVO, "Pago en efectivo en caja"),
                new FormaDePagoSeed(TipoPago.TRANSFERENCIA, "Transferencia bancaria o virtual"),
                new FormaDePagoSeed(TipoPago.BILLETERA_VIRTUAL, "Pago con Mercado Pago u otra billetera virtual"));
        for (FormaDePagoSeed seed : seeds) {
            FormaDePago forma = new FormaDePago();
            forma.setTipoPago(seed.tipo());
            forma.setObservacion(seed.observacion());
            formaDePagoRepo.save(forma);
        }
    }

    private record EmpleadoSeed(String nombre, String apellido, LocalDate fechaNacimiento, String dni,
            TipoEmpleado tipoEmpleado, String email, String clave) {
    }

    private Map<TipoEmpleado, Empleado> crearEmpleados() {
        List<EmpleadoSeed> seeds = List.of(
                new EmpleadoSeed("María", "Gómez", LocalDate.of(1995, 4, 12), "35123456", TipoEmpleado.MOZO,
                        "mozo@restaurant.com", "mozo1234"),
                new EmpleadoSeed("Juan", "Pérez", LocalDate.of(1988, 9, 23), "30987654", TipoEmpleado.COCINERO,
                        "cocinero@restaurant.com", "cocinero1234"));
        Map<TipoEmpleado, Empleado> resultado = new HashMap<>();
        for (EmpleadoSeed seed : seeds) {
            Empleado empleado = new Empleado();
            empleado.setNombre(seed.nombre());
            empleado.setApellido(seed.apellido());
            empleado.setFechaNacimiento(seed.fechaNacimiento());
            empleado.setTipoDocumento(TipoDocumento.DNI);
            empleado.setNumeroDocumento(seed.dni());
            empleado.setTipoEmpleado(seed.tipoEmpleado());
            empleado = empleadoRepo.save(empleado);
            resultado.put(seed.tipoEmpleado(), empleado);

            Usuario usuario = new Usuario();
            usuario.setEmail(seed.email());
            usuario.setClave(passwordEncoder.encode(seed.clave()));
            usuario.setRol(Rol.PERSONAL);
            usuario.setPersona(empleado);
            usuarioRepo.save(usuario);
        }
        return resultado;
    }

    private record DetalleArticuloSeed(String articulo, double precio, String descripcion) {
    }

    private record DetalleMenuSeed(String nombre, int cantidad, String articulo) {
    }

    private Map<String, DetalleSeccionCarta> crearCartaCompleta(Map<String, Categoria> categorias,
            Map<String, Articulo> articulos) {
        Map<String, DetalleSeccionCarta> itemsCarta = new HashMap<>();

        Map<String, List<DetalleArticuloSeed>> seccionesConArticulos = new LinkedHashMap<>();
        seccionesConArticulos.put("Entradas", List.of(
                new DetalleArticuloSeed("Empanadas de Carne", 5400,
                        "Porción de 3 unidades, servidas con salsa criolla"),
                new DetalleArticuloSeed("Provoleta", 4200, "Lista para compartir como entrada"),
                new DetalleArticuloSeed("Tabla de Fiambres", 7800, "Para compartir entre 2 o 3 personas")));
        seccionesConArticulos.put("Platos Principales", List.of(
                new DetalleArticuloSeed("Bife de Chorizo", 9800,
                        "Incluye guarnición a elección: papas fritas, puré o ensalada"),
                new DetalleArticuloSeed("Milanesa Napolitana", 8500, "Acompañada de papas fritas o puré"),
                new DetalleArticuloSeed("Pollo al Verdeo", 8200, "Servido con arroz o puré de papas"),
                new DetalleArticuloSeed("Lomo a la Pimienta", 10200, "Acompañado de papas rústicas al horno"),
                new DetalleArticuloSeed("Salmón Grillado", 11800, "Servido con vegetales grillados de estación"),
                new DetalleArticuloSeed("Papas Fritas", 3600, "Porción para compartir, ideal como acompañamiento")));
        seccionesConArticulos.put("Pastas y Pizzas", List.of(
                new DetalleArticuloSeed("Sorrentinos de Jamón y Queso", 7200, "Con salsa rosa o filetto a elección"),
                new DetalleArticuloSeed("Ñoquis de Papa", 6800,
                        "Con salsa a elección: filetto, bolognesa o cuatro quesos"),
                new DetalleArticuloSeed("Pizza Muzzarella", 6200, "Pizza grande de 8 porciones"),
                new DetalleArticuloSeed("Pizza Especial", 7400, "Pizza grande con jamón, morrones y aceitunas")));
        seccionesConArticulos.put("Postres", List.of(
                new DetalleArticuloSeed("Flan Casero", 3200, "Servido con dulce de leche y crema"),
                new DetalleArticuloSeed("Tiramisú", 3800, "Receta tradicional italiana"),
                new DetalleArticuloSeed("Helado Artesanal", 3000, "Dos bochas a elección de sabor")));
        seccionesConArticulos.put("Bebidas", List.of(
                new DetalleArticuloSeed("Agua Mineral", 1800, "Botella de 500 ml, con o sin gas"),
                new DetalleArticuloSeed("Gaseosa Cola", 2200, "Botella de 500 ml"),
                new DetalleArticuloSeed("Cerveza Artesanal", 3400, "Botella de 500 ml"),
                new DetalleArticuloSeed("Copa de Vino Malbec", 2800, "Copa de vino tinto de la región"),
                new DetalleArticuloSeed("Café", 1900, "Espresso, cortado o lágrima")));

        List<SeccionCarta> secciones = new ArrayList<>();
        for (Map.Entry<String, List<DetalleArticuloSeed>> entry : seccionesConArticulos.entrySet()) {
            SeccionCarta seccion = new SeccionCarta();
            seccion.setNombre(entry.getKey());
            seccion.setCategoria(categorias.get(entry.getKey()));
            seccion = seccionCartaRepo.save(seccion);
            secciones.add(seccion);

            for (DetalleArticuloSeed seed : entry.getValue()) {
                DetalleSeccionCartaArticuloIndividual detalle = new DetalleSeccionCartaArticuloIndividual();
                detalle.setSeccionCarta(seccion);
                detalle.setPrecio(seed.precio());
                detalle.setDescripcion(seed.descripcion());
                detalle.setArticulo(articulos.get(seed.articulo()));
                itemsCarta.put(seed.articulo(), detalleArticuloRepo.save(detalle));
            }
        }

        SeccionCarta seccionCombos = new SeccionCarta();
        seccionCombos.setNombre("Combos");
        seccionCombos.setCategoria(categorias.get("Combos"));
        seccionCombos = seccionCartaRepo.save(seccionCombos);
        secciones.add(seccionCombos);

        Menu comboParrillero = crearCombo(
                "Combo Parrillero",
                "Combo ideal para compartir: lomo a la pimienta, papas fritas y bebida",
                11500,
                articulos,
                List.of(
                        new DetalleMenuSeed("Lomo a la Pimienta", 1, "Lomo a la Pimienta"),
                        new DetalleMenuSeed("Papas Fritas", 1, "Papas Fritas"),
                        new DetalleMenuSeed("Gaseosa Cola", 1, "Gaseosa Cola")));
        Menu comboPizzaFamiliar = crearCombo(
                "Combo Pizza Familiar",
                "Combo familiar con dos pizzas grandes y bebida para compartir",
                13800,
                articulos,
                List.of(
                        new DetalleMenuSeed("Pizza Muzzarella", 1, "Pizza Muzzarella"),
                        new DetalleMenuSeed("Pizza Especial", 1, "Pizza Especial"),
                        new DetalleMenuSeed("Gaseosa Cola", 2, "Gaseosa Cola")));

        for (Menu combo : List.of(comboParrillero, comboPizzaFamiliar)) {
            DetalleSeccionCartaMenu detalleMenu = new DetalleSeccionCartaMenu();
            detalleMenu.setSeccionCarta(seccionCombos);
            detalleMenu.setMenu(combo);
            itemsCarta.put(combo.getNombre(), detalleMenuSeccionRepo.save(detalleMenu));
        }

        Carta carta = new Carta();
        carta.setNombre("Carta Principal");
        carta.setFechaDesde(LocalDate.now());
        carta.setFechaHasta(LocalDate.now().plusYears(1));
        carta.setSeccionesCarta(secciones);
        cartaRepo.save(carta);

        return itemsCarta;
    }

    private Menu crearCombo(String nombre, String descripcion, double precio, Map<String, Articulo> articulos,
            List<DetalleMenuSeed> detalles) {
        Menu menu = new Menu();
        menu.setNombre(nombre);
        menu.setDescripcion(descripcion);
        menu.setPrecio(precio);

        List<DetalleMenu> detallesMenu = new ArrayList<>();
        for (DetalleMenuSeed seed : detalles) {
            DetalleMenu detalleMenu = new DetalleMenu();
            detalleMenu.setNombre(seed.nombre());
            detalleMenu.setCantidad(seed.cantidad());
            detalleMenu.setMenu(menu);

            DetalleMenuArticulo detalleMenuArticulo = new DetalleMenuArticulo();
            detalleMenuArticulo.setCantidad(seed.cantidad());
            detalleMenuArticulo.setDetalleMenu(detalleMenu);
            detalleMenuArticulo.setArticulo(articulos.get(seed.articulo()));

            detalleMenu.setArticulos(new ArrayList<>(List.of(detalleMenuArticulo)));
            detallesMenu.add(detalleMenu);
        }
        menu.setDetallesMenu(detallesMenu);

        return menuRepo.save(menu);
    }

    private record DetalleComandaSeed(String item, int cantidad, EstadoDetalleComanda estado) {
    }

    private record ComandaRestaurantSeed(int mesaIdentificador, TipoEmpleado mozo, EstadoComanda estado,
            long minutosAtras, List<DetalleComandaSeed> detalles) {
    }

    private void crearComandas(Map<Integer, MesaRestaurante> mesas, Map<TipoEmpleado, Empleado> empleados,
            Map<String, DetalleSeccionCarta> itemsCarta) {
        LocalDateTime ahora = LocalDateTime.now();
        List<ComandaRestaurantSeed> seeds = List.of(
                new ComandaRestaurantSeed(1, TipoEmpleado.MOZO, EstadoComanda.ABIERTA, 18, List.of(
                        new DetalleComandaSeed("Empanadas de Carne", 1, EstadoDetalleComanda.ENTREGADO_AL_CLIENTE),
                        new DetalleComandaSeed("Bife de Chorizo", 1, EstadoDetalleComanda.COCINERO_ASIGNADO),
                        new DetalleComandaSeed("Agua Mineral", 2, EstadoDetalleComanda.ENTREGADO_AL_CLIENTE))),
                new ComandaRestaurantSeed(1, TipoEmpleado.MOZO, EstadoComanda.ABIERTA, 5, List.of(
                        new DetalleComandaSeed("Flan Casero", 1, EstadoDetalleComanda.EN_PROCESO_DE_SOLICITUD),
                        new DetalleComandaSeed("Café", 2, EstadoDetalleComanda.EN_PROCESO_DE_SOLICITUD))),
                new ComandaRestaurantSeed(3, TipoEmpleado.MOZO, EstadoComanda.ABIERTA, 30, List.of(
                        new DetalleComandaSeed("Tabla de Fiambres", 1, EstadoDetalleComanda.ENTREGADO_AL_CLIENTE),
                        new DetalleComandaSeed("Pizza Especial", 1, EstadoDetalleComanda.COCINERO_ASIGNADO),
                        new DetalleComandaSeed("Cerveza Artesanal", 3, EstadoDetalleComanda.ENTREGADO_AL_CLIENTE))),
                new ComandaRestaurantSeed(3, TipoEmpleado.MOZO, EstadoComanda.ABIERTA, 7, List.of(
                        new DetalleComandaSeed("Papas Fritas", 2, EstadoDetalleComanda.ENVIADO_A_LA_COCINA),
                        new DetalleComandaSeed("Gaseosa Cola", 2, EstadoDetalleComanda.ENVIADO_A_LA_COCINA))),
                new ComandaRestaurantSeed(6, TipoEmpleado.MOZO, EstadoComanda.ABIERTA, 12, List.of(
                        new DetalleComandaSeed("Milanesa Napolitana", 2, EstadoDetalleComanda.COCINERO_ASIGNADO),
                        new DetalleComandaSeed("Ñoquis de Papa", 1, EstadoDetalleComanda.ENVIADO_A_LA_COCINA),
                        new DetalleComandaSeed("Copa de Vino Malbec", 2, EstadoDetalleComanda.ENTREGADO_AL_CLIENTE))));

        for (ComandaRestaurantSeed seed : seeds) {
            ComandaRestaurant comanda = new ComandaRestaurant();
            comanda.setFechaSolicitudComanda(ahora.minusMinutes(seed.minutosAtras()));
            comanda.setEstadoComanda(seed.estado());
            comanda.setEmpleado(empleados.get(seed.mozo()));
            comanda.setMesaRestaurante(mesas.get(seed.mesaIdentificador()));
            comanda = comandaRestaurantRepo.save(comanda);

            for (DetalleComandaSeed detalleSeed : seed.detalles()) {
                DetalleComanda detalle = new DetalleComanda();
                detalle.setCantidad(detalleSeed.cantidad());
                detalle.setEstadoDetalleComanda(detalleSeed.estado());
                detalle.setComanda(comanda);
                detalle.setDetalleSeccionCarta(itemsCarta.get(detalleSeed.item()));
                detalleComandaRepo.save(detalle);
            }
        }
    }
}
