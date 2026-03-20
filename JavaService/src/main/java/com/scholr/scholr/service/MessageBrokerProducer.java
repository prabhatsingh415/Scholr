package com.scholr.scholr.service;

import com.scholr.scholr.configuration.MessageBrokerConfig;
import com.scholr.scholr.dto.EmailRequest;
import com.scholr.scholr.dto.NotificationPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageBrokerProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendOTPMessage(EmailRequest request) {
        log.info("[RabbitMQ] Sending OTP to exchange for: {}", request.email());
        rabbitTemplate.convertAndSend(
                MessageBrokerConfig.EXCHANGE_NAME,
                MessageBrokerConfig.ROUTING_KEY,
                request
        );
    }

    public void sendPushNotification(NotificationPayload payload) {
        log.info("[RabbitMQ] Broadcasting push notification to {} users", payload.fcmTokens().size());

        rabbitTemplate.convertAndSend(
                MessageBrokerConfig.EXCHANGE_NAME,
                MessageBrokerConfig.NOTIFICATION_ROUTING_KEY,
                payload
        );
    }
}
