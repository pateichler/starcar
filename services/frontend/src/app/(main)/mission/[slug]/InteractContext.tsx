"use client";

import { createContext, useState } from "react";

type InteractContextValue = {
  curTime: number;
  setTime: (time: number) => void;
};

export const InteractContext = createContext<InteractContextValue>({
  curTime: 0,
  setTime: (time: number) => {},
});

export interface InteractContextProps {
  children?: React.ReactNode;
}

export default function InteractContextComponent({ children }: InteractContextProps) {
  const [curTime, setCurTime] = useState(0);

  return (
    <InteractContext.Provider
      value={{
        curTime,
        setTime: setCurTime
      }}
    >
      {children}
    </InteractContext.Provider>
  );
}