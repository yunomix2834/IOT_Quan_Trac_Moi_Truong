package com.example.javabesping.repository;

import com.example.javabesping.entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Integer> {
    Page<SensorData> findAllByTimestampBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("SELECT COUNT(s) FROM SensorData s WHERE s.timestamp BETWEEN :start AND :end")
    long countByTimestampBetween(LocalDateTime start, LocalDateTime end);

    SensorData findTopByOrderByIdDesc();
}
