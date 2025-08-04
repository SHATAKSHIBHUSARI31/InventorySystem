import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");

        // ✅ Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Set user in context and navigate
        authContext.signin(data.user, () => {
          const role = data.user.role;

          if (role === "Admin") {
            navigate("/manage-labs", { replace: true });
          } else if (role === "Technician") {
            navigate("/inventory", { replace: true });
          } else {
            navigate("/dashboard", { replace: true }); // Default page for others
          }
        });
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      <div className="flex justify-center">
        <img src={require("../assets/1234.avif")} alt="Login Visual" />
      </div>
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img
            className="mx-auto h-12 w-12"
            src={require("../assets/logo.png")}
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={loginUser}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={handleInputChange}
                className="relative block w-full rounded-t-md border py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
                className="relative block w-full rounded-b-md border py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-900">
              <input type="checkbox" className="h-4 w-4 mr-2 text-indigo-600" />
              Remember me
            </label>
            <div className="text-sm text-purple-700 hover:text-purple-900 cursor-pointer">
              Forgot your password?
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-purple-700 py-2 px-3 text-sm font-semibold text-white hover:bg-purple-600"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-purple-700 hover:text-purple-900 font-medium">
                Register now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
