package com.barbearia.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Faz com que exceptions ResourceNotFoundException retornem erro 404 - Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handlerNotFoundException(ResourceNotFoundException ex, WebRequest request){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Faz com que exceptions CredenciaisInvalidasException retornem erro 400 - Bad Request
    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<String> handlerCredenciaisInvalidasException (CredenciaisInvalidasException ex, WebRequest request){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Faz com que exceptions BusinesRuleException retornem erro 400 - Bad Request
    @ExceptionHandler(BusinesRuleException.class)
    public ResponseEntity<String> handlerBusinesRuleException (BusinesRuleException ex, WebRequest request){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // Faz com que exceptions GlobalException retornem erro 500 - Internal Server Error
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handlerGlobalException(Exception ex, WebRequest request){
        return new ResponseEntity<>("Ocorreu um erro interno no servidor.", HttpStatus.INTERNAL_SERVER_ERROR );
    }

    

}
