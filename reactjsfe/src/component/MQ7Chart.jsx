import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MQ7Chart = () => {
  const [mq7Data, setMq7Data] = useState([]);
  const [labels, setLabels] = useState([]);

  const fetchMQ7Data = async (start, end) => {
    try {
      const response = await fetch(`http://localhost:8081/api/sensorData/findByTimestamp?start=${start}&end=${end}`);
      const data = await response.json();

      // Lấy giá trị mq7 và thời gian từ dữ liệu
      const mq7 = data.map(record => parseFloat(record.mq7));
      const timeLabels = data.map(record => new Date(record.timestamp).toLocaleTimeString());

      setMq7Data(mq7);
      setLabels(timeLabels);
    } catch (error) {
      console.error('Error fetching MQ7 data:', error);
    }
  };

  useEffect(() => {
    const start = '24-08-14 00:00:00.000';  // Thay bằng thời gian bắt đầu bạn muốn
    const end = '24-08-14 23:59:59.999';    // Thay bằng thời gian kết thúc bạn muốn
    fetchMQ7Data(start, end);
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'MQ7',
        data: mq7Data,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
        text: 'MQ7 Data Over Time',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MQ7Chart;
