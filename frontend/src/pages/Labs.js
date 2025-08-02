import React, { useState } from "react";
import AddLabs from "../components/AddLabs"; // ✅ Importing the unified Add/Edit component

function Labs() {
  const [labs, setLabs] = useState([
    {
      _id: "1",
      name: "Delhi Component Lab",
      category: "Component Storage Lab",
      image: "https://via.placeholder.com/400x250.png?text=Component+Lab",
      status: "Active",
      managerName: "Rajesh Kumar",
    },
    {
      _id: "2",
      name: "Mumbai R&D Lab",
      category: "R&D Lab",
      image: "https://via.placeholder.com/400x250.png?text=R%26D+Lab",
      status: "Inactive",
      managerName: "Priya Sharma",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null); // 🔁 Holds data to edit if any

  const handleModalToggle = () => {
    setEditData(null); // reset edit data
    setShowModal(true);
  };

  const handleLabAdded = (lab) => {
    if (editData) {
      // If editing, update existing lab
      setLabs((prev) =>
        prev.map((l) => (l._id === lab._id ? { ...l, ...lab } : l))
      );
    } else {
      // If adding new
      setLabs((prev) => [...prev, lab]);
    }
    setShowModal(false);
    setEditData(null);
  };

  const handleEdit = (labId) => {
    const selected = labs.find((lab) => lab._id === labId);
    setEditData(selected);
    setShowModal(true);
  };

  const handleDelete = (labId) => {
    const confirmDelete = window.confirm("Are you sure to delete this lab?");
    if (confirmDelete) {
      setLabs((prev) => prev.filter((lab) => lab._id !== labId));
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-6 w-11/12 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-900">🏬 Manage Labs</h2>
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2 rounded shadow-md transition-all"
            onClick={handleModalToggle}
          >
            ➕ Add Lab
          </button>
        </div>

        {/* Modal for Add/Edit Lab */}
        {showModal && (
          <AddLabs
            onSuccess={handleLabAdded}
            onClose={() => {
              setShowModal(false);
              setEditData(null);
            }}
            isEditMode={!!editData}
            editData={editData}
          />
        )}

        {/* Lab Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => (
            <div
              key={lab._id}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-all p-4 border border-gray-100 flex flex-col justify-between"
            >
              <img
                src={
                  lab.image ||
                  "https://via.placeholder.com/400x250.png?text=No+Image"
                }
                alt={lab.category}
                className="rounded-lg object-cover h-48 w-full"
              />
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-bold text-gray-800">
                  🧪 {lab.category}
                </h3>
                <p className="text-sm text-gray-600">👤 {lab.managerName}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                    lab.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {lab.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => handleEdit(lab._id)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  onClick={() => handleDelete(lab._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Labs;
