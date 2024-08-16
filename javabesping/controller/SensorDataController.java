package com.example.javabesping.controller;

import com.example.javabesping.entity.SensorData;
import com.example.javabesping.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/sensorData")
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @GetMapping("/stream")
    public SseEmitter streamSensorData() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            try {
                while (true) {
                    SensorData latestData = sensorDataService.getLatestSensorData();
                    if (latestData != null) {
                        try {
                            emitter.send(latestData);
                        } catch (IllegalStateException e) {
                            break;
                        }
                    }
                    Thread.sleep(1000);
                }
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            } finally {
                emitter.complete();
            }
        });

        return emitter;
    }

    @GetMapping("/countByTimestamp") //cách dùng: http://localhost:8081/api/sensorData/countByTimestamp?start=24-08-14 00:00:00.000&end=24-08-14 23:59:59.999
    public long countByTimestamp(
            @RequestParam("start") String start,
            @RequestParam("end") String end) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yy-MM-dd HH:mm:ss.SSS");
        LocalDateTime startTime = LocalDateTime.parse(start, formatter);
        LocalDateTime endTime = LocalDateTime.parse(end, formatter);
        return sensorDataService.countSensorDataByTimestamp(startTime, endTime);
    }
}
