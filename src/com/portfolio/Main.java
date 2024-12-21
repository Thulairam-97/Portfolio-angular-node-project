package com.portfolio;

import com.sun.net.httpserver.HttpServer;
import com.portfolio.api.LoginApi;

import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/login", new LoginApi());
        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Server started at http://localhost:8080");
    }
}
