package com.lifehub.repository;

import com.lifehub.model.Todo;
import com.lifehub.model.enums.AreaType;
import com.lifehub.model.enums.TodoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByProfileIdAndArea(Long profileId, AreaType area);
    List<Todo> findByProfileIdAndAreaAndStatus(Long profileId, AreaType area, TodoStatus status);
    List<Todo> findByProfileId(Long profileId);
}
