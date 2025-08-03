import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const [filters, setFilters] = useState({
    product: "All",
    store: "All",
    date: "",
  });

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
        setFilteredSales(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllStores(data))
      .catch((err) => console.log(err));
  };

  const addSaleModalSetting = () => setShowSaleModal(!showSaleModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);

  const handleFilterChange = (type, value) => {
    const updated = { ...filters, [type]: value };
    setFilters(updated);

    const filtered = sales.filter((sale) => {
      const matchProduct =
        updated.product === "All" || sale.ProductID?.name === updated.product;
      const matchStore =
        updated.store === "All" || sale.StoreID?.name === updated.store;
      const matchDate =
        !updated.date || sale.SaleDate?.slice(0, 10) === updated.date;
      return matchProduct && matchStore && matchDate;
    });

    setFilteredSales(filtered);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Product", "Store", "Stock", "Date", "Total"]],
      body: filteredSales.map((sale) => [
        sale.ProductID?.name,
        sale.StoreID?.name || "N/A",
        sale.StockSold,
        new Date(sale.SaleDate).toLocaleDateString(),
        `₹${sale.TotalSaleAmount}`,
      ]),
    });
    doc.save("sales_report.pdf");
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}

        {/* Filters Section */}
        <div className="bg-white p-4 rounded flex flex-wrap gap-4 items-center justify-between">
          {/* Product Filter */}
          <div className="relative w-64">
            <select
              className="border p-3 pr-8 rounded text-base font-medium appearance-none w-full"
              value={filters.product}
              onChange={(e) => handleFilterChange("product", e.target.value)}
            >
              <option value="All">All Products</option>
              {products.map((p) => (
                <option key={p._id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M7 7l3-3 3 3z" />
              </svg>
            </div>
          </div>

          {/* Store Filter */}
          <div className="relative w-64">
            <select
              className="border p-3 pr-8 rounded text-base font-medium appearance-none w-full"
              value={filters.store}
              onChange={(e) => handleFilterChange("store", e.target.value)}
            >
              <option value="All">All Stores</option>
              {stores.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M7 7l3-3 3 3z" />
              </svg>
            </div>
          </div>

          {/* Date Filter */}
          <input
            type="date"
            className="border p-3 rounded text-base font-medium"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />

          {/* Export Button */}
          <button
            className="bg-red-600 text-white px-6 py-3 text-base rounded hover:bg-red-700"
            onClick={downloadPDF}
          >
            📄 Export PDF
          </button>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <span className="font-bold text-lg">Sales</span>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
              onClick={addSaleModalSetting}
            >
              ➕ Add Sale
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium">Product Name</th>
                <th className="px-4 py-2 text-left font-medium">Store Name</th>
                <th className="px-4 py-2 text-left font-medium">Stock Sold</th>
                <th className="px-4 py-2 text-left font-medium">Sales Date</th>
                <th className="px-4 py-2 text-left font-medium">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((element) => (
                <tr key={element._id}>
                  <td className="px-4 py-2">{element.ProductID?.name}</td>
                  <td className="px-4 py-2">{element.StoreID?.name || "N/A"}</td>
                  <td className="px-4 py-2">{element.StockSold}</td>
                  <td className="px-4 py-2">
                    {new Date(element.SaleDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">₹{element.TotalSaleAmount}</td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No matching sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
