import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart = ({ labels, data }) => {
  const chartContainer = useRef(null);
  useEffect(
    () => {
      if (chartContainer && chartContainer.current) {
        const myChart = new Chart(chartContainer.current, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "History",
                data: data,
                fill: false,
                pointBackgroundColor: "#361e42",
                backgroundColor: "#2596be",
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "My Transactions History",
              },
            },
          },
        });
        return () => {
          myChart.destroy();
        };
      }
    },
    //eslint-disable-next-line
    []
  );

  return <canvas ref={chartContainer} />;
};

export default LineChart;
