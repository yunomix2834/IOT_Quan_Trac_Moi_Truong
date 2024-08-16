package com.example.javabesping.repository;

import com.example.javabesping.entity.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Integer> {
    SensorData findTopByOrderByIdDesc();
}
