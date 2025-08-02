import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [products, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setAllStores] = useState([]);

  const authContext = useContext(AuthContext);

  // Dummy data for demo
  useEffect(() => {
    const dummyProducts = [
      {
        _id: "1",
        category: "Capacitors",
        name: "470uF Capacitor",
        manufacturer: "Murata",
        partNumber: "C470UF",
        description: "Electrolytic Capacitor",
        stock: 120,
        location: "Bin A1",
        unitPrice: 4.5,
        criticalLow: 50,
      },
      {
        _id: "2",
        category: "Resistors",
        name: "10KΩ Resistor",
        manufacturer: "Vishay",
        partNumber: "R10KOHM",
        description: "Standard resistor",
        stock: 20,
        location: "Bin B3",
        unitPrice: 1.2,
        criticalLow: 25,
      },
      {
        _id: "3",
        category: "ICs",
        name: "ATmega328P",
        manufacturer: "Microchip",
        partNumber: "ATMEGA328P-PU",
        description: "Microcontroller",
        stock: 5,
        location: "Bin C5",
        unitPrice: 45.0,
        criticalLow: 10,
      },
    ];
    setAllProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
    setAllStores([{ id: 1 }, { id: 2 }]); // Dummy store count
  }, []);

  const addProductModalSetting = () => setShowProductModal(!showProductModal);

  const handlePageUpdate = (newProduct) => {
    const updatedProducts = [...products, newProduct];
    setAllProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const deleteItem = (id) => {
    const newList = filteredProducts.filter((item) => item._id !== id);
    setAllProducts(newList);
    setFilteredProducts(newList);
  };

  const handleSearchTerm = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.manufacturer.toLowerCase().includes(term) ||
            p.partNumber?.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleCategoryFilter = (value) => {
    if (value === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === value));
    }
  };

  const handleManufacturerFilter = (value) => {
    if (value === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.manufacturer === value));
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Category",
      "Component Name",
      "Manufacturer",
      "Part Number",
      "Description",
      "Quantity",
      "Location/Bin",
      "Unit Price",
      "Critical Low Threshold",
      "Availability",
    ];
    const rows = filteredProducts.map((product) => [
      product.category,
      product.name,
      product.manufacturer,
      product.partNumber,
      product.description,
      product.stock,
      product.location,
      product.unitPrice,
      product.criticalLow,
      product.stock <= product.criticalLow ? "Low" : "In Stock",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {/* Dashboard Overview */}
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className="grid md:grid-cols-4 gap-4 p-5">
            <div>
              <p className="text-blue-600 font-semibold">Total Products</p>
              <p>{products.length}</p>
            </div>
            <div>
              <p className="text-yellow-600 font-semibold">Stores</p>
              <p>{stores.length}</p>
            </div>
            <div>
              <p className="text-purple-600 font-semibold">Top Selling</p>
              <p>5</p>
            </div>
            <div>
              <p className="text-red-600 font-semibold">Low Stocks</p>
              <p>{products.filter((p) => p.stock <= p.criticalLow).length}</p>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && updateProduct && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={() => setShowUpdateModal(false)}
          />
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 px-3 pb-4">
          <select
            className="border p-2 rounded text-sm"
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {[...new Set(products.map((p) => p.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded text-sm"
            onChange={(e) => handleManufacturerFilter(e.target.value)}
          >
            <option value="All">All Manufacturers</option>
            {[...new Set(products.map((p) => p.manufacturer))].map((mfg) => (
              <option key={mfg} value={mfg}>
                {mfg}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="border p-2 rounded text-sm"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchTerm}
          />
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            ⬇️ Download CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <span className="font-bold">Product Inventory</span>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
              onClick={addProductModalSetting}
            >
              ➕ Add Product
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-left font-medium">Component Name</th>
                <th className="px-4 py-2 text-left font-medium">Manufacturer</th>
                <th className="px-4 py-2 text-left font-medium">Part Number</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-left font-medium">Quantity</th>
                <th className="px-4 py-2 text-left font-medium">Location/Bin</th>
                <th className="px-4 py-2 text-left font-medium">Unit Price</th>
                <th className="px-4 py-2 text-left font-medium">Critical Low</th>
                <th className="px-4 py-2 text-left font-medium">Availability</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.manufacturer}</td>
                  <td className="px-4 py-2">{product.partNumber}</td>
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">{product.location}</td>
                  <td className="px-4 py-2">₹{product.unitPrice}</td>
                  <td className="px-4 py-2">{product.criticalLow}</td>
                  <td className="px-4 py-2">
                    {product.stock <= product.criticalLow ? (
                      <span className="text-red-600 font-semibold">Low</span>
                    ) : (
                      "In Stock"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className="text-blue-600 cursor-pointer mr-2"
                      onClick={() => updateProductModalSetting(product)}
                    >
                      Edit
                    </span>
                    <span
                      className="text-red-600 cursor-pointer"
                      onClick={() => deleteItem(product._id)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
