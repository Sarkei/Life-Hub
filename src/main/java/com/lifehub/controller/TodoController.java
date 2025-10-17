package com.lifehub.controller;

import com.lifehub.model.Todo;
import com.lifehub.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {
    
    @Autowired
    private TodoRepository todoRepository;
    
    // Get all todos for user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Todo>> getAllTodos(@PathVariable Long userId) {
        List<Todo> todos = todoRepository.findByUserId(userId);
        return ResponseEntity.ok(todos);
    }
    
    // Get todos by category
    @GetMapping("/{userId}/category/{category}")
    public ResponseEntity<List<Todo>> getTodosByCategory(
            @PathVariable Long userId,
            @PathVariable String category) {
        List<Todo> todos = todoRepository.findByUserIdAndCategory(userId, category);
        return ResponseEntity.ok(todos);
    }
    
    // Get todos by status
    @GetMapping("/{userId}/status/{status}")
    public ResponseEntity<List<Todo>> getTodosByStatus(
            @PathVariable Long userId,
            @PathVariable Todo.Status status) {
        List<Todo> todos = todoRepository.findByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(todos);
    }
    
    // Get open todos
    @GetMapping("/{userId}/open")
    public ResponseEntity<List<Todo>> getOpenTodos(@PathVariable Long userId) {
        List<Todo> todos = todoRepository.findOpenTodosByUserId(userId);
        return ResponseEntity.ok(todos);
    }
    
    // Get completed todos
    @GetMapping("/{userId}/completed")
    public ResponseEntity<List<Todo>> getCompletedTodos(@PathVariable Long userId) {
        List<Todo> todos = todoRepository.findByUserIdAndCompleted(userId, true);
        return ResponseEntity.ok(todos);
    }
    
    // Get overdue todos
    @GetMapping("/{userId}/overdue")
    public ResponseEntity<List<Todo>> getOverdueTodos(@PathVariable Long userId) {
        List<Todo> todos = todoRepository.findOverdueTodos(userId, LocalDate.now());
        return ResponseEntity.ok(todos);
    }
    
    // Get single todo
    @GetMapping("/{userId}/item/{todoId}")
    public ResponseEntity<Todo> getTodo(
            @PathVariable Long userId,
            @PathVariable Long todoId) {
        return todoRepository.findById(todoId)
                .filter(todo -> todo.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new todo
    @PostMapping("/{userId}")
    public ResponseEntity<Todo> createTodo(
            @PathVariable Long userId,
            @RequestBody Todo todo) {
        todo.setId(null);
        todo.setUserId(userId);
        Todo saved = todoRepository.save(todo);
        return ResponseEntity.ok(saved);
    }
    
    // Update todo
    @PutMapping("/{userId}/{todoId}")
    public ResponseEntity<Todo> updateTodo(
            @PathVariable Long userId,
            @PathVariable Long todoId,
            @RequestBody Todo todo) {
        return todoRepository.findById(todoId)
                .filter(existing -> existing.getUserId().equals(userId))
                .map(existing -> {
                    todo.setId(todoId);
                    todo.setUserId(userId);
                    todo.setCreatedAt(existing.getCreatedAt());
                    return ResponseEntity.ok(todoRepository.save(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Mark as completed
    @PostMapping("/{userId}/{todoId}/complete")
    public ResponseEntity<Todo> completeTodo(
            @PathVariable Long userId,
            @PathVariable Long todoId) {
        return todoRepository.findById(todoId)
                .filter(todo -> todo.getUserId().equals(userId))
                .map(todo -> {
                    todo.setCompleted(true);
                    todo.setStatus(Todo.Status.DONE);
                    return ResponseEntity.ok(todoRepository.save(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Mark as incomplete
    @PostMapping("/{userId}/{todoId}/uncomplete")
    public ResponseEntity<Todo> uncompleteTodo(
            @PathVariable Long userId,
            @PathVariable Long todoId) {
        return todoRepository.findById(todoId)
                .filter(todo -> todo.getUserId().equals(userId))
                .map(todo -> {
                    todo.setCompleted(false);
                    todo.setCompletedAt(null);
                    todo.setStatus(Todo.Status.TODO);
                    return ResponseEntity.ok(todoRepository.save(todo));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete todo
    @DeleteMapping("/{userId}/{todoId}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable Long userId,
            @PathVariable Long todoId) {
        return todoRepository.findById(todoId)
                .filter(todo -> todo.getUserId().equals(userId))
                .map(todo -> {
                    todoRepository.delete(todo);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
