import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    imageUrl: "",
    role: "Researcher", // Default role
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = () => {
    fetch("http://localhost:4000/api/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((result) => {
        alert("Successfully Registered, Now Login with your details");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryapp");

    await fetch("https://api.cloudinary.com/v1_1/dwxpz34o9/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ ...form, imageUrl: data.url });
        alert("Image Successfully Uploaded");
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
        <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={require("../assets/logo.png")}
              alt="Logo"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register your account
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
              <div className="flex gap-4">
                <input
                  name="firstName"
                  type="text"
                  required
                  className="w-full rounded-t-md border px-2 py-1 text-sm"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleInputChange}
                />
                <input
                  name="lastName"
                  type="text"
                  required
                  className="w-full rounded-t-md border px-2 py-1 text-sm"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <input
                name="email"
                type="email"
                required
                className="w-full border px-2 py-1 text-sm"
                placeholder="Email Address"
                value={form.email}
                onChange={handleInputChange}
              />
              <input
                name="password"
                type="password"
                required
                className="w-full border px-2 py-1 text-sm"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
              />
              <input
                name="phoneNumber"
                type="number"
                required
                className="w-full border px-2 py-1 text-sm"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleInputChange}
              />

              {/* Role Dropdown */}
              <select
                name="role"
                value={form.role}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 text-sm"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Researcher">Researcher</option>
                <option value="Manufacturing Engineer">Manufacturing Engineer</option>
              </select>

              {/* Upload Image */}
              <UploadImage uploadImage={uploadImage} />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-900">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 text-indigo-600"
                  checked
                  readOnly
                />
                I Agree to Terms & Conditions
              </label>
              <span className="text-sm text-indigo-600 hover:text-indigo-500 cursor-pointer">
                Forgot password?
              </span>
            </div>

            <div>
              <button
                type="submit"
                onClick={registerUser}
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-900"
              >
                Sign up
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                  Sign in now
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="flex justify-center order-first sm:order-last">
          <img src={require("../assets/signup.jpg")} alt="" />
        </div>
      </div>
    </>
  );
}

export default Register;
