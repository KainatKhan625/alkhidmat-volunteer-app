const prisma = require("../config/prisma");
const { sendPushNotifications } = require("../utils/pushNotifications");

// Anyone can view all events (with optional filters)
exports.getAllEvents = async (req, res) => {
  try {
    const { city, category } = req.query;

    const events = await prisma.event.findMany({
      where: {
        ...(city && { city }),
        ...(category && { category }),
      },
      orderBy: { date: "asc" },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Anyone can view a single event's details
exports.getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin only: create a new event
// Admin only: create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, city, location, date, seatsRequired } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        city,
        location,
        date: new Date(date),
        seatsRequired,
      },
    });

    res.status(201).json(event);

    // Notify all volunteers with a saved push token about the new event.
    // This runs after the response is sent, so it doesn't delay the admin's request.
    notifyVolunteersOfNewEvent(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Saves an in-app notification record for every volunteer, and sends them a push notification about a new event.
async function notifyVolunteersOfNewEvent(event) {
  try {
    const volunteers = await prisma.user.findMany({
      where: { role: "VOLUNTEER" },
      select: { id: true, pushToken: true },
    });

    const title = "New Volunteer Event";
    const body = `${event.title} in ${event.city} — tap to view details.`;

    // Save an in-app notification for every volunteer (so it shows up in their notification list)
    await prisma.notification.createMany({
      data: volunteers.map((v) => ({
        userId: v.id,
        eventId: event.id,
        title,
        body,
      })),
    });

    // Send a push notification only to volunteers who have a saved push token
    const tokens = volunteers
      .filter((v) => v.pushToken)
      .map((v) => v.pushToken);

    await sendPushNotifications(tokens, title, body, { eventId: event.id });
  } catch (err) {
    console.log("Error notifying volunteers of new event:", err);
  }
}

// Admin only: update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin only: delete an event
exports.deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};