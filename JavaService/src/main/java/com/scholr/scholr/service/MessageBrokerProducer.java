package com.scholr.scholr.service;

import com.scholr.scholr.configuration.MessageBrokerConfig;
import com.scholr.scholr.dto.EmailRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageBrokerProducer {

    private final RabbitTemplate rabbitTemplate;

    public MessageBrokerProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendOTPMessage(EmailRequest request) {
        rabbitTemplate.convertAndSend(MessageBrokerConfig.EXCHANGE_NAME, MessageBrokerConfig.ROUTING_KEY, request);
    }
}
