package com.portfolio.api;

import com.portfolio.config.DbConfig;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Scanner;

public class LoginApi implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Only handle POST requests

        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        if ("POST".equals(exchange.getRequestMethod())) {
            String response = processLogin(exchange);
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        } else {
            exchange.sendResponseHeaders(405, -1); // Method Not Allowed
        }
    }

    private String processLogin(HttpExchange exchange) throws IOException {
        // Read request body (email and password)
        InputStream requestBody = exchange.getRequestBody();
        String request = new Scanner(requestBody, "UTF-8").useDelimiter("\\A").next();
        String[] credentials = request.split("&");
        String email = credentials[0].split("=")[1];
        String password = credentials[1].split("=")[1];

        // Decode email and password from Base64
        String decodedEmail = new String(java.util.Base64.getDecoder().decode(email));
        String decodedPassword = new String(java.util.Base64.getDecoder().decode(password));

        // Check if email or password is missing
        if (decodedEmail.isEmpty() || decodedPassword.isEmpty()) {
            return "{\"status\": 0, \"msg\": \"Internal Server Error...!\"}";
        }

        // Query database for the user
        String query = "SELECT * FROM users WHERE email = ?";
        try (Connection conn = DatabaseConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, decodedEmail);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String storedPassword = rs.getString("password");

                // If password matches (no hashing here)
                if (decodedPassword.trim().equals(storedPassword.trim())) {
                    return "{\"status\": 1, \"msg\": \"Login successful!\", \"data\": {\"id\": \"" + rs.getString("id") + "\", \"email\": \"" + rs.getString("email") + "\"}}";
                } else {
                    return "{\"status\": 0, \"msg\": \"Invalid password.\"}";
                }
            } else {
                return "{\"status\": 0, \"msg\": \"User not found.\"}";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "{\"status\": 0, \"msg\": \"Internal Server Error.\"}";
        }
    }

    public static void main(String[] args) throws Exception {
        // Start the HTTP server
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/login", new LoginApi());
        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Server started at http://localhost:8080");
    }
}
