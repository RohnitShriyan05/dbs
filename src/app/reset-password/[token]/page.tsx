"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams() as { token: string };
  const decodedToken = token ? decodeURIComponent(token) : "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!decodedToken) {
      setError("Invalid or missing reset token.");
    }
  }, [decodedToken]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/reset-password", {
        token: decodedToken,
        newPassword,
      });
      setSuccess(response.data.message);
      setTimeout(() => {
        router.push("/login"); // Redirect to login page after success
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800 flex flex-col items-center justify-center px-5 py-2 rounded-2xl w-100">
        <h1 className="text-3xl mb-8 mt-3 text-gray-100 font-bold">
          Reset Your Password
        </h1>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form
          className="flex flex-col gap-4 w-full max-w-sm"
          onSubmit={handleResetPassword}
        >
          <input
            type="password"
            placeholder="New Password"
            className="bg-gray-700 p-2.5 rounded-lg mb-4 focus:outline-gray-300 focus:outline-2 text-gray-200"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-gray-700 p-2.5 rounded-lg mb-4 focus:outline-gray-300 focus:outline-2 text-gray-200"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white transition-all
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              }`}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
