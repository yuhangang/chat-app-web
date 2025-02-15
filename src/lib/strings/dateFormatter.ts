const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Return "Invalid date" if the timestamp is invalid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Helper function to format time in 12-hour format
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24h to 12h format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Helper function to get month name
  const getMonthName = (month: number): string => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    return date.toDateString() === now.toDateString();
  };

  // Check if date is yesterday
  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  // Format based on date
  if (isToday(date)) {
    return formatTime(date); // e.g. "2:30 PM"
  }

  if (isYesterday(date)) {
    return `Yesterday at ${formatTime(date)}`; // e.g. "Yesterday at 2:30 PM"
  }

  const month = getMonthName(date.getMonth());
  const day = date.getDate();
  const time = formatTime(date);

  if (date.getFullYear() === now.getFullYear()) {
    return `${month} ${day}, ${time}`; // e.g. "Feb 15, 2:30 PM"
  }

  return `${month} ${day}, ${date.getFullYear()} ${time}`; // e.g. "Feb 15, 2024 2:30 PM"
};

export default formatTimestamp;
