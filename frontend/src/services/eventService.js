import api from "./api";

export const getEvents = (filters = {}) => api.get("/events", { params: filters });

export const getEventById = (id) => api.get(`/events/${id}`);

export const registerForEvent = (data) => api.post("/registrations", data);

export const getMyRegistrations = () => api.get("/registrations/my");

// Admin-only functions
export const createEvent = (data) => api.post("/events", data);

export const updateEvent = (id, data) => api.put(`/events/${id}`, data);

export const deleteEvent = (id) => api.delete(`/events/${id}`);