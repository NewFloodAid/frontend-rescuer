"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { driver, Driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

type TutorialContextType = {
  startTutorial: (steps: DriveStep[], key: string) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: React.ReactNode }) => {
  const driverObj = useRef<Driver | null>(null);

  useEffect(() => {
    driverObj.current = driver({
      showProgress: true,
      animate: true,
      steps: [],
      nextBtnText: 'ถัดไป',
      prevBtnText: 'ย้อนกลับ',
      doneBtnText: 'เสร็จสิ้น',
    });
  }, []);

  const startTutorial = (steps: DriveStep[], key: string) => {
    if (driverObj.current) {
      driverObj.current.setConfig({
        steps,
        onDestroyed: () => {
          localStorage.setItem(`tutorial_seen_${key}`, "true");
        }
      });
      driverObj.current.drive();
      localStorage.setItem(`tutorial_seen_${key}`, "true");
    }
  };

  return (
    <TutorialContext.Provider value={{ startTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
};
