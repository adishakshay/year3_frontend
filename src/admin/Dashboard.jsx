import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../asserts/Dashboard.css';

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('https://year3-backend.onrender.com/adminuser/users/count');
        const userData = await userResponse.json();
        setUserCount(userData);

        const eventResponse = await fetch('https://year3-backend.onrender.com/adminuser/events/count');
        const eventData = await eventResponse.json();
        setEventCount(eventData);

        const paymentResponse = await fetch('https://year3-backend.onrender.com/adminuser/payments/count');
        const paymentData = await paymentResponse.json();
        setPaymentCount(paymentData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Data for charts
  const userData = {
    labels: ['Users', 'Events', 'Payments'],
    datasets: [
      {
        label: 'Statistics',
        data: [userCount, eventCount, paymentCount],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      }
    ]
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Growth',
        data: [10, 20, 30, 40, 50, 60], // Example data; replace with actual
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      }
    ]
  };

  const barData = {
    labels: ['Event A', 'Event B', 'Event C', 'Event D'],
    datasets: [
      {
        label: 'Event Registrations',
        data: [15, 25, 10, 30], // Example data; replace with actual
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-stats-container">
        <div className="dashboard-stat-box">
          <div className="stat-value">{userCount}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="dashboard-stat-box">
          <div className="stat-value">{eventCount}</div>
          <div className="stat-label">Total Event Registrations</div>
        </div>
        <div className="dashboard-stat-box">
          <div className="stat-value">{paymentCount}</div>
          <div className="stat-label">Total Payments</div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Overall Distribution</h3>
          <Doughnut data={userData} />
        </div>
        
        <div className="chart-container">
          <h3>Monthly Growth</h3>
          <Line data={lineData} />
        </div>
        
        <div className="chart-container">
          <h3>Event Registrations</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
