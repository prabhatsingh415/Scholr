# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Security: Root user ke bajaye ek non-root user banao
RUN addgroup -S scholrgroup && adduser -S scholruser -G scholrgroup
USER scholruser

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Performance: JVM memory settings optimization
ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]