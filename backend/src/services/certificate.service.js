const PDFDocument = require("pdfkit");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const prisma = require("../config/prisma");

async function generateCertificate(user, event, hours) {
  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  const pageWidth = doc.page.width;   // ~842
  const pageHeight = doc.page.height; // ~595

  // Borders
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(3).stroke("#2E5395");
  doc.rect(30, 30, pageWidth - 60, pageHeight - 60).lineWidth(1).stroke("#2E5395");

  // Logo
  const logoPath = path.join(__dirname, "..", "..", "assets", "alkhidmat-logo.png");
  doc.image(logoPath, pageWidth / 2 - 28, 45, { width: 56 });

  // Org name
  doc.fontSize(12).fillColor("#2E5395").font("Helvetica-Bold")
    .text("ALKHIDMAT FOUNDATION", 0, 108, { align: "center" });

  // Title
  doc.fontSize(28).fillColor("#1A1A1A").font("Helvetica-Bold")
    .text("CERTIFICATE OF APPRECIATION", 0, 135, { align: "center" });

  // Decorative line
  doc.moveTo(pageWidth / 2 - 100, 178).lineTo(pageWidth / 2 + 100, 178)
    .lineWidth(2).stroke("#F5A623");

  // Body text
  doc.fontSize(14).fillColor("#444444").font("Helvetica")
    .text("This certificate is proudly presented to", 0, 210, { align: "center" });

  doc.fontSize(26).fillColor("#2E5395").font("Helvetica-Bold")
    .text(user.name, 0, 235, { align: "center" });

  doc.fontSize(14).fillColor("#444444").font("Helvetica")
    .text(`in recognition of ${hours} hours of dedicated volunteer service for`, 0, 285, { align: "center" });

  doc.fontSize(16).fillColor("#1A1A1A").font("Helvetica-Bold")
    .text(`"${event.title}"`, 0, 310, { align: "center" });

  // Footer
  const issueDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  doc.fontSize(11).fillColor("#666666").font("Helvetica")
    .text(`Issued on ${issueDate}`, 0, pageHeight - 90, { align: "center" });
  doc.fontSize(11).fillColor("#666666")
    .text("Alkhidmat Volunteer Program", 0, pageHeight - 70, { align: "center" });

  doc.end();

  const pdfBuffer = await new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          folder: "certificates",
          public_id: `certificate-${user.id}-${Date.now()}`,
          format: "pdf",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      )
      .end(pdfBuffer);
  });

  const certificate = await prisma.certificate.create({
    data: {
      userId: user.id,
      fileUrl: uploadResult.secure_url,
      hoursAtIssue: hours,
    },
  });

  return certificate;
}

module.exports = { generateCertificate };