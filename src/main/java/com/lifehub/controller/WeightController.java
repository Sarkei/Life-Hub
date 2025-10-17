package com.lifehub.controller;

import com.lifehub.model.WeightLog;
import com.lifehub.repository.WeightLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/weight")
@RequiredArgsConstructor
public class WeightController {

    private final WeightLogRepository weightLogRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<List<WeightLog>> getWeightLogs(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        if (start != null && end != null) {
            return ResponseEntity.ok(weightLogRepository.findByUserIdAndDateBetween(userId, start, end));
        }
        return ResponseEntity.ok(weightLogRepository.findByUserIdOrderByDateDesc(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<WeightLog> createWeightLog(
            @PathVariable Long userId,
            @RequestBody WeightLog weightRequest) {
        
        weightRequest.setUserId(userId);
        return ResponseEntity.ok(weightLogRepository.save(weightRequest));
    }

    @PutMapping("/{userId}/{id}")
    public ResponseEntity<WeightLog> updateWeightLog(
            @PathVariable Long userId,
            @PathVariable Long id,
            @RequestBody WeightLog weightRequest) {
        
        return weightLogRepository.findById(id)
                .filter(log -> log.getUserId().equals(userId))
                .map(log -> {
                    log.setWeight(weightRequest.getWeight());
                    log.setDate(weightRequest.getDate());
                    log.setNotes(weightRequest.getNotes());
                    return ResponseEntity.ok(weightLogRepository.save(log));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<Void> deleteWeightLog(
            @PathVariable Long userId,
            @PathVariable Long id) {
        
        return weightLogRepository.findById(id)
                .filter(log -> log.getUserId().equals(userId))
                .map(log -> {
                    weightLogRepository.delete(log);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
