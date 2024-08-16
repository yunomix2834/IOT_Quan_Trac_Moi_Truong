import React, { useState, useEffect } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import SensorCard from "../component/SensorCard";
import GeminiForm from "../component/GeminiForm";
import {
  convertTimestamp,
  convertLightToLux,
  convertRainValue,
  convertMQ7Value,
  convertDustDensity,
  convertTemperature,
  convertHumidity,
} from "../utils/convertData";

function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState("Nam Định");

  const locationData = {
    "Nam Định": {
      location: "Nam Định",
      nextDayTemp: "28°C",
      weeklyWeather: "Mưa nhẹ, Nhiều mây, Nắng",
    },
    "Thái Bình": {
      location: "Thái Bình",
      nextDayTemp: "30°C",
      weeklyWeather: "Nắng, Mưa rào, Ít mây",
    },
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const [sensorData, setSensorData] = useState({
    temperature: "",
    humidity: "",
    dustDensity: "",
    mq7: "",
    light: "",
    rain: "",
    timestamp: "",
  });

  const [predictions, setPredictions] = useState({
    temperature: "",
    humidity: "",
    dustDensity: "",
    mq7: "",
    light: "",
    rain: "",
  });

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8081/api/sensorData/stream"
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorData({
        temperature: convertTemperature(data.temperature),
        humidity: convertHumidity(data.humidity),
        dustDensity: convertDustDensity(data.dustDensity),
        mq7: convertMQ7Value(data.mq7),
        light: convertLightToLux(data.light),
        rain: convertRainValue(data.rain),
        timestamp: convertTimestamp(data.timestamp),
      });

      fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Temperature: parseFloat(data.temperature),
          Humidity: parseFloat(data.humidity),
          DustDensity: parseFloat(data.dustDensity),
          MQ7: parseFloat(data.mq7),
          Light: parseInt(data.light, 10),
          Rain: parseFloat(data.rain.replace("=", "").trim()),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.predictions) {
            // Check if data and predictions exist
            setPredictions({
              temperature: data.predictions.Temperature
                ? convertTemperature(data.predictions.Temperature.toFixed(1))
                : "N/A",
              humidity: data.predictions.Humidity
                ? convertHumidity(data.predictions.Humidity.toFixed(1))
                : "N/A",
              dustDensity: data.predictions.DustDensity
                ? convertDustDensity(data.predictions.DustDensity.toFixed(1))
                : "N/A",
              mq7: data.predictions.MQ7
                ? convertMQ7Value(data.predictions.MQ7.toFixed(1))
                : "N/A",
              light: data.predictions.Light
                ? convertLightToLux(data.predictions.Light.toFixed(1))
                : "N/A",
              rain: data.predictions.Rain
                ? convertRainValue(data.predictions.Rain.toFixed(1))
                : "N/A",
            });
          } else {
            console.error("Predictions data is undefined or empty");
          }
        })
        .catch((error) => {
          console.error("Error fetching predictions:", error);
        });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-background text-foreground font-manrope">
      <Header />
      <main className="relative flex flex-col items-center justify-center min-h-screen pt-28 bg-[#f5f5f5]">
        <div className=" w-5/6 justify-center p-4">
          {/* Trạm Hà Đông */}
          <div className="w-auto p-8 m-4 border rounded-lg shadow-lg bg-card text-card-foreground border-border">
            <h2 className="flex items-center text-2xl font-bold">
              <svg
                className="w-6 h-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h18M3 12h18M3 21h18"
                />
              </svg>
              Trạm 01 Hà Đông
            </h2>
            <p className="text-muted-foreground">
              Đại Mỗ, Hà Đông, Hà Nội
            </p>
            <div className="flex flex-wrap items-center justify-center mt-6">
              <SensorCard
                title="Temperature"
                value={sensorData.temperature}
                unit="°C"
                svgPath="/src/assets/temperature.jpg"
              />
              <SensorCard
                title="Humidity"
                value={sensorData.humidity}
                unit="%"
                svgPath="/src/assets/humi.jpg"
              />
              <SensorCard
                title="Dust Density"
                value={sensorData.dustDensity}
                unit="µg/m³"
                svgPath="/src/assets/dust.jpg"
              />
              <SensorCard
                title="CO Concentration"
                value={sensorData.mq7}
                unit="/1000 PPM"
                svgPath="/src/assets/CO.jpg"
              />
              <SensorCard
                title="Light"
                value={sensorData.light}
                unit="/10000 Lux"
                svgPath="/src/assets/light.jpg"
              />
              <SensorCard
                title="Rain"
                value={sensorData.rain}
                unit="%"
                svgPath="/src/assets/rain.jpg"
              />
            </div>
            <p className="mt-6 text-muted-foreground">
              Cập nhật:{" "}
              <span className="font-semibold">{sensorData.timestamp}</span>
            </p>
          </div>

          {/* Form Thông tin chung */}
          <section className="w-auto flex flex-col items-center p-8 m-4 border rounded-lg shadow-lg bg-card text-card-foreground border-border">
            <GeminiForm />
          </section>
        </div>

        {/* Form Dự Báo */}
        <section className="flex flex-col items-center p-8 m-4 mb-8 border rounded-lg shadow-lg bg-card text-card-foreground border-border w-4/5">
          <h2 className="text-2xl font-bold">Dự báo trong tuần</h2>
          <div className="flex flex-wrap items-center justify-center mt-6">
            <SensorCard
              title="Temperature"
              value={predictions.temperature}
              unit="°C"
              svgPath="/src/assets/temperature.jpg"
            />
            <SensorCard
              title="Humidity"
              value={predictions.humidity}
              unit="%"
              svgPath="/src/assets/humi.jpg"
            />
            <SensorCard
              title="Dust Density"
              value={predictions.dustDensity}
              unit="µg/m³"
              svgPath="/src/assets/dust.jpg"
            />
            <SensorCard
              title="CO Concentration"
              value={predictions.mq7}
              unit="/1000 PPM"
              svgPath="/src/assets/CO.jpg"
            />
            <SensorCard
              title="Light"
              value={predictions.light}
              unit="/10000 Lux"
              svgPath="/src/assets/light.jpg"
            />
            <SensorCard
              title="Rain"
              value={predictions.rain}
              unit="%"
              svgPath="/src/assets/rain.jpg"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
