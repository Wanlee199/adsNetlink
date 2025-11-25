package com.example.ptitcinema.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig { @Bean
@ConfigurationProperties("spring.datasource")
public DataSourceProperties sqlDataSourceProperties() {
    return new DataSourceProperties();
}

    @Bean(name = "sqlDataSource")
    public DataSource sqlDataSource() {
        return sqlDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(name = "sqlJdbcTemplate")
    public JdbcTemplate sqlJdbcTemplate(@Qualifier("sqlDataSource") DataSource ds) {
        return new JdbcTemplate(ds);
    }

}
