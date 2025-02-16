const ISTDateTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format
  });
  
  // Format IST date properly as "YYYY-MM-DD HH:MM AM/PM"
  export const formattedISTDateTime = ISTDateTime.replace(/\//g, "-").replace(",", "");
  
 
  