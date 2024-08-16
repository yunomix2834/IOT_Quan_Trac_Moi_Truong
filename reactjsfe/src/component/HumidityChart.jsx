import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HumidityChart = () => {
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);

  const fetchHumidityData = async (start, end) => {
    try {
      const response = await fetch(`http://localhost:8081/api/sensorData/findByTimestamp?start=${start}&end=${end}`);
      const data = await response.json();

      // Lấy giá trị humidity và thời gian từ dữ liệu
      const humidity = data.map(record => parseFloat(record.humidity));
      const timeLabels = data.map(record => new Date(record.timestamp).toLocaleTimeString());

      setHumidityData(humidity);
      setLabels(timeLabels);
    } catch (error) {
      console.error('Error fetching humidity data:', error);
    }
  };

  useEffect(() => {
    const start = '24-08-14 00:00:00.000';  // Thay bằng thời gian bắt đầu bạn muốn
    const end = '24-08-14 23:59:59.999';    // Thay bằng thời gian kết thúc bạn muốn
    fetchHumidityData(start, end);
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Humidity',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Humidity Over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default HumidityChart;
