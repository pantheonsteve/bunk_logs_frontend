import { createContext, useState } from "react";

export const DateContext = createContext();

export function DateProvider({ children }) {
  // Initialize with a default date, or use null if you prefer.
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}