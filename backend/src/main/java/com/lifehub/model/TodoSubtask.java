package com.lifehub.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "todo_subtasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoSubtask {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long todoId;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(nullable = false)
    private Boolean completed = false;
    
    @Column(nullable = false)
    private Integer position = 0;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
