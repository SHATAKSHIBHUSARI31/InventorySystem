import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddPurchaseDetails({
  addPurchaseModalSetting,
  products,
  handlePageUpdate,
  authContext
}) {
  const [purchase, setPurchase] = useState({
    userID: authContext.user,
    productID: "",
    quantityPurchased: "",
    purchaseDate: "",
    totalPurchaseAmount: "",
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setPurchase({ ...purchase, [key]: value });
  };

  const addPurchase = () => {
    fetch("http://localhost:4000/api/purchase/add", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(purchase),
    })
      .then(() => {
        alert("Purchase added successfully");
        handlePageUpdate();
        addPurchaseModalSetting();
      })
      .catch((err) => console.log(err));
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-lg w-full">
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                      <PlusIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">Add Purchase</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="productID" className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <select
                        id="productID"
                        name="productID"
                        value={purchase.productID}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quantityPurchased" className="block text-sm font-medium text-gray-700">
                        Quantity Purchased
                      </label>
                      <input
                        type="number"
                        id="quantityPurchased"
                        name="quantityPurchased"
                        value={purchase.quantityPurchased}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        placeholder="0 - 999"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="totalPurchaseAmount" className="block text-sm font-medium text-gray-700">
                        Total Amount
                      </label>
                      <input
                        type="number"
                        id="totalPurchaseAmount"
                        name="totalPurchaseAmount"
                        value={purchase.totalPurchaseAmount}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        placeholder="₹0.00"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        value={purchase.purchaseDate}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={addPurchase}
                    className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={addPurchaseModalSetting}
                    ref={cancelButtonRef}
                    className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
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
