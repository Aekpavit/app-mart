import { createContext, useState } from "react";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuCount, setMenuCount] = useState(0);

  return (
    <MenuContext.Provider value={{ menuCount, setMenuCount }}>
      {children}
    </MenuContext.Provider>
  );
};
