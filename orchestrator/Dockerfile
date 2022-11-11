FROM maven:3.8.6-openjdk-18-slim AS build
RUN mkdir /project
COPY . /project
WORKDIR /project
RUN mvn clean package -DskipTests

FROM openjdk:17-alpine
RUN mkdir /app
COPY --from=build /project/target/java-application.jar /app/java-application.jar
WORKDIR /app
CMD "java" "-jar" "java-application.jar"