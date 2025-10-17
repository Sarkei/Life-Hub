package com.lifehub.controller;

import com.lifehub.model.Weight;
import com.lifehub.repository.WeightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/weight")
@CrossOrigin(origins = "http://localhost:5173")
public class WeightController {

    @Autowired
    private WeightRepository weightRepository;

    // Get all weight entries for user
    @GetMapping
    public ResponseEntity<List<Weight>> getAllWeights(@RequestParam Long userId) {
        List<Weight> weights = weightRepository.findByUserIdOrderByDateDesc(userId);
        return ResponseEntity.ok(weights);
    }

    // Get weight entries by date range
    @GetMapping("/range")
    public ResponseEntity<List<Weight>> getWeightsByDateRange(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Weight> weights = weightRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate);
        return ResponseEntity.ok(weights);
    }

    // Get latest weight entry
    @GetMapping("/latest")
    public ResponseEntity<Weight> getLatestWeight(@RequestParam Long userId) {
        Optional<Weight> weight = weightRepository.findFirstByUserIdOrderByDateDesc(userId);
        return weight.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get last 30 days
    @GetMapping("/recent")
    public ResponseEntity<List<Weight>> getRecentWeights(@RequestParam Long userId) {
        List<Weight> weights = weightRepository.findLast30DaysByUserId(userId);
        return ResponseEntity.ok(weights);
    }

    // Get weight statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getWeightStats(@RequestParam Long userId) {
        List<Weight> allWeights = weightRepository.findByUserIdOrderByDateDesc(userId);
        
        if (allWeights.isEmpty()) {
            return ResponseEntity.ok(new HashMap<>());
        }

        Map<String, Object> stats = new HashMap<>();
        
        // Current weight (latest entry)
        Weight latest = allWeights.get(0);
        stats.put("currentWeight", latest.getWeight());
        stats.put("currentDate", latest.getDate());
        
        // Calculate statistics
        double sum = 0;
        double min = Double.MAX_VALUE;
        double max = Double.MIN_VALUE;
        
        for (Weight w : allWeights) {
            double weight = w.getWeight();
            sum += weight;
            min = Math.min(min, weight);
            max = Math.max(max, weight);
        }
        
        stats.put("average", sum / allWeights.size());
        stats.put("min", min);
        stats.put("max", max);
        stats.put("totalEntries", allWeights.size());
        
        // Calculate change from first entry
        if (allWeights.size() > 1) {
            Weight oldest = allWeights.get(allWeights.size() - 1);
            double change = latest.getWeight() - oldest.getWeight();
            stats.put("totalChange", change);
            stats.put("startWeight", oldest.getWeight());
            stats.put("startDate", oldest.getDate());
        }
        
        // Calculate 7-day and 30-day trends
        if (allWeights.size() >= 2) {
            LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
            LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
            
            Optional<Weight> sevenDayWeight = allWeights.stream()
                    .filter(w -> !w.getDate().isAfter(sevenDaysAgo))
                    .findFirst();
            
            Optional<Weight> thirtyDayWeight = allWeights.stream()
                    .filter(w -> !w.getDate().isAfter(thirtyDaysAgo))
                    .findFirst();
            
            sevenDayWeight.ifPresent(w -> 
                stats.put("sevenDayChange", latest.getWeight() - w.getWeight())
            );
            
            thirtyDayWeight.ifPresent(w -> 
                stats.put("thirtyDayChange", latest.getWeight() - w.getWeight())
            );
        }
        
        return ResponseEntity.ok(stats);
    }

    // Add new weight entry
    @PostMapping
    public ResponseEntity<?> addWeight(@RequestBody Weight weight) {
        try {
            // Validate weight value
            if (weight.getWeight() == null || weight.getWeight() <= 0 || weight.getWeight() > 500) {
                return ResponseEntity.badRequest().body("Invalid weight value. Must be between 0 and 500 kg.");
            }

            // Set date to today if not provided
            if (weight.getDate() == null) {
                weight.setDate(LocalDate.now());
            }

            // Check if entry already exists for this date
            Optional<Weight> existing = weightRepository.findByUserIdAndDate(weight.getUserId(), weight.getDate());
            if (existing.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Weight entry already exists for this date. Please update the existing entry.");
            }

            Weight savedWeight = weightRepository.save(weight);
            return ResponseEntity.ok(savedWeight);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving weight: " + e.getMessage());
        }
    }

    // Update weight entry
    @PutMapping("/{id}")
    public ResponseEntity<?> updateWeight(@PathVariable Long id, @RequestBody Weight weightDetails) {
        try {
            Optional<Weight> weightOptional = weightRepository.findById(id);
            
            if (weightOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Weight weight = weightOptional.get();
            
            // Validate weight value
            if (weightDetails.getWeight() != null) {
                if (weightDetails.getWeight() <= 0 || weightDetails.getWeight() > 500) {
                    return ResponseEntity.badRequest().body("Invalid weight value. Must be between 0 and 500 kg.");
                }
                weight.setWeight(weightDetails.getWeight());
            }
            
            if (weightDetails.getNotes() != null) {
                weight.setNotes(weightDetails.getNotes());
            }

            Weight updatedWeight = weightRepository.save(weight);
            return ResponseEntity.ok(updatedWeight);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating weight: " + e.getMessage());
        }
    }

    // Delete weight entry
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWeight(@PathVariable Long id) {
        try {
            if (!weightRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            weightRepository.deleteById(id);
            return ResponseEntity.ok().body("Weight entry deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting weight: " + e.getMessage());
        }
    }
}
