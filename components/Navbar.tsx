"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ExportButton from "./Export";

const NavBar = () => {
  const router = useRouter();

  // Initialize state for exportParams
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return (
    <div className="flex justify-between items-center bg-[#ff3388] h-[7dvh] rounded-bl-[38px] px-[2vw]">
      {/* Logo with Click Navigation */}
      <div
        className="flex items-center font-andika text-[5vmin] text-white cursor-pointer select-none"
        onClick={() => router.push("/main")}
      >
        ONSPOT
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-[1dvw]">
        <ExportButton 
          text="EXPORT" 
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>
    </div>
  );
};

export default NavBar;
