package com.lifehub.controller;

import com.lifehub.model.Todo;
import com.lifehub.model.TodoSubtask;
import com.lifehub.model.TodoComment;
import com.lifehub.repository.TodoRepository;
import com.lifehub.repository.TodoSubtaskRepository;
import com.lifehub.repository.TodoCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {
    
    @Autowired
    private TodoRepository todoRepository;
    
    @Autowired
    private TodoSubtaskRepository subtaskRepository;
    
    @Autowired
    private TodoCommentRepository commentRepository;
    
    // Get all todos for a user
    @GetMapping
    public ResponseEntity<List<Todo>> getTodos(
            @RequestParam Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean archived) {
        
        if (archived == null) archived = false;
        
        List<Todo> todos;
        if (status != null && !status.isEmpty()) {
            todos = todoRepository.findByUserIdAndStatusAndArchivedOrderByPositionAsc(userId, status, archived);
        } else if (category != null && !category.isEmpty()) {
            todos = todoRepository.findByUserIdAndCategoryAndArchivedOrderByPositionAsc(userId, category, archived);
        } else {
            todos = todoRepository.findByUserIdAndArchivedOrderByPositionAsc(userId, archived);
        }
        
        return ResponseEntity.ok(todos);
    }
    
    // Get todo by ID
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new todo
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        todo.setCreatedAt(LocalDateTime.now());
        todo.setUpdatedAt(LocalDateTime.now());
        if (todo.getStatus() == null || todo.getStatus().isEmpty()) {
            todo.setStatus("open");
        }
        if (todo.getPriority() == null || todo.getPriority().isEmpty()) {
            todo.setPriority("medium");
        }
        if (todo.getArchived() == null) {
            todo.setArchived(false);
        }
        
        Todo savedTodo = todoRepository.save(todo);
        return ResponseEntity.ok(savedTodo);
    }
    
    // Update todo
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(todoDetails.getTitle());
                    todo.setDescription(todoDetails.getDescription());
                    todo.setStatus(todoDetails.getStatus());
                    todo.setPriority(todoDetails.getPriority());
                    todo.setDueDate(todoDetails.getDueDate());
                    todo.setCategory(todoDetails.getCategory());
                    todo.setTags(todoDetails.getTags());
                    todo.setPosition(todoDetails.getPosition());
                    todo.setArchived(todoDetails.getArchived());
                    todo.setUpdatedAt(LocalDateTime.now());
                    
                    Todo updatedTodo = todoRepository.save(todo);
                    return ResponseEntity.ok(updatedTodo);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Update todo status (for drag & drop)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Todo> updateTodoStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        
        return todoRepository.findById(id)
                .map(todo -> {
                    if (updates.containsKey("status")) {
                        todo.setStatus((String) updates.get("status"));
                    }
                    if (updates.containsKey("position")) {
                        todo.setPosition((Integer) updates.get("position"));
                    }
                    todo.setUpdatedAt(LocalDateTime.now());
                    
                    Todo updatedTodo = todoRepository.save(todo);
                    return ResponseEntity.ok(updatedTodo);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Bulk update positions (for reordering)
    @PatchMapping("/reorder")
    @Transactional
    public ResponseEntity<Map<String, String>> reorderTodos(@RequestBody List<Map<String, Object>> updates) {
        for (Map<String, Object> update : updates) {
            Long id = Long.valueOf(update.get("id").toString());
            Integer position = (Integer) update.get("position");
            String status = (String) update.get("status");
            
            todoRepository.findById(id).ifPresent(todo -> {
                todo.setPosition(position);
                if (status != null) {
                    todo.setStatus(status);
                }
                todo.setUpdatedAt(LocalDateTime.now());
                todoRepository.save(todo);
            });
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Todos reordered successfully");
        return ResponseEntity.ok(response);
    }
    
    // Delete todo
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Map<String, String>> deleteTodo(@PathVariable Long id) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Delete related subtasks and comments
        subtaskRepository.deleteByTodoId(id);
        commentRepository.deleteByTodoId(id);
        todoRepository.deleteById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Todo deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // Archive todo
    @PatchMapping("/{id}/archive")
    public ResponseEntity<Todo> archiveTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setArchived(true);
                    todo.setUpdatedAt(LocalDateTime.now());
                    Todo updatedTodo = todoRepository.save(todo);
                    return ResponseEntity.ok(updatedTodo);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Search todos
    @GetMapping("/search")
    public ResponseEntity<List<Todo>> searchTodos(
            @RequestParam Long userId,
            @RequestParam String query) {
        List<Todo> todos = todoRepository.searchTodos(userId, query);
        return ResponseEntity.ok(todos);
    }
    
    // Get upcoming todos
    @GetMapping("/upcoming")
    public ResponseEntity<List<Todo>> getUpcomingTodos(
            @RequestParam Long userId,
            @RequestParam(required = false, defaultValue = "7") Integer days) {
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusDays(days);
        List<Todo> todos = todoRepository.findUpcomingTodos(userId, now, future);
        return ResponseEntity.ok(todos);
    }
    
    // Get overdue todos
    @GetMapping("/overdue")
    public ResponseEntity<List<Todo>> getOverdueTodos(@RequestParam Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Todo> todos = todoRepository.findOverdueTodos(userId, now);
        return ResponseEntity.ok(todos);
    }
    
    // Get statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getTodoStats(@RequestParam Long userId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("open", todoRepository.countByUserIdAndStatus(userId, "open"));
        stats.put("in_progress", todoRepository.countByUserIdAndStatus(userId, "in_progress"));
        stats.put("done", todoRepository.countByUserIdAndStatus(userId, "done"));
        
        return ResponseEntity.ok(stats);
    }
    
    // Subtask endpoints
    @GetMapping("/{todoId}/subtasks")
    public ResponseEntity<List<TodoSubtask>> getSubtasks(@PathVariable Long todoId) {
        List<TodoSubtask> subtasks = subtaskRepository.findByTodoIdOrderByPositionAsc(todoId);
        return ResponseEntity.ok(subtasks);
    }
    
    @PostMapping("/{todoId}/subtasks")
    public ResponseEntity<TodoSubtask> createSubtask(
            @PathVariable Long todoId,
            @RequestBody TodoSubtask subtask) {
        subtask.setTodoId(todoId);
        subtask.setCreatedAt(LocalDateTime.now());
        TodoSubtask savedSubtask = subtaskRepository.save(subtask);
        return ResponseEntity.ok(savedSubtask);
    }
    
    @PutMapping("/subtasks/{id}")
    public ResponseEntity<TodoSubtask> updateSubtask(
            @PathVariable Long id,
            @RequestBody TodoSubtask subtaskDetails) {
        return subtaskRepository.findById(id)
                .map(subtask -> {
                    subtask.setTitle(subtaskDetails.getTitle());
                    subtask.setCompleted(subtaskDetails.getCompleted());
                    subtask.setPosition(subtaskDetails.getPosition());
                    TodoSubtask updatedSubtask = subtaskRepository.save(subtask);
                    return ResponseEntity.ok(updatedSubtask);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/subtasks/{id}")
    public ResponseEntity<Map<String, String>> deleteSubtask(@PathVariable Long id) {
        if (!subtaskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        subtaskRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Subtask deleted successfully");
        return ResponseEntity.ok(response);
    }
    
    // Comment endpoints
    @GetMapping("/{todoId}/comments")
    public ResponseEntity<List<TodoComment>> getComments(@PathVariable Long todoId) {
        List<TodoComment> comments = commentRepository.findByTodoIdOrderByCreatedAtDesc(todoId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping("/{todoId}/comments")
    public ResponseEntity<TodoComment> createComment(
            @PathVariable Long todoId,
            @RequestBody TodoComment comment) {
        comment.setTodoId(todoId);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        TodoComment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }
    
    @PutMapping("/comments/{id}")
    public ResponseEntity<TodoComment> updateComment(
            @PathVariable Long id,
            @RequestBody TodoComment commentDetails) {
        return commentRepository.findById(id)
                .map(comment -> {
                    comment.setContent(commentDetails.getContent());
                    comment.setUpdatedAt(LocalDateTime.now());
                    TodoComment updatedComment = commentRepository.save(comment);
                    return ResponseEntity.ok(updatedComment);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commentRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Comment deleted successfully");
        return ResponseEntity.ok(response);
    }
}
