import React, { useState } from "react";
import { FaTimes, FaSearch, FaUser } from "react-icons/fa";
import { useChatStore } from "../../store/chatStore";

function AddUser({ onClose, onUserSelect, theme }) {
  const [input, setInput] = useState("");
  const [phoneSuffix, setPhoneSuffix] = useState("+91");
  const [foundUser, setFoundUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { searchUser } = useChatStore();

  const isEmail = input.includes("@");

  const handleSearch = async () => {
    const value = input.trim();

    if (!value) {
      setError("Enter an email or phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setFoundUser(null);

    try {
      const result = await searchUser(value, phoneSuffix);

      if (result?.found && result?.user) {
        foundUser && setFoundUser(null);
        setFoundUser(result.user);
      } else {
        setError(result?.message || "No user found.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "No user found."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (!foundUser) return;

    onUserSelect(foundUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className={`w-full max-w-md rounded-2xl p-5 shadow-xl ${
          theme === "dark"
            ? "bg-[#202735] text-white"
            : "bg-white text-gray-800"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Add New Chat
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex gap-2">
          {!isEmail && (
            <select
              value={phoneSuffix}
              onChange={(e) => setPhoneSuffix(e.target.value)}
              className={`w-24 px-2 rounded-xl border outline-none ${
                theme === "dark"
                  ? "bg-[#151922] border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
              <option value="+971">+971</option>
              <option value="+93">+93</option>
            </select>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
              setFoundUser(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Email or phone number"
            className={`flex-1 min-w-0 px-4 py-3 rounded-xl outline-none border ${
              theme === "dark"
                ? "bg-[#151922] border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-800"
            }`}
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSearch />
          </button>
        </div>

        {loading && (
          <p className="text-sm text-gray-500 mt-4">
            Searching...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-500 mt-4">
            {error}
          </p>
        )}

        {foundUser && !loading && (
          <div
            className={`mt-5 p-3 rounded-xl flex items-center gap-3 ${
              theme === "dark"
                ? "bg-[#151922]"
                : "bg-gray-50"
            }`}
          >
            {foundUser.profilePicture ? (
              <img
                src={foundUser.profilePicture}
                alt={foundUser.username || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <FaUser className="text-gray-600 text-lg" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {foundUser.username || "User"}
              </p>

              <p className="text-sm text-gray-500 truncate">
                {foundUser.email ||
                  `${foundUser.phoneSuffix || ""}${foundUser.phoneNumber || ""}`}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelect}
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddUser;