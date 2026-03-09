"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@mui/material/Button";
import ExportButton from "./Export";

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

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return (
    <div className="relative flex h-[7dvh] w-full items-center justify-center rounded-bl-[38px] bg-[#ff3388] px-[2vw] md:justify-between">
      <div className="flex items-center gap-[2dvw]">
        <div
          id="nav-logo"
          className="select-none font-andika text-[36px] text-white md:text-[5vmin]"
          onClick={() => router.push("/main")}
        >
          ONSPOT
        </div>
      </div>

      <div className="hidden items-center space-x-[1dvw] md:flex">
        <Button
          id="nav-main-menu"
          variant="contained"
          sx={buttonStyles}
          onClick={() => router.push("/main")}
        >
          <b className="font-andika">รายการแจ้งเหตุทั้งหมด</b>
        </Button>

        <Button id="nav-map" variant="contained" sx={buttonStyles} onClick={() => router.push("/map")}> 
          <b className="font-andika">แผนที่</b>
        </Button>

        <Button
          id="nav-assistance-types"
          variant="contained"
          sx={buttonStyles}
          onClick={() => router.push("/assistance-types")}
        >
          <b className="font-andika">จัดการประเภท</b>
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
