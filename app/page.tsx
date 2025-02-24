"use client"
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  // Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Define the shape of our data
interface ChartDataPoint {
  date: string;
  all_i_want_for_christmas_is_you: number;
  last_christmas: number;
  christmas_everyday: number;
  fairytale_of_new_york: number;
  baby_please_come_home: number;
  most_wonderful_time: number;
  rocking_around_the_christmas_tree: number;
  feliz_navidad: number;
  santa_tell_me: number;
  merry_little_christmas: number;
  upperLimit: number;
  lowerLimit: number;
  [key: string]: string | number; // Index signature for dynamic access
}

const MultiLineChart = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('data/test_data.csv');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        // Split the CSV into rows
        const rows = csvText.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim());
        
        // Convert rows to data objects
        const data = rows.slice(1).map(row => {
          const values = row.split(',').map(val => val.trim());
          const rowData: Partial<ChartDataPoint> = {};
          
          headers.forEach((header, index) => {
            // Convert numeric strings to numbers, leave date as string
            rowData[header] = header === 'date' ? values[index] : Number(values[index]);
          });
          
          return rowData as ChartDataPoint;
        });

        setChartData(data);
        setError('');
      } catch (err) {
        setError(`Error loading data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl p-4 text-center">
        <div className="animate-pulse text-gray-600">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl p-4">
      <h2 className="text-2xl font-roboto mb-4 text-center">Christmas index</h2>
      
      {chartData.length > 0 ? (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                }}
              />
              <YAxis />
              {/* <Tooltip /> */}
              <Legend />
              <Line type="monotone" dataKey="all_i_want_for_christmas_is_you" stroke="#B0A1BA" name="All I Want for Christmas" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="last_christmas" stroke="#ABABBD" name="Last Christmas" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="christmas_everyday" stroke="#A5B5BF" name="Christmas Everyday" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="fairytale_of_new_york" stroke="#A8BFC3" name="Fairytale of New York" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="baby_please_come_home" stroke="#ABC8C7" name="Baby Please Come Home" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="most_wonderful_time" stroke="#AFCFC8" name="Most Wonderful Time" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="rocking_around_the_christmas_tree" stroke="#4CAF50" name="Rocking Around the Christmas Tree" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="feliz_navidad" stroke="#B2D5C8" name="Feliz Navidad" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="santa_tell_me" stroke="#B8E2C8" name="Santa Tell Me" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="merry_little_christmas" stroke="#E91E63" name="Merry Little Christmas" strokeWidth={1} dot={false}/>
              <Line type="monotone" dataKey="upperLimit" stroke="#ff0000" strokeDasharray="5 5" name="Upper Limit" dot={false}/>
              <Line type="monotone" dataKey="lowerLimit" stroke="#ff0000" strokeDasharray="5 5" name="Lower Limit" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-600">No data available</div>
      )}
    </div>
  );
};

export default MultiLineChart;