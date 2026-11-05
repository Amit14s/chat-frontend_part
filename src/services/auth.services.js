
import API from "./api";

export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

export const checkAuth = async () => {
  const { data } = await API.get("/auth/check-auth");
  return data;
};

export const logoutUser = async () => {
  try {
    const { data } = await API.get("/auth/logout");
    return data;
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
  }
};

export const sendOtp = async (payload) => {
  const { data } = await API.post("/auth/send-otp", payload);
  return data;
};

export const verifyOtp = async (payload) => {
  const { data } = await API.post("/auth/verify-otp", payload);
  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await API.put("/auth/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getAllUsers = async () => {
  const { data } = await API.get("/auth/users");
  return data;
};

export const searchUsers = async (query) => {
  const { data } = await API.get("/auth/search-user", {
    params: { query },
  });

  return data;
};
