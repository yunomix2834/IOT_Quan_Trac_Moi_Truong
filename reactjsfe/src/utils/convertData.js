/// Chuyển đổi timestamp thành dạng đọc dễ dàng
export const convertTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

// Chuyển đổi giá trị ánh sáng từ cảm biến thành Lux
export const convertLightToLux = (lightValue) => {
  // Cảm biến ánh sáng: digital trả ra giá trị trong khoảng 0 -> 1024, số càng cao thì càng tối
  // Giả sử giá trị lux max là 10000
  return Math.round((1024 - lightValue) * (10000 / 1024));
};

// Chuyển đổi giá trị từ cảm biến mưa thành mức độ nước
export const convertRainValue = (rainValue) => {
  // Đảm bảo rainValue là một chuỗi trước khi thực hiện các thao tác chuỗi
  if (typeof rainValue !== "string") {
    rainValue = String(rainValue);
  }

  // Tiếp tục với logic chuyển đổi như trước
  return Math.round(
    (1024 - parseInt(rainValue.replace("=", "").trim(), 10)) * (100 / 1024)
  );
};

// Chuyển đổi giá trị từ cảm biến MQ-7 thành mức độ CO theo AQI
export const convertMQ7Value = (mq7Value) => {
  // MQ-7: giá trị thô (0-1024)
  const ppm = (mq7Value / 1024) * 100; // Giả sử 1024 tương ứng với 100 ppm CO

  let aqi = 0;

  if (ppm <= 4.4) {
    aqi = (50 / 4.4) * ppm;
  } else if (ppm <= 9.4) {
    aqi = ((100 - 51) / (9.4 - 4.5)) * (ppm - 4.5) + 51;
  } else if (ppm <= 12.4) {
    aqi = ((150 - 101) / (12.4 - 9.5)) * (ppm - 9.5) + 101;
  } else if (ppm <= 15.4) {
    aqi = ((200 - 151) / (15.4 - 12.5)) * (ppm - 12.5) + 151;
  } else if (ppm <= 30.4) {
    aqi = ((300 - 201) / (30.4 - 15.5)) * (ppm - 15.5) + 201;
  } else if (ppm <= 40.4) {
    aqi = ((400 - 301) / (40.4 - 30.5)) * (ppm - 30.5) + 301;
  } else {
    aqi = ((500 - 401) / (50.4 - 40.5)) * (ppm - 40.5) + 401;
  }

  return Math.round(aqi);
};


// Chuyển đổi giá trị từ cảm biến bụi thành mức độ bụi theo AQI
export const convertDustDensity = (dustDensityValue) => {
  // Cảm biến bụi GP2Y1010AU0F: digital trả ra trong khoảng 0 -> 1
  const dustDensity = parseFloat(dustDensityValue) * 500; // Giả sử 1 tương ứng với 500 µg/m³

  // Chuyển đổi giá trị bụi thành AQI cho PM2.5
  if (dustDensity <= 12) return Math.round(dustDensity * 50 / 12);
  if (dustDensity <= 35.4) return Math.round(50 + (dustDensity - 12) * 50 / 23.4);
  if (dustDensity <= 55.4) return Math.round(100 + (dustDensity - 35.4) * 50 / 20);
  if (dustDensity <= 150.4) return Math.round(150 + (dustDensity - 55.4) * 50 / 95);
  if (dustDensity <= 250.4) return Math.round(200 + (dustDensity - 150.4) * 50 / 100);
  if (dustDensity <= 350.4) return Math.round(300 + (dustDensity - 250.4) * 100 / 100);
  return Math.round(400 + (dustDensity - 350.4) * 100 / 100);
};

// Chuyển đổi giá trị nhiệt độ từ DHT11
export const convertTemperature = (temperature) => {
  return `${temperature}`; //đơn vị °C
};

// Chuyển đổi giá trị độ ẩm từ DHT11
export const convertHumidity = (humidity) => {
  return `${humidity}`; //đơn vị %
};


// Chuyển đổi mức độ đo sang label
// Hàm chuyển đổi nhiệt độ
export const convertTemperatureToLabel = (temperature) => {
  if (temperature <= 0) return "Rất lạnh";
  if (temperature <= 18) return "Lạnh";
  if (temperature <= 26) return "Mát";
  if (temperature <= 33) return "Nóng";
  return "Rất nóng";
};

// Hàm chuyển đổi độ ẩm
export const convertHumidityToLabel = (humidity) => {
  if (humidity <= 30) return "Rất khô";
  if (humidity <= 50) return "Khô";
  if (humidity <= 70) return "Bình thường";
  if (humidity <= 90) return "Ẩm ướt";
  return "Rất ẩm ướt";
};

// Hàm chuyển đổi độ bụi
export const convertDustDensityToLabel = (dustDensity) => {
  if (dustDensity <= 50) return "Không khí sạch";
  if (dustDensity <= 150) return "Không khí hơi ô nhiễm";
  if (dustDensity <= 250) return "Không khí ô nhiễm";
  if (dustDensity <= 350) return "Không khí rất ô nhiễm";
  return "Không khí nguy hiểm";
};

// Hàm chuyển đổi giá trị CO theo AQI (PPM) thành nhãn
export const convertMQ7ValueToLabel = (aqi) => {
  if (aqi <= 50) return "Không khí trong lành";
  if (aqi <= 100) return "Chất lượng không khí tốt";
  if (aqi <= 150) return "Chất lượng không khí trung bình";
  if (aqi <= 200) return "Không khí không lành mạnh cho người nhạy cảm";
  if (aqi <= 300) return "Không khí không lành mạnh";
  if (aqi <= 400) return "Không khí rất không lành mạnh";
  return "Không khí nguy hiểm";
};


// Hàm chuyển đổi ánh sáng (Lux)
export const convertLightToLuxToLabel = (light) => {
  if (light <= 700) return "Rất tối";
  if (light <= 3000) return "Tối";
  if (light <= 6000) return "Ánh sáng bình thường";
  if (light <= 10000) return "Sáng";
  return "Rất sáng";
};

// Hàm chuyển đổi cảm biến mưa
export const convertRainValueToLabel = (rain) => {
  if (rain <= 10) return "Không mưa";
  if (rain <= 30) return "Xuất hiện hạt mưa nhỏ";
  if (rain <= 50) return "Có vài hạt mưa nhỏ";
  if (rain <= 70) return "Trời bắt đầu mưa";
  return "Trời đang mưa to";
};
