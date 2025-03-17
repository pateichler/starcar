"use client";

import { createContext, useState } from "react";

type InteractContextValue = {
  curTime: number;
  setTime: (time: number) => void;
  
  leftTimeBound: number;
  setLeftTimeBound: (time: number) => void;

  rightTimeBound: number;
  setRightTimeBound: (time: number) => void;
};

export const InteractContext = createContext<InteractContextValue>({
  curTime: 0,
  setTime: (time: number) => {},

  leftTimeBound: 0,
  setLeftTimeBound: (time: number) => {},

  rightTimeBound: 0,
  setRightTimeBound: (time: number) => {},
});

export interface InteractContextProps {
  children?: React.ReactNode;
}

export default function InteractContextComponent({ children }: InteractContextProps) {
  const [curTime, setCurTime] = useState(0);
  const [leftTimeBound, setLeftTimeBound] = useState(0);
  const [rightTimeBound, setRightTimeBound] = useState(0);

  return (
    <InteractContext.Provider
      value={{
        curTime,
        setTime: setCurTime,
        leftTimeBound,
        setLeftTimeBound,
        rightTimeBound,
        setRightTimeBound
      }}
    >
      {children}
    </InteractContext.Provider>
  );
}