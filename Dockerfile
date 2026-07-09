FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng bằng JDK tinh gọn
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render sẽ tự cấp cổng (Port) thông qua biến môi trường PORT, cấu hình này bắt Spring Boot chạy theo cổng đó
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]