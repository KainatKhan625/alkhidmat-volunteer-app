const prisma = require("../config/prisma");
const { generateCertificate } = require("../services/certificate.service");
const QRCode = require("qrcode");

const HOURS_PER_EVENT = 4;

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: req.user.id, eventId } },
    });

    if (existing) {
      return res.status(409).json({ message: "Already registered for this event" });
    }

    const registration = await prisma.registration.create({
      data: { userId: req.user.id, eventId },
    });

    // generate a QR code containing this registration's ID
    const qrCodeDataUrl = await QRCode.toDataURL(registration.id);

    res.status(201).json({ registration, qrCode: qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId: req.user.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const registration = await prisma.registration.update({
      where: { id: req.params.id },
      data: {
        status,
        hoursAwarded: status === "PRESENT" ? HOURS_PER_EVENT : 0,
      },
      include: { event: true },
    });

    let certificate = null;

    if (status === "PRESENT") {
      // credit hours to the volunteer's total
      const updatedUser = await prisma.user.update({
        where: { id: registration.userId },
        data: { totalHours: { increment: HOURS_PER_EVENT } },
      });

      // generate a certificate for this specific event
      certificate = await generateCertificate(updatedUser, registration.event, HOURS_PER_EVENT);
    }

    res.json({ registration, certificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.scanAndMarkAttendance = async (req, res) => {
  try {
    const { registrationId } = req.body; // comes from scanning the QR code

    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: "PRESENT",
        hoursAwarded: HOURS_PER_EVENT,
      },
      include: { event: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: registration.userId },
      data: { totalHours: { increment: HOURS_PER_EVENT } },
    });

    const certificate = await generateCertificate(updatedUser, registration.event, HOURS_PER_EVENT);

    res.json({ registration, certificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};