import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { API_KEY } from '../utils/config';
import {
  convertTimestamp,
  convertLightToLux,
  convertRainValue,
  convertMQ7Value,
  convertDustDensity,
  convertTemperature,
  convertHumidity,
} from "../utils/convertData";

const GeminiForm = () => {
  const [sensorData, setSensorData] = useState({
    temperature: "",
    humidity: "",
    dustDensity: "",
    mq7: "",
    light: "",
    rain: "",
    timestamp: "",
  });

  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8081/api/sensorData/stream"
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorData({
        temperature: `${convertTemperature(data.temperature)}°C`,
        humidity: `${convertHumidity(data.humidity)}%`,
        dustDensity: `${convertDustDensity(data.dustDensity)} µg/m³`,
        mq7: `${convertMQ7Value(data.mq7)} PPM`,
        light: `${convertLightToLux(data.light)} LUX`,
        rain: `${convertRainValue(data.rain)}%`,
        timestamp: convertTimestamp(data.timestamp),
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handlePromptChange = async (e) => {
    const selectedPrompt = e.target.value;
    setPrompt(selectedPrompt);
    setLoading(true);

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Temperature: ${sensorData.temperature}, Light: ${sensorData.light}, Dust Density: ${sensorData.dustDensity}, CO2: ${sensorData.mq7}, Độ ướt trên cảm biến mưa (rain sensor): ${sensorData.rain}, Humidity: ${sensorData.humidity}. Prompt: ${selectedPrompt}`
            }
          ]
        }
      ]
    };

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();
      
      const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
      setResponse(responseText);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while fetching the data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Weather Analysis</h1>
      <form className="space-y-4">
        <div className="grid hidden grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature:</label>
            <input
              type="text"
              value={sensorData.temperature}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Light:</label>
            <input
              type="text"
              value={sensorData.light}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dust Density:</label>
            <input
              type="text"
              value={sensorData.dustDensity}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CO2:</label>
            <input
              type="text"
              value={sensorData.mq7}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Wetness:</label>
            <input
              type="text"
              value={sensorData.rain}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Humidity:</label>
            <input
              type="text"
              value={sensorData.humidity}
              readOnly
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Một số thông tin hữu ích:</label>
          <select
            value={prompt}
            onChange={handlePromptChange}
            disabled={loading}
            required
            className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Chọn thông tin quan tâm</option>
            <option value="Thông số thời tiết này thuận lợi cho làm việc gì ?">Thông số thời tiết này thuận lợi cho làm việc gì ?</option>
            <option value="Thông số thời tiết này cần làm gì để bảo vệ sức khoẻ ?">Thông số thời tiết này cần làm gì để bảo vệ sức khoẻ ?</option>
            <option value="Thông số này cho biết môi trường có gây hại gì không ?">Thông số này cho biết môi trường có gây hại gì không ?</option>
          </select>
        </div>
      </form>

      {loading && <p className="mt-4 text-center text-indigo-600">Loading...</p>}

      {response && (
        <div className="p-4 mt-6 bg-gray-100 rounded-lg shadow-inner">
          <h3 className="text-lg font-medium text-gray-900">Một số thông tin hữu ích:</h3>
          <ReactMarkdown className="prose prose-indigo">{response}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default GeminiForm;
