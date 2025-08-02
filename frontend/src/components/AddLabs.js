import { Fragment, useRef, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddLabs({ onClose, onSuccess, editData = null, isEditMode = false }) {
  const authContext = useContext(AuthContext);
  const cancelButtonRef = useRef(null);

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: authContext.user,
    name: "",
    category: "Component Storage Lab",
    address: "",
    city: "",
    image: "",
    status: "Active",
    managerName: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({ ...form, ...editData });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async (image) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryapp");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dwxpz34o9/image/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setForm({ ...form, image: json.secure_url });
      toast.success("✅ Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = () => {
    setForm({ ...form, image: "" });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.managerName) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Update existing lab
        const res = await fetch(`http://localhost:4000/api/lab/update/${form._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          toast.success("✅ Lab updated successfully!");
          setTimeout(() => {
            onSuccess(form);
            setOpen(false);
            onClose();
          }, 1000);
        } else {
          toast.error("❌ Failed to update lab");
        }
      } else {
        // Add new lab
        const res = await fetch("http://localhost:4000/api/lab/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          toast.success("🎉 Lab added successfully!");
          const result = await res.json();
          setTimeout(() => {
            onSuccess(result);
            setOpen(false);
            onClose();
          }, 1000);
        } else {
          toast.error("❌ Failed to add lab.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      {isEditMode ? (
                        <PencilIcon className="h-6 w-6 text-blue-600" />
                      ) : (
                        <PlusIcon className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <h3 className="ml-4 text-lg font-bold text-gray-800">
                      {isEditMode ? "✏️ Edit Lab" : "➕ Add Lab"}
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Lab Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                        placeholder="Enter Lab name"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Category *</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="Component Storage Lab">Component Storage Lab</option>
                        <option value="R&D Lab">R&D Lab</option>
                        <option value="Testing & Validation Lab">Testing & Validation Lab</option>
                        <option value="Repair & Maintenance Lab">Repair & Maintenance Lab</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium">Manager Name *</label>
                    <input
                      type="text"
                      name="managerName"
                      value={form.managerName}
                      onChange={handleInputChange}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  {/* Upload Image */}
                  <div className="mt-4">
                    <label className="text-sm font-medium">Lab Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e.target.files[0])}
                      className="mt-1 text-sm"
                    />
                    {uploading && <p className="text-blue-500 text-xs">Uploading image...</p>}
                    {form.image && (
                      <div className="mt-2">
                        <img
                          src={form.image}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="text-red-500 text-sm mt-1"
                        >
                          ❌ Remove Image
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`px-4 py-2 rounded text-white ${
                        loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {loading ? (isEditMode ? "Updating..." : "Adding...") : isEditMode ? "Update" : "Add Lab"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onClose();
                      }}
                      ref={cancelButtonRef}
                      className="px-4 py-2 rounded border"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <ToastContainer position="bottom-right" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
