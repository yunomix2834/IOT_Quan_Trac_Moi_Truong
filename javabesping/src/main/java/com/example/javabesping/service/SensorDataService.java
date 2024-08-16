package com.example.javabesping.service;

import com.example.javabesping.entity.SensorData;
import com.example.javabesping.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SensorDataService {

    @Autowired
    private SensorDataRepository sensorDataRepository;

    public List<SensorData> getAllSensorData() {
        return sensorDataRepository.findAll();
    }

    public SensorData getLatestSensorData() {
        return sensorDataRepository.findTopByOrderByIdDesc();
    }

    public long countSensorDataByTimestamp(LocalDateTime start, LocalDateTime end) {
        return sensorDataRepository.countByTimestampBetween(start, end);
    }
}
