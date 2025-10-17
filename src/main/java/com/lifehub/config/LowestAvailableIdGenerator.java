package com.lifehub.config;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LowestAvailableIdGenerator implements IdentifierGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        String tableName = "users"; // Hardcoded für User-Tabelle
        
        try {
            Connection connection = session.getJdbcConnectionAccess().obtainConnection();
            
            // Finde die niedrigste freie ID
            String sql = "SELECT COALESCE(MIN(t1.id + 1), 1) AS next_id " +
                        "FROM " + tableName + " t1 " +
                        "WHERE NOT EXISTS (SELECT 1 FROM " + tableName + " t2 WHERE t2.id = t1.id + 1) " +
                        "UNION ALL " +
                        "SELECT 1 AS next_id " +
                        "WHERE NOT EXISTS (SELECT 1 FROM " + tableName + " WHERE id = 1) " +
                        "ORDER BY next_id LIMIT 1";
            
            PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet rs = statement.executeQuery();
            
            if (rs.next()) {
                Long nextId = rs.getLong("next_id");
                rs.close();
                statement.close();
                return nextId;
            }
            
            rs.close();
            statement.close();
            return 1L; // Fallback: Starte bei 1
            
        } catch (SQLException e) {
            throw new HibernateException("Unable to generate lowest available ID", e);
        }
    }
}
