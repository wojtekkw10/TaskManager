FROM maven:3.8.6-openjdk-18-slim AS build
RUN mkdir /project
COPY . /project
WORKDIR /project
RUN mvn package -DskipTests

FROM openjdk:18-alpine
RUN mkdir /app
COPY --from=build /project/target/orchestrator-0.0.1-SNAPSHOT.jar /app/java-application.jar
WORKDIR /app
CMD "java" "-jar" "java-application.jar"
EXPOSE 8080