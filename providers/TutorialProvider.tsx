"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { driver, Driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

type TutorialContextType = {
  startTutorial: (steps: DriveStep[], key: string, onEnd?: () => void) => void;
  closeTutorial: () => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

const baseDriverConfig = {
  showProgress: true,
  animate: true,
  nextBtnText: 'ถัดไป',
  prevBtnText: 'ย้อนกลับ',
  doneBtnText: 'เสร็จสิ้น',
};

export const TutorialProvider = ({ children }: { children: React.ReactNode }) => {
  const driverObj = useRef<Driver | null>(null);

  useEffect(() => {
    driverObj.current = driver({
      ...baseDriverConfig,
      steps: [],
    });
  }, []);

  const startTutorial = (steps: DriveStep[], key: string, onEnd?: () => void) => {
    if (driverObj.current) {
      let completedAll = false;

      driverObj.current.setConfig({
        ...baseDriverConfig,
        steps,
        onDestroyStarted: () => {
          // Check if the user is on the last step when the tutorial is ending
          if (driverObj.current?.isLastStep()) {
            completedAll = true;
          }
          driverObj.current?.destroy();
        },
        onDestroyed: () => {
          localStorage.setItem(`tutorial_seen_${key}`, "true");
          // Only trigger onEnd if the user completed all steps
          if (completedAll) {
            onEnd?.();
          }
        }
      });
      driverObj.current.drive();
      localStorage.setItem(`tutorial_seen_${key}`, "true");
    }
  };
  const closeTutorial = () => {
    if (driverObj.current) {
      driverObj.current.destroy();
    }
  };

  return (
    <TutorialContext.Provider value={{ startTutorial, closeTutorial }}>
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
