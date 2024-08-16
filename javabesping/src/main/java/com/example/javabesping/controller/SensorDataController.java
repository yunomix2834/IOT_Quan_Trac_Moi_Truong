package com.example.javabesping.controller;

import com.example.javabesping.entity.SensorData;
import com.example.javabesping.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/sensorData")
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @GetMapping("/stream")
    public SseEmitter streamSensorData() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Không có timeout
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            try {
                while (true) {
                    SensorData latestData = sensorDataService.getLatestSensorData();
                    if (latestData != null) {
                        try {
                            emitter.send(latestData);
                        } catch (IllegalStateException e) {
                            break; // Nếu emitter đã hoàn thành, thoát khỏi vòng lặp
                        }
                    }
                    Thread.sleep(1000); // Điều chỉnh khoảng thời gian theo nhu cầu
                }
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            } finally {
                emitter.complete();
            }
        });

        return emitter;
    }
}
