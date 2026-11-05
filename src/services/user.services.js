import API from "./api";

// REGISTER
export const registerWithPassword = async (
  username,
  email,
  password
) => {
  const { data } = await API.post("/auth/register", {
    username,
    email,
    password,
  });

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

// LOGIN
export const loginWithPassword = async (
  email,
  password
) => {
  const { data } = await API.post("/auth/login", {
    email,
    password,
  });

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

// SEND OTP (kept for compatibility)
export const sendOtp = async (
  phoneNumber,
  phoneSuffix,
  email
) => {
  const { data } = await API.post("/auth/send-otp", {
    phoneNumber,
    phoneSuffix,
    email,
  });

  return data;
};

// VERIFY OTP (kept for compatibility)
export const verifyOtp = async (
  phoneNumber,
  phoneSuffix,
  otpString,
  email
) => {
  const { data } = await API.post("/auth/verify-otp", {
    phoneNumber,
    phoneSuffix,
    otp: otpString,
    email,
  });

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

// UPDATE PROFILE
export const updateUserProfile = async (updateData) => {
  const { data } = await API.put(
    "/auth/update-profile",
    updateData
  );

  return data;
};

// CHECK AUTHENTICATION
export const checkUSerAuth = async () => {
  try {
    const { data } = await API.get(
      "/auth/check-auth"
    );

    const user =
      data?.data?.user ||
      data?.data ||
      data?.user;

    return {
      isAuthenticated: Boolean(user?._id),
      user: user || null,
    };

  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    const { data } = await API.get("/auth/logout");
    return data;
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
  }
};

// GET ALL USERS
export const getAllUser = async () => {
  const { data } = await API.get("/auth/users");
  return data;
};