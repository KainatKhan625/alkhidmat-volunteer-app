const prisma = require("../config/prisma");
const { generateCertificate } = require("../services/certificate.service");
const QRCode = require("qrcode");

const HOURS_PER_EVENT = 4;

exports.registerForEvent = async (req, res) => {
  try {
    const {
      eventId,
      fullName,
      contactNumber,
      cnic,
      availability,
      relevantExperience,
      additionalNotes,
    } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }

    if (!contactNumber || !contactNumber.trim()) {
      return res.status(400).json({ message: "Contact number is required" });
    }

    if (!cnic || !cnic.trim()) {
      return res.status(400).json({ message: "CNIC number is required" });
    }

    if (!availability) {
      return res.status(400).json({ message: "Availability is required" });
    }

    const existing = await prisma.registration.findUnique({
      where: { userId_eventId: { userId: req.user.id, eventId } },
    });

    if (existing) {
      return res.status(409).json({ message: "Already registered for this event" });
    }

    const registration = await prisma.registration.create({
      data: {
        userId: req.user.id,
        eventId,
        fullName: fullName.trim(),
        contactNumber: contactNumber.trim(),
        cnic: cnic.trim(),
        availability,
        relevantExperience: relevantExperience || null,
        additionalNotes: additionalNotes || null,
      },
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

    // Fetch all certificates for this user, so we can match them to registrations by eventId
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user.id },
    });

    const registrationsWithExtras = await Promise.all(
      registrations.map(async (reg) => {
        const certificate = certificates.find((cert) => cert.eventId === reg.eventId);

        // Only generate a QR code if attendance hasn't been marked yet
        let qrCode = null;
        if (reg.status === "REGISTERED") {
          qrCode = await QRCode.toDataURL(reg.id);
        }

        return { ...reg, certificate: certificate || null, qrCode };
      })
    );

    res.json(registrationsWithExtras);
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
      certificate = await generateCertificate(updatedUser, registration.event, HOURS_PER_EVENT, registration.fullName);
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

    const certificate = await generateCertificate(updatedUser, registration.event, HOURS_PER_EVENT, registration.fullName);

    res.json({ registration, certificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.registration.findMany({
      where: { eventId: req.params.eventId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};