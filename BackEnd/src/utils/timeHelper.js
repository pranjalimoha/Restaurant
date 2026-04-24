export const normalizeTime = (timeStr) => {
  if (!timeStr) throw new Error("Time is required");

  timeStr = timeStr.trim().toLowerCase();

  // Replace dot with colon (6.30 → 6:30)
  timeStr = timeStr.replace(".", ":");

  // Handle AM/PM
  const isPM = timeStr.includes("pm");
  const isAM = timeStr.includes("am");

  // Remove am/pm
  timeStr = timeStr.replace(/am|pm/g, "").trim();

  let [hours, minutes] = timeStr.split(":");

  hours = parseInt(hours);
  minutes = parseInt(minutes || "0");

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Invalid time format");
  }

  // Convert to 24-hour format
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  // Pad values
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${hh}:${mm}`;
};
