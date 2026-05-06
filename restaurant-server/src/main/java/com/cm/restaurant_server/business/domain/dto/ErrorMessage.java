package com.cm.restaurant_server.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/*
Para que llegue el error con este formato:
      "status": 404,
      "error": "Not Found",
      "message": "...."
 */
@Getter
@Setter
@AllArgsConstructor
public class ErrorMessage {
    private int status;
    private String error;
    private Object message; // string o map con errores de validación
}