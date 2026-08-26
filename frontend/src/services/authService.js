import api from "./api";

export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) => api.post("/auth/login", data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (email, code, newPassword) =>
  api.post("/auth/reset-password", { email, code, newPassword });