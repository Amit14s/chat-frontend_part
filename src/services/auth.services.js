import API from "./api";

export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", {
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  if (data?.token) {
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

export const getAllUsers = async () => {
  const { data } = await API.get("/auth/users");
  return data;
};

export const searchUsers = async (email) => {
  const { data } = await API.get(
    "/auth/search-user",
    {
      params: { email },
    }
  );

  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await API.put(
    "/auth/update-profile",
    formData
  );

  return data;
};