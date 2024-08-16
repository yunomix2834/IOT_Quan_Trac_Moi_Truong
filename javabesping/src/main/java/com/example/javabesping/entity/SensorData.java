package com.example.javabesping.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "SensorData")
public class SensorData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String temperature;
    private String humidity;
    private String dustDensity;
    private String mq7;
    private String light;
    private String rain;

    @Column(name = "Timestamp", columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime timestamp;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getHumidity() {
        return humidity;
    }

    public void setHumidity(String humidity) {
        this.humidity = humidity;
    }

    public String getDustDensity() {
        return dustDensity;
    }

    public void setDustDensity(String dustDensity) {
        this.dustDensity = dustDensity;
    }

    public String getMq7() {
        return mq7;
    }

    public void setMq7(String mq7) {
        this.mq7 = mq7;
    }

    public String getLight() {
        return light;
    }

    public void setLight(String light) {
        this.light = light;
    }

    public String getRain() {
        return rain;
    }

    public void setRain(String rain) {
        this.rain = rain;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
