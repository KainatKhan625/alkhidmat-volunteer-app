const prisma = require("../config/prisma");

// Admin: get all volunteers waiting for approval
exports.getPendingVolunteers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        city: true,
        skills: true,
        status: true,
        totalHours: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin: approve a volunteer
exports.approveVolunteer = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: "APPROVED" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin: reject a volunteer
exports.rejectVolunteer = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: "REJECTED" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: "APPROVED" },
      orderBy: { totalHours: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        city: true,
        totalHours: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const cloudinary = require("../config/cloudinary");

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // upload the image buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "profile-pictures", resource_type: "image" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePic: uploadResult.secure_url },
      select: { id: true, name: true, email: true, profilePic: true },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};