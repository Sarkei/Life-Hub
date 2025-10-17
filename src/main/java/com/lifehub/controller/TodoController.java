package com.lifehub.controller;

import com.lifehub.model.Todo;
import com.lifehub.model.enums.AreaType;
import com.lifehub.model.enums.TodoStatus;
import com.lifehub.repository.ProfileRepository;
import com.lifehub.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoRepository todoRepository;
    private final ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<List<Todo>> getTodos(
            @RequestParam Long profileId,
            @RequestParam(required = false) AreaType area,
            @RequestParam(required = false) TodoStatus status
    ) {
        if (area != null && status != null) {
            return ResponseEntity.ok(todoRepository.findByProfileIdAndAreaAndStatus(profileId, area, status));
        } else if (area != null) {
            return ResponseEntity.ok(todoRepository.findByProfileIdAndArea(profileId, area));
        }
        return ResponseEntity.ok(todoRepository.findByProfileId(profileId));
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todoRequest) {
        var profile = profileRepository.findById(todoRequest.getProfile().getId()).orElseThrow();
        
        Todo todo = Todo.builder()
                .title(todoRequest.getTitle())
                .description(todoRequest.getDescription())
                .status(todoRequest.getStatus() != null ? todoRequest.getStatus() : TodoStatus.TODO)
                .priority(todoRequest.getPriority())
                .area(todoRequest.getArea())
                .dueDate(todoRequest.getDueDate())
                .profile(profile)
                .position(todoRequest.getPosition())
                .build();
        
        return ResponseEntity.ok(todoRepository.save(todo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoRequest) {
        var todo = todoRepository.findById(id).orElseThrow();
        
        todo.setTitle(todoRequest.getTitle());
        todo.setDescription(todoRequest.getDescription());
        todo.setStatus(todoRequest.getStatus());
        todo.setPriority(todoRequest.getPriority());
        todo.setDueDate(todoRequest.getDueDate());
        todo.setPosition(todoRequest.getPosition());
        
        if (todoRequest.getStatus() == TodoStatus.COMPLETED && todo.getCompletedAt() == null) {
            todo.setCompletedAt(LocalDateTime.now());
        }
        
        return ResponseEntity.ok(todoRepository.save(todo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
