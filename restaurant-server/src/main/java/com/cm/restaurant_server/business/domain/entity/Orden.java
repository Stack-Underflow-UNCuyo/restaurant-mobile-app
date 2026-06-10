package com.cm.restaurant_server.business.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Order de cobro por QR creada en Mercado Pago. En modelo dinámico, MP
 * devuelve un qrData (string EMVCo) que el mozo muestra como QR para que el
 * cliente pague. Guardamos orderId/paymentId para futuras operaciones y para
 * validar las notificaciones de pago.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Orden extends Base {
    /** Id de la order en Mercado Pago*/
    private String orderId;
    /** Id del pago en Mercado Pago  */
    private String paymentId;
    private String status;
    private String statusDetail;
    private Double amount;
    private String externalReference;
    /** Modelo de QR: "dynamic". */
    private String mode;
    /** String EMVCo a renderizar como QR (modelo dinámico). */
    @Column(columnDefinition = "text")
    private String qrData;
    /** Comanda que se está cobrando (opcional). */
    private String comandaId;
    /** Promoción aplicada (opcional), para usarla al generar la factura. */
    private String promocionId;

    @ManyToOne
    private Caja caja;
}
