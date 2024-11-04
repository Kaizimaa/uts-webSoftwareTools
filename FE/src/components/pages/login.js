import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Simpan token ke dalam cookie
        Cookies.set("token", data.token, { expires: 1 }); // Cookie berlaku 1 hari
        setNotification({ type: "success", message: data.message });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorData = await response.json();
        setNotification({ type: "error", message: errorData.message || "Login failed!" });
      }
    } catch (error) {
      setNotification({ type: "error", message: "An error occurred. Please try again later." });
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-wrap">
          <div className="w-full md:w-1/2 p-8">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full h-auto"
              alt="Login illustration"
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Login to Your Account
            </h2>
            {notification && (
              <div
                className={`mb-4 p-4 rounded ${
                  notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {notification.message}
              </div>
            )}
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username Address</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
