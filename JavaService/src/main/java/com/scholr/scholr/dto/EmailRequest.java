package com.scholr.scholr.dto;

import lombok.Builder;

import java.io.Serializable;

@Builder
public record EmailRequest(String email, String otp) implements Serializable {
}