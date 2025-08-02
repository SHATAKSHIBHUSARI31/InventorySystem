import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";

export default function AddProduct({ addProductModalSetting, handlePageUpdate }) {
  const authContext = useContext(AuthContext);

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const [product, setProduct] = useState({
    userId: authContext?.user || "demo-user",
    name: "",
    manufacturer: "",
    partNumber: "",
    description: "",
    stock: "",
    location: "",
    unitPrice: "",
    criticalLow: "",
    category: "",
  });

  const handleInputChange = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const handleSubmit = () => {
    if (!product.name || !product.category || !product.stock) {
      alert("Please fill required fields");
      return;
    }

    // You can replace this with actual backend call later
    console.log("New Product Added → ", product);
    alert("✅ Product added successfully!");

    handlePageUpdate(); // Refresh inventory
    addProductModalSetting(); // Close modal
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <PlusIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <Dialog.Title className="text-xl font-bold text-gray-800">Add New Product</Dialog.Title>
                  </div>

                  <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Component Name *"
                      className="border rounded px-3 py-2"
                      value={product.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Category *"
                      className="border rounded px-3 py-2"
                      value={product.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Manufacturer"
                      className="border rounded px-3 py-2"
                      value={product.manufacturer}
                      onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Part Number"
                      className="border rounded px-3 py-2"
                      value={product.partNumber}
                      onChange={(e) => handleInputChange("partNumber", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Quantity *"
                      className="border rounded px-3 py-2"
                      value={product.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      className="border rounded px-3 py-2"
                      value={product.unitPrice}
                      onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Location / Bin"
                      className="border rounded px-3 py-2"
                      value={product.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Critical Low Threshold"
                      className="border rounded px-3 py-2"
                      value={product.criticalLow}
                      onChange={(e) => handleInputChange("criticalLow", e.target.value)}
                    />
                    <textarea
                      placeholder="Description"
                      rows="3"
                      className="border rounded px-3 py-2 sm:col-span-2"
                      value={product.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    ></textarea>
                  </form>
                </div>

                <div className="bg-gray-100 px-6 py-3 flex justify-end gap-3">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={() => addProductModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    Add Product
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
