import api from "./api";

export const getEvents = (filters = {}) => api.get("/events", { params: filters });

export const getEventById = (id) => api.get(`/events/${id}`);

export const registerForEvent = (eventId) => api.post("/registrations", { eventId });

export const getMyRegistrations = () => api.get("/registrations/my");