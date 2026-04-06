package com.scholr.scholr.service;

import com.scholr.scholr.configuration.MessageBrokerConfig;
import com.scholr.scholr.dto.EmailRequest;
import com.scholr.scholr.dto.NotificationPayload;
import com.scholr.scholr.exception.BrokerDownException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import javax.naming.ServiceUnavailableException;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageBrokerProducer {

    private final RabbitTemplate rabbitTemplate;

    @CircuitBreaker(name = "brokerService", fallbackMethod = "handleBrokerFailure")
    public void sendOTPMessage(EmailRequest request) {
        log.info("[RabbitMQ] Sending OTP to exchange for: {}", request.email());
        rabbitTemplate.convertAndSend(
                MessageBrokerConfig.EXCHANGE_NAME,
                MessageBrokerConfig.ROUTING_KEY,
                request
        );
    }

    @CircuitBreaker(name = "notificationService", fallbackMethod = "handleNotificationFailure")
    public void sendPushNotification(NotificationPayload payload) {
        log.info("[RabbitMQ] Broadcasting push notification to {} users", payload.fcmTokens().size());

        rabbitTemplate.convertAndSend(
                MessageBrokerConfig.EXCHANGE_NAME,
                MessageBrokerConfig.NOTIFICATION_ROUTING_KEY,
                payload
        );
    }

    public void handleBrokerFailure(EmailRequest request, Throwable t) {
        log.error("CRITICAL: Message Broker is DOWN. Cannot send OTP to Go Service. Email: {}, Error: {}", request.email(), t.getMessage());
        throw new BrokerDownException("Email delivery service is temporarily unavailable. Please try again in a few minutes.");
    }

    public void handleNotificationFailure(NotificationPayload payload, Throwable t) {
        log.warn("WARNING: Broker DOWN. Push Notification skipped for {} tokens. Error: {}", payload.fcmTokens().size(), t.getMessage());
    }
}
