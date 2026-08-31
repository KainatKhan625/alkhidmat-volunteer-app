import api from "./api";

export const getMyRegistrations = () => api.get("/registrations/my");

export const registerForEvent = (eventId) => api.post("/registrations", { eventId });

export const getEventRegistrations = (eventId) => api.get(`/registrations/event/${eventId}`);

export const markAttendance = (registrationId, status) =>
  api.put(`/registrations/${registrationId}/attendance`, { status });