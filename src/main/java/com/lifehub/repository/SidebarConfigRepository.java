package com.lifehub.repository;

import com.lifehub.model.SidebarConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SidebarConfigRepository extends JpaRepository<SidebarConfig, Long> {
    Optional<SidebarConfig> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
