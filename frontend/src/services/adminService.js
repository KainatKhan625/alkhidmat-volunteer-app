import api from "./api";

export const getDashboardStats = () => api.get("/users/dashboard-stats");

export const getAllVolunteers = () => api.get("/users/volunteers");

export const getRecentEvents = () => api.get("/events");

export const uploadProfilePicture = (formData) =>
  api.post("/users/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  
export const updateProfile = (data) => api.put("/users/profile", data);
export const getAllFeedback = () => api.get("/feedback/all");