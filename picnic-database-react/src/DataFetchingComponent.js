import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

function DataFetchingComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data');
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  // Prepare chart data
  const chartData = {
    labels: data.map(item => item.Suburb),
    datasets: [
      {
        label: 'Amenities',
        data: data.map(item => item.Amenity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return (
    <div>
      <h2>Amenities by Suburb</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default DataFetchingComponent;
