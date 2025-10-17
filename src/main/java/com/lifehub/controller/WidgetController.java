package com.lifehub.controller;

import com.lifehub.model.Widget;
import com.lifehub.model.enums.AreaType;
import com.lifehub.repository.ProfileRepository;
import com.lifehub.repository.WidgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/widgets")
@RequiredArgsConstructor
public class WidgetController {

    private final WidgetRepository widgetRepository;
    private final ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<List<Widget>> getWidgets(
            @RequestParam Long profileId,
            @RequestParam(required = false) AreaType area
    ) {
        if (area != null) {
            return ResponseEntity.ok(widgetRepository.findByProfileIdAndArea(profileId, area));
        }
        return ResponseEntity.ok(widgetRepository.findByProfileId(profileId));
    }

    @PostMapping
    public ResponseEntity<Widget> createWidget(@RequestBody Widget widgetRequest) {
        var profile = profileRepository.findById(widgetRequest.getProfile().getId()).orElseThrow();
        
        Widget widget = Widget.builder()
                .profile(profile)
                .area(widgetRequest.getArea())
                .type(widgetRequest.getType())
                .gridX(widgetRequest.getGridX())
                .gridY(widgetRequest.getGridY())
                .gridWidth(widgetRequest.getGridWidth())
                .gridHeight(widgetRequest.getGridHeight())
                .configuration(widgetRequest.getConfiguration())
                .build();
        
        return ResponseEntity.ok(widgetRepository.save(widget));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Widget> updateWidget(@PathVariable Long id, @RequestBody Widget widgetRequest) {
        var widget = widgetRepository.findById(id).orElseThrow();
        
        widget.setGridX(widgetRequest.getGridX());
        widget.setGridY(widgetRequest.getGridY());
        widget.setGridWidth(widgetRequest.getGridWidth());
        widget.setGridHeight(widgetRequest.getGridHeight());
        widget.setConfiguration(widgetRequest.getConfiguration());
        
        return ResponseEntity.ok(widgetRepository.save(widget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWidget(@PathVariable Long id) {
        widgetRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
