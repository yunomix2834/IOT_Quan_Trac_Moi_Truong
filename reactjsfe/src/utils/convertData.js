// Chuyển đổi timestamp thành dạng đọc dễ dàng
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

// Chuyển đổi giá trị từ cảm biến MQ-7 thành mức độ CO
export const convertMQ7Value = (mq7Value) => {
  // MQ-7: digital trả ra giá trị trong khoảng 0 -> 1024, số càng thấp thì nồng độ CO càng thấp
  // giá trị ppm max là 1000 ppm
  return Math.round(parseInt(mq7Value, 10) * (1000 / 1024));
};

// Chuyển đổi giá trị từ cảm biến bụi thành mức độ bụi
export const convertDustDensity = (dustDensityValue) => {
  // Cảm biến bụi gp2y1010au0f: digital trả ra trong khoảng 0 -> 1
  return parseFloat(dustDensityValue) * 500; // Giả sử 1 tương ứng với 500 µg/m³
};

// Chuyển đổi giá trị nhiệt độ từ DHT11
export const convertTemperature = (temperature) => {
  return `${temperature}`; //đơn vị °C
};

// Chuyển đổi giá trị độ ẩm từ DHT11
export const convertHumidity = (humidity) => {
  return `${humidity}`; //đơn vị %
};
