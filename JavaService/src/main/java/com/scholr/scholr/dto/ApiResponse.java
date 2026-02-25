package com.scholr.scholr.dto;

public record ApiResponse<T> ( boolean success,String message,T data, String errorCode,String timestamp){
}
