import { createContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuCount, setMenuCount] = useState(0);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/menuc`);
      setMenuCount(res.data.total);

    } catch (err) {
      console.error("Axios Error:", err);
    }
  };

  return (
    <MenuContext.Provider value={{ menuCount, fetchCount }}>
      {children}
    </MenuContext.Provider>
  );
}
