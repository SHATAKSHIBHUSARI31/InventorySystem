import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const doughnutData = {
  labels: ["Resistors", "Capacitors", "ICs", "Diodes", "Transistors", "Relays"],
  datasets: [
    {
      label: "# of Components",
      data: [5, 10, 3, 7, 2, 8],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const authContext = useContext(AuthContext);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const [inwardOutwardChart, setInwardOutwardChart] = useState({
    options: {
      chart: {
        id: "inward-outward-line",
        toolbar: { show: false },
        animations: { enabled: true, easing: "easeinout", speed: 1000 },
      },
      xaxis: {
        categories: months,
        title: { text: "Month" },
      },
      yaxis: {
        title: { text: "Total Quantity" },
      },
      stroke: { curve: "smooth" },
      colors: ["#1E90FF", "#FF4500"],
      legend: {
        position: "top",
        horizontalAlign: "center",
      },
    },
    series: [
      {
        name: "Inwarded Items",
        data: [15, 25, 30, 20, 10, 40, 35, 50, 45, 60, 55, 70],
      },
      {
        name: "Outwarded Items",
        data: [10, 20, 25, 15, 5, 30, 25, 40, 35, 50, 45, 60],
      },
    ],
  });

  const [salesChart, setSalesChart] = useState({
    options: {
      chart: { id: "monthly-sales" },
      xaxis: { categories: months },
    },
    series: [
      {
        name: "Monthly Sales Amount",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
  }, []);

  const fetchTotalSaleAmount = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}/totalsaleamount`)
      .then((res) => res.json())
      .then((data) => setSaleAmount(data.totalSaleAmount));
  };

  const fetchTotalPurchaseAmount = () => {
    fetch(`http://localhost:4000/api/purchase/get/${authContext.user}/totalpurchaseamount`)
      .then((res) => res.json())
      .then((data) => setPurchaseAmount(data.totalPurchaseAmount));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => setStores(data));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {authContext?.user?.firstName || "User"} 👋</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Sales */}
  <article className="bg-blue-100 border border-blue-300 p-6 rounded-lg shadow-sm">
    <strong className="text-sm text-blue-700">Sales</strong>
    <p className="text-2xl font-bold text-blue-900">Rs. {saleAmount}</p>
  </article>

  {/* Purchase */}
  <article className="bg-green-100 border border-green-300 p-6 rounded-lg shadow-sm">
    <strong className="text-sm text-green-700">Purchase</strong>
    <p className="text-2xl font-bold text-green-900">Rs. {purchaseAmount}</p>
  </article>

  {/* Total Products */}
  <article className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg shadow-sm">
    <strong className="text-sm text-yellow-700">Total Products</strong>
    <p className="text-2xl font-bold text-yellow-900">{products.length}</p>
  </article>

  {/* Total Stores */}
  <article className="bg-purple-100 border border-purple-300 p-6 rounded-lg shadow-sm">
    <strong className="text-sm text-purple-700">Total Stores</strong>
    <p className="text-2xl font-bold text-purple-900">{stores.length}</p>
  </article>
</div>


      {/* Charts */}
      <div className="flex flex-wrap justify-around bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">📈 Monthly Sales Amount (Rs)</h3>
          <Chart options={salesChart.options} series={salesChart.series} type="bar" width="500" />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">📊 Inventory Category Distribution</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Inward vs Outward Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">
          🔁 Inwarded vs Outwarded Items (Monthly)
        </h3>
        <Chart
          options={inwardOutwardChart.options}
          series={inwardOutwardChart.series}
          type="line"
          height={350}
        />
      </div>

      {/* Critical Low Stock */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-red-600 mb-2">⚠️ Critical Low Stock</h3>
        <ul className="text-sm list-disc pl-5 text-gray-700">
          <li>LM358 - Qty: 2</li>
          <li>BC547 - Qty: 1</li>
        </ul>
      </div>

      {/* Exceeding 3-Month Retention */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-600 mb-2">⏳ Components Exceeding 3-Month Retention</h3>
        <ul className="text-sm list-disc pl-5 text-gray-700">
          <li>Relay 5V - Added on Apr 2024</li>
          <li>Diode 1N4007 - Added on Mar 2024</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
