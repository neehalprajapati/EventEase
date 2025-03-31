import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateBookingHistoryPDF = (bookings, serviceDetailsMap) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold"); // Use bold font for better visibility
  doc.setTextColor(128, 0, 128); // Set text color to purple (RGB: 128, 0, 128)
  doc.setFillColor(230, 230, 250); // Light purple (Lavender)
  doc.rect(0, 0, 210, 297, "F");

  // Add Main Title
  doc.setFontSize(22);
  doc.text("Event Ease", 80, 15); // Centered title

  bookings.forEach((booking, index) => {
    const serviceName = serviceDetailsMap[booking.serviceId]?.serviceName || "N/A";
    const packageDetails = booking.package_details?.package_name || "Standard Booking";

    // Booking History Title
    const startY = 25 + index * 70; // Adjust startY dynamically
    doc.setFontSize(18);
    doc.text(`Invoice`, 14, startY);

    // Table data in vertical format
    const tableRows = [
      ["Service Company", serviceName],
      ["Type", booking.serviceType],
      ["Package Details", packageDetails],
      ["Booked On", new Date(booking.createdAt).toLocaleDateString()],
      ["Start Time", new Date(booking.startTime).toLocaleString()],
      ["End Time", new Date(booking.endTime).toLocaleString()],
      ["Status", booking.status.charAt(0).toUpperCase() + booking.status.slice(1)],
      ["Amount", `₹ ${booking.amount}`], // Rupee symbol
    ];

    autoTable(doc, {
      head: [["Field", "Value"]], // Column headers
      body: tableRows, // Vertical rows
      startY: startY + 10, // Ensure multiple bookings don't overlap
      theme: "grid",
      styles: { textColor: [128, 0, 128] }, // Purple text color
      headStyles: { fillColor: [75, 0, 130], textColor: [255, 255, 255] }, // Dark purple header with white text
    });
  });

  doc.save("booking_history.pdf");
};

export default generateBookingHistoryPDF;
