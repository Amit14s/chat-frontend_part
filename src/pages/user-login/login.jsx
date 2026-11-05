import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/useUserStore";
import {
  loginWithPassword,
  registerWithPassword,
} from "../../services/user.services";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (isRegister && !cleanUsername) {
      setError("Please enter your username.");
      return;
    }

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = isRegister
        ? await registerWithPassword(
            cleanUsername,
            cleanEmail,
            password
          )
        : await loginWithPassword(cleanEmail, password);

      // Backend response:
      // { success: true, message, token, user: {...} }

      if (!result?.success || !result?.user?._id) {
        throw new Error(
          result?.message || "Authentication failed."
        );
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      setUser(result.user);

      toast.success(
        result.message ||
          (isRegister
            ? "Registration successful!"
            : "Login successful!")
      );

      navigate("/", { replace: true });

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Messenger
        </h1>

        <p className="mb-6 text-center text-gray-500">
          {isRegister
            ? "Create your account"
            : "Welcome back"}
        </p>

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">

          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
            className={`rounded-md py-2 font-medium ${
              !isRegister
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
            className={`rounded-md py-2 font-medium ${
              isRegister
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Register
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {isRegister && (
            <input
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />
          )}

          <input
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
            type="password"
            placeholder="Password"
            autoComplete={
              isRegister
                ? "new-password"
                : "current-password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            minLength={isRegister ? 6 : undefined}
            required
          />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Login"}
          </button>

        </form>

        <p className="mt-5 text-center text-sm text-gray-500">

          {isRegister
            ? "Already have an account?"
            : "New to Messenger?"}

          {" "}

          <button
            type="button"
            className="font-semibold text-blue-600 hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister
              ? "Login"
              : "Create account"}
          </button>

        </p>

      </div>
    </div>
  );
}