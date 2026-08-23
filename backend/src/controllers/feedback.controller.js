const prisma = require("../config/prisma");

exports.submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        eventId,
        rating,
        comment,
      },
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getEventFeedback = async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { eventId: req.params.eventId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};