package com.lifehub.controller;

import com.lifehub.model.WeightLog;
import com.lifehub.repository.ProfileRepository;
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
    private final ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<List<WeightLog>> getWeightLogs(
            @RequestParam Long profileId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        if (start != null && end != null) {
            return ResponseEntity.ok(weightLogRepository.findByProfileIdAndDateBetween(profileId, start, end));
        }
        return ResponseEntity.ok(weightLogRepository.findByProfileIdOrderByDateDesc(profileId));
    }

    @PostMapping
    public ResponseEntity<WeightLog> createWeightLog(@RequestBody WeightLog weightRequest) {
        var profile = profileRepository.findById(weightRequest.getProfile().getId()).orElseThrow();
        
        WeightLog weightLog = WeightLog.builder()
                .profile(profile)
                .weight(weightRequest.getWeight())
                .date(weightRequest.getDate())
                .notes(weightRequest.getNotes())
                .build();
        
        return ResponseEntity.ok(weightLogRepository.save(weightLog));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeightLog> updateWeightLog(@PathVariable Long id, @RequestBody WeightLog weightRequest) {
        var weightLog = weightLogRepository.findById(id).orElseThrow();
        
        weightLog.setWeight(weightRequest.getWeight());
        weightLog.setDate(weightRequest.getDate());
        weightLog.setNotes(weightRequest.getNotes());
        
        return ResponseEntity.ok(weightLogRepository.save(weightLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeightLog(@PathVariable Long id) {
        weightLogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
