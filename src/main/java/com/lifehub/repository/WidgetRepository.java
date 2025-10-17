package com.lifehub.repository;

import com.lifehub.model.Widget;
import com.lifehub.model.enums.AreaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WidgetRepository extends JpaRepository<Widget, Long> {
    List<Widget> findByProfileIdAndArea(Long profileId, AreaType area);
    List<Widget> findByProfileId(Long profileId);
}
