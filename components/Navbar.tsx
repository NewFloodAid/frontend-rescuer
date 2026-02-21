"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ExportButton from "./Export";
import Button from "@mui/material/Button";

const buttonStyles = {
  width: "auto",
  minWidth: "max-content",
  height: "5dvh",
  padding: "0 1.5dvw",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontSize: "2.5vmin",
  fontFamily: "kanit",
  backgroundColor: "white",
  color: "#8c0000",
  whiteSpace: "nowrap",
  borderRadius: "10px",
};

const NavBar = () => {
  const router = useRouter();

  // Initialize state for exportParams
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return (
    <div className="flex justify-between items-center bg-[#ff3388] h-[7dvh] rounded-bl-[38px] px-[2vw] w-full">
      {/* Left side: Logo */}
      <div className="flex items-center gap-[2dvw]">
        <div
          id="nav-logo"
          className="flex items-center font-andika text-[5vmin] text-white cursor-pointer select-none"
          onClick={() => router.push("/main")}
        >
          ONSPOT
        </div>
      </div>

      {/* Right side: Navigation Buttons */}
      <div className="flex items-center space-x-[1dvw]">
        <Button
          id="nav-main-menu"
          variant="contained"
          sx={buttonStyles}
          onClick={() => router.push("/main")}
        >
          <b className="font-andika">รายการแจ้งเหตุทั้งหมด</b>
        </Button>
        <Button
          id="nav-map"
          variant="contained"
          sx={buttonStyles}
          onClick={() => router.push("/map")}
        >
          <b className="font-andika">แผนที่</b>
        </Button>
        <div id="nav-export">
          <ExportButton
            text="ดาวน์โหลดข้อมูล"
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
