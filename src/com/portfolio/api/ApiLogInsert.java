package com.portfolio.api;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import com.portfolio.config.DbConfig;

public class ApiLogInsert {

    public static void logApiCall(String userId, String sessionId, String url, String platform, String data) {
        String query = "INSERT INTO api_log (url, user_id, platform, data) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = DbConfig.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, url);
            stmt.setString(2, userId);
            stmt.setString(3, platform);
            stmt.setString(4, data);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
