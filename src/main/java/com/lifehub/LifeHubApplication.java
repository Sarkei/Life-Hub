package com.lifehub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LifeHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(LifeHubApplication.class, args);
    }
}
