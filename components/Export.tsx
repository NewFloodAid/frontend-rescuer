"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { excel } from "@/api/excel";
import DatePicker from "./DatePicker"; // Import DatePicker component
import DownloadIcon from "@mui/icons-material/Download";

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

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40vw",
  borderRadius: "10px",
  bgcolor: "background.paper",
  fontFamily: "kanit",
  boxShadow: 24,
  padding: "2%",
};

interface ExportButtonProps {
  text: string;
  startDate: string;
  endDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

const ExportButton = ({
  text,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ExportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const result = await excel(startDate, endDate);
      if (result.success) {
        console.log("Export successful");
        handleClose();
      } else {
        console.error("Export failed:", result.message);
        alert(`Export failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert(`Export failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" sx={{ ...buttonStyles, gap: "0.5vw" }} onClick={handleOpen}>
        <b className="font-andika">{text}</b>
        <img src="/images/excel-logo.png" alt="Excel" className="w-[6vmin] h-auto object-contain" />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyles}>
          <div className="flex justify-center text-[2.5vmin] font-semibold mb-[2%]">
            นำออกข้อมูล
          </div>
          <div className="flex justify-center text-[2vmin] mb-[2%]">
            เลือกวันที่ ที่ต้องการจะนำออกเป็นไฟล์ Excel
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col space-y-[5%]">
              <div className="flex flex-col">
                <div className="text-[2.5vmin] text-[#505050]">ตั้งแต่วันที่</div>
                <DatePicker value={startDate} onChange={setStartDate} />
              </div>
              <div className="flex flex-col">
                <div className="text-[2.5vmin] text-[#505050]">ถึงวันที่</div>
                <DatePicker value={endDate} onChange={setEndDate} />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-[6%] gap-[3%]">
            <Button
              variant="contained"
              disabled={isLoading}
              sx={{
                ...buttonStyles,
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: "#52b202 ",
                color: "white",
              }}
              onClick={handleExport}
            >
              {isLoading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด"}
              <DownloadIcon />
            </Button>
            <Button
              variant="outlined"
              sx={{
                ...buttonStyles,
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: "#FF0000",
                color: "white",
              }}
              onClick={handleClose}
            >
              ยกเลิก
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ExportButton;
