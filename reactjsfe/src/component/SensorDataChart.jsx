import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SensorDataChart = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [mq7Data, setMq7Data] = useState([]);
  const [dustDensityData, setDustDensityData] = useState([]);
  const [rainData, setRainData] = useState([]);
  const [lightData, setLightData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedDate, setSelectedDate] = useState('24-08-14'); // Ngày mặc định

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${year.slice(2)}-${month}-${day}`; // Chuyển đổi YYYY-MM-DD thành YY-MM-DD
  };

  const fetchSensorData = async () => {
    const start = `${formatDate(selectedDate)} 00:00:00.000`;
    const end = `${formatDate(selectedDate)} 23:59:59.999`;
    try {
      const response = await fetch(`http://localhost:8081/api/sensorData/findByTimestamp?start=${start}&end=${end}`);
      const data = await response.json();

      const temps = data.map(record => parseFloat(record.temperature));
      const humidities = data.map(record => parseFloat(record.humidity));
      const mq7s = data.map(record => parseFloat(record.mq7));
      const dustDensities = data.map(record => parseFloat(record.dustDensity));

      // Clean rain data by removing any '=' characters
      const rains = data.map(record => parseFloat(record.rain.replace('=', '')));

      const lights = data.map(record => parseFloat(record.light));
      const timeLabels = data.map(record => new Date(record.timestamp).toLocaleTimeString());

      setTemperatureData(temps);
      setHumidityData(humidities);
      setMq7Data(mq7s);
      setDustDensityData(dustDensities);
      setRainData(rains);
      setLightData(lights);
      setLabels(timeLabels);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };


  useEffect(() => {
    fetchSensorData();
  }, [selectedDate]);

  const temperatureChart = {
    labels: labels,
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const humidityChart = {
    labels: labels,
    datasets: [
      {
        label: 'Humidity',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ],
  };

  const mq7Chart = {
    labels: labels,
    datasets: [
      {
        label: 'MQ-7',
        data: mq7Data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ],
  };

  const dustDensityChart = {
    labels: labels,
    datasets: [
      {
        label: 'Dust Density',
        data: dustDensityData,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      }
    ],
  };

  const rainChart = {
    labels: labels,
    datasets: [
      {
        label: 'Rain',
        data: rainData,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      }
    ],
  };

  const lightChart = {
    labels: labels,
    datasets: [
      {
        label: 'Light',
        data: lightData,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
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
        text: 'Sensor Data Over Time',
      },
    },
  };

  return (
      <div className="m-4">
        <div className="mb-8 flex">
          <label htmlFor="date-select" className="font-semibold text-lg p-3 mr-3">Chọn ngày khảo sát:</label>
          <input type="date" id="date-select" className="p-3 text-lg bg-slate-300 border-gray-700 rounded-lg" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
        <div className='flex flex-wrap justify-around items-start'>
          <div className='w-full p-4'>
            <div className='bg-white p-4 shadow rounded-lg'>
              <Line data={temperatureChart} options={options} />
            </div>
          </div>
          <div className='w-full p-4'>
            <div className='bg-white p-4 shadow rounded-lg'>
              <Line data={humidityChart} options={options} />
            </div>
          </div>
          <div className='w-full p-4'>
            <div className='bg-white p-4 shadow rounded-lg'>
              <Line data={mq7Chart} options={options} />
            </div>
          </div>
          <div className='w-full p-4'>
            <div className='bg-white p-4 shadow rounded-lg'>
              <Line data={dustDensityChart} options={options} />
            </div>
          </div>
          <div className='w-full p-4'>
            <div className='bg-white p-4 shadow rounded-lg'>
              <Line data={rainChart} options={options} />
            </div>
          </div>
          <div className='w-full p-4'>
            <div className='bg-white p-4 shadow rounded-lg'>
              <Line data={lightChart} options={options} />
            </div>
          </div>
        </div>
      </div>
  );
};

export default SensorDataChart;
