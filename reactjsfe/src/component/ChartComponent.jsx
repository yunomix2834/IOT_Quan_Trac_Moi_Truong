import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết từ Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  // Dữ liệu của biểu đồ
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'], // Nhãn cho trục X
    datasets: [
      {
        label: 'Dataset 1', // Nhãn cho dataset
        data: [65, 59, 80, 81, 56, 55, 40], // Dữ liệu cho trục Y
        borderColor: 'rgba(75,192,192,1)', // Màu của đường biểu đồ
        backgroundColor: 'rgba(75,192,192,0.2)', // Màu nền dưới đường biểu đồ
      },
      {
        label: 'Dataset 2',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
      },
    ],
  };

  // Tùy chọn cho biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sample Line Chart',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent;
