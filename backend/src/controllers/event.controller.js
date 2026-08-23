const prisma = require("../config/prisma");

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

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