package com.example.javabesping.repository;

import com.example.javabesping.entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Integer> {

    @Query("SELECT COUNT(s) FROM SensorData s WHERE s.timestamp BETWEEN :start AND :end")
    long countByTimestampBetween(LocalDateTime start, LocalDateTime end);

    SensorData findTopByOrderByIdDesc();
}
