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


  //chuyển đổi mức độ đo sang label
  // Hàm chuyển đổi nhiệt độ
  const convertTemperatureToLabel = (temperature) => {
    if (temperature <= 0) return "Rất lạnh";
    if (temperature <= 18) return "Lạnh";
    if (temperature <= 26) return "Mát";
    if (temperature <= 33) return "Nóng";
    return "Rất nóng";
  };

  // Hàm chuyển đổi độ ẩm
  const convertHumidityToLabel = (humidity) => {
    if (humidity <= 30) return "Rất khô";
    if (humidity <= 50) return "Khô";
    if (humidity <= 70) return "Bình thường";
    if (humidity <= 90) return "Ẩm ướt";
    return "Rất ẩm ướt";
  };

  // Hàm chuyển đổi độ bụi
  const convertDustDensityToLabel = (dustDensity) => {
    if (dustDensity <= 50) return "Không khí sạch";
    if (dustDensity <= 150) return "Không khí hơi ô nhiễm";
    if (dustDensity <= 250) return "Không khí ô nhiễm";
    if (dustDensity <= 350) return "Không khí rất ô nhiễm";
    return "Không khí nguy hiểm";
  };

  // Hàm chuyển đổi giá trị CO (PPM)
  const convertMQ7ValueToLabel = (mq7) => {
    if (mq7 <= 50) return "Không khí trong lành";
    if (mq7 <= 100) return "Chất lượng không khí tốt";
    if (mq7 <= 200) return "Chất lượng không khí trung bình";
    if (mq7 <= 300) return "Không khí không lành mạnh cho người nhạy cảm";
    if (mq7 <= 500) return "Không khí không lành mạnh";
    return "Không khí nguy hiểm";
  };

  // Hàm chuyển đổi ánh sáng (Lux)
  const convertLightToLuxToLabel = (light) => {
    if (light <= 100) return "Rất tối";
    if (light <= 500) return "Tối";
    if (light <= 1000) return "Ánh sáng bình thường";
    if (light <= 5000) return "Sáng";
    return "Rất sáng";
  };

  // Hàm chuyển đổi cảm biến mưa
  const convertRainValueToLabel = (rain) => {
    if (rain <= 10) return "Không mưa";
    if (rain <= 30) return "Xuất hiện hạt mưa nhỏ";
    if (rain <= 50) return "Có vài hạt mưa nhỏ";
    if (rain <= 70) return "Trời bắt đầu mưa";
    return "Trời đang mưa to";
  };


  return (
    <div className="bg-background text-foreground font-manrope">
      <Header />
      <main className="relative flex flex-col items-center justify-center min-h-screen pt-28 bg-[#f5f5f5]">
        <div className="justify-center w-11/12 p-4 ">
          {/* Trạm Hà Đông */}
          <div className="w-auto p-6 m-4 border rounded-lg shadow-lg bg-card text-card-foreground border-border">
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

            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="p-4 bg-blue-100 rounded-lg">
                <h3 className="text-lg font-semibold">Nhiệt độ</h3>
                <p className="text-sm">{convertTemperatureToLabel(sensorData.temperature)}</p>
              </div>

              <div className="p-4 bg-green-100 rounded-lg">
                <h3 className="text-lg font-semibold">Độ ẩm</h3>
                <p className="text-sm">{convertHumidityToLabel(sensorData.humidity)}</p>
              </div>

              <div className="p-4 bg-yellow-100 rounded-lg">
                <h3 className="text-lg font-semibold">Độ bụi</h3>
                <p className="text-sm">{convertDustDensityToLabel(sensorData.dustDensity)}</p>
              </div>

              <div className="p-4 bg-red-100 rounded-lg">
                <h3 className="text-lg font-semibold">CO (PPM)</h3>
                <p className="text-sm">{convertMQ7ValueToLabel(sensorData.mq7)}</p>
              </div>

              <div className="p-4 bg-purple-100 rounded-lg">
                <h3 className="text-lg font-semibold">Ánh sáng</h3>
                <p className="text-sm">{convertLightToLuxToLabel(sensorData.light)}</p>
              </div>

              <div className="p-4 bg-blue-100 rounded-lg">
                <h3 className="text-lg font-semibold">Mưa</h3>
                <p className="text-sm">{convertRainValueToLabel(sensorData.rain)}</p>
              </div>
            </div>

            <p className="mt-6 text-muted-foreground">
              Cập nhật:{" "}
              <span className="font-semibold">{sensorData.timestamp}</span>
            </p>
          </div>

          {/* Form Thông tin chung */}
          <section className="flex flex-col items-center w-auto p-6 m-4 border rounded-lg shadow-lg bg-card text-card-foreground border-border">
            <GeminiForm />
          </section>
        </div>

        {/* Form Dự Báo */}
        <section className="flex flex-col items-center w-11/12 p-8 m-4 mb-8 border rounded-lg shadow-lg bg-card text-card-foreground border-border">
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
