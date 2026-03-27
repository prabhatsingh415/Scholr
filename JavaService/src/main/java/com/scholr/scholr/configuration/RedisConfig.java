package com.scholr.scholr.configuration;

import com.scholr.scholr.dto.DashboardDataResponse;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.*;

import com.fasterxml.jackson.databind.ObjectMapper; // ✅ Ye standard hai
// Agar GenericJackson2JsonRedisSerializer use kar rahe ho toh wo bhi check kar lena
import java.time.Duration;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {

        Jackson2JsonRedisSerializer<Object> genericSerializer =
                new Jackson2JsonRedisSerializer<>(objectMapper, Object.class);

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(12))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(genericSerializer)
                );

        Jackson2JsonRedisSerializer<DashboardDataResponse> userSerializer =
                new Jackson2JsonRedisSerializer<>(objectMapper, DashboardDataResponse.class);

        RedisCacheConfiguration userProfileConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofDays(1))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(userSerializer)
                );

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(Map.of(
                        "userProfile", userProfileConfig
                ))
                .build();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory, ObjectMapper redisObjectMapper) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());

        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(redisObjectMapper, Object.class);

        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);

        return template;
    }
}