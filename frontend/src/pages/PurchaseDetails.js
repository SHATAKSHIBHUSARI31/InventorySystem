import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AddPurchaseDetails from "../components/AddPurchaseDetails";

function PurchaseDetails() {
  const [showModal, setShowModal] = useState(false);

  const dummyPurchases = [
    {
      _id: "1",
      category: "Capacitors",
      name: "470uF Capacitor",
      manufacturer: "Murata",
      partNumber: "C470-MUR",
      quantityPurchased: 100,
      purchaseDate: "2025-07-15",
      totalPurchaseAmount: 500,
    },
    {
      _id: "2",
      category: "Resistors",
      name: "220 Ohm Resistor",
      manufacturer: "Vishay",
      partNumber: "R220-VIS",
      quantityPurchased: 200,
      purchaseDate: "2025-07-20",
      totalPurchaseAmount: 300,
    },
    {
      _id: "3",
      category: "ICs",
      name: "NE555 Timer",
      manufacturer: "Texas Instruments",
      partNumber: "NE555-TI",
      quantityPurchased: 50,
      purchaseDate: "2025-07-25",
      totalPurchaseAmount: 750,
    },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Purchase Details Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "Category",
          "Product Name",
          "Manufacturer",
          "Part Number",
          "Quantity",
          "Purchase Date",
          "Total Amount",
        ],
      ],
      body: dummyPurchases.map((item) => [
        item.category,
        item.name,
        item.manufacturer,
        item.partNumber,
        item.quantityPurchased,
        new Date(item.purchaseDate).toLocaleDateString(),
        `₹${item.totalPurchaseAmount}`,
      ]),
    });
    doc.save("purchase_details_report.pdf");
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showModal && (
          <AddPurchaseDetails
            addSaleModalSetting={() => setShowModal(false)}
            handlePageUpdate={() => {}}
            authContext={{ user: "dummyUserID" }}
            products={[]}
          />
        )}

        {/* Top Bar */}
        <div className="flex justify-between items-center py-3">
          <span className="text-xl font-bold">Purchase Details</span>
          <div className="flex gap-3">
            <button
              className="bg-red-600 text-white px-4 py-2 text-sm rounded hover:bg-red-700"
              onClick={downloadPDF}
            >
              📄 Export PDF
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              ➕ Add Purchase
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-left font-medium">Product Name</th>
                <th className="px-4 py-2 text-left font-medium">Manufacturer</th>
                <th className="px-4 py-2 text-left font-medium">Part Number</th>
                <th className="px-4 py-2 text-left font-medium">Quantity</th>
                <th className="px-4 py-2 text-left font-medium">Purchase Date</th>
                <th className="px-4 py-2 text-left font-medium">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dummyPurchases.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.manufacturer}</td>
                  <td className="px-4 py-2">{item.partNumber}</td>
                  <td className="px-4 py-2">{item.quantityPurchased}</td>
                  <td className="px-4 py-2">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">₹{item.totalPurchaseAmount}</td>
                </tr>
              ))}
              {dummyPurchases.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No purchase entries found.
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

export default PurchaseDetails;
