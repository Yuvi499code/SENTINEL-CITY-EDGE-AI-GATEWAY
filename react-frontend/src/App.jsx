import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, ArcElement, Legend);

function App() {
  const [telemetry, setTelemetry] = useState({ temperature: 0, risk: 0, status: "BOOTING", bandwidth: 0, cpuLoad: 0 });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Hardware Temp (°C)', data: [], borderColor: '#58a6ff', backgroundColor: 'rgba(88, 166, 255, 0.1)', borderWidth: 3, fill: true, tension: 0.4
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/live_data.json');
        const data = await response.json();
        setTelemetry(data);

        setChartData(prevChart => {
          const now = new Date().toLocaleTimeString();
          const newLabels = [...prevChart.labels, now];
          const newData = [...prevChart.datasets[0].data, data.temperature];

          // Keeps 25 data points visible on the graph
          if (newLabels.length > 25) { newLabels.shift(); newData.shift(); }
          const isCritical = data.status === "CRITICAL ANOMALY";

          return {
            labels: newLabels,
            datasets: [{
              ...prevChart.datasets[0],
              data: newData,
              borderColor: isCritical ? '#f85149' : '#58a6ff',
              backgroundColor: isCritical ? 'rgba(248, 81, 73, 0.2)' : 'rgba(88, 166, 255, 0.1)'
            }]
          };
        });
      } catch (error) { console.log("Waiting for C++ engine..."); }
    };

    const intervalId = setInterval(fetchData, 500);
    return () => clearInterval(intervalId);
  }, []);

  const isCritical = telemetry.status === "CRITICAL ANOMALY";

  const riskGaugeData = {
    labels: ['Threat Level', 'Safety Margin'],
    datasets: [{
      data: [telemetry.risk, 100 - telemetry.risk],
      backgroundColor: [isCritical ? '#f85149' : '#d29922', '#161b22'],
      borderColor: ['#30363d', '#30363d'],
      borderWidth: 1,
    }]
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Sentinel-City SCADA Command</h1>
        <div className={`status-badge ${isCritical ? 'status-critical' : 'status-normal'}`}>
          {isCritical ? "PREVENTATIVE SHUTDOWN TRIGGERED" : "SYSTEM OPTIMAL"}
        </div>
      </div>

      <div className="grid">
        <div className="card"><h3>System CPU Load</h3><div className="value">{telemetry.cpuLoad}%</div></div>
        <div className="card"><h3>Live Temperature</h3><div className="value">{telemetry.temperature}°C</div></div>
        <div className="card"><h3>Bandwidth Saved</h3><div className="value">{telemetry.bandwidth} MB</div></div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        
        <div className="chart-container" style={{ flex: '7' }}>
          <h3 style={{ textAlign: 'center', color: '#8b949e', marginTop: 0 }}>Thermal Telemetry</h3>
          <Line 
            data={chartData} 
            options={{ responsive: true, animation: { duration: 0 }, scales: { y: { min: 20, max: 180, grid: { color: '#30363d' } }, x: { grid: { color: '#30363d' } } } }} 
          />
        </div>

        <div className="chart-container" style={{ flex: '3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: '#8b949e', marginTop: 0 }}>AI Risk Gauge</h3>
          <div style={{ width: '80%' }}>
            <Doughnut data={riskGaugeData} options={{ cutout: '75%', plugins: { legend: { display: false } }, animation: { animateRotate: false } }} />
          </div>
          <h2 style={{ color: isCritical ? '#f85149' : '#d29922', marginTop: '20px' }}>
            {telemetry.risk.toFixed(1)}% RISK
          </h2>
        </div>

      </div>
    </div>
  );
}

export default App;