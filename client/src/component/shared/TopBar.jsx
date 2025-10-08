import { useState, useEffect } from "react";
import DateFormatter from "../../utils/DateFormatter";

export default function TopBar() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const updateDates = () => {
      const dateFormatter = new DateFormatter();
      const now = new Date();
      setFormattedDate(dateFormatter.getFormattedDate(now));
    };

    updateDates();
    const timer = setInterval(updateDates, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      <div className="h-10 bg-gradient-to-r from-white via-green-900 to-white flex items-center justify-center text-black font-medium">
        <span className="text-white font-inter1  text-base lg:text-lg py-2">{formattedDate}</span>
      </div>
    </div>
  );
}