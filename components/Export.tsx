"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { excel } from "@/api/excel";
import DatePicker from "./DatePicker"; // Import DatePicker component
import DownloadIcon from "@mui/icons-material/Download";

const buttonStyles = {
  width: "12dvw",
  height: "5dvh",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontSize: "2.5vmin",
  fontFamily: "kanit",
  backgroundColor: "white",
  color: "#8c0000",
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
  params?: { priorities: string };
  startDate: string;
  endDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

const ExportButton = ({
  text,
  params,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ExportButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExport = () => {
    if (params) {
      excel(startDate, endDate, params.priorities)
        .then((response) => {
          // handle success response
          console.log(response);
        })
        .catch((error) => {
          // handle error response
          console.error(error);
        });
    }
  };

  return (
    <>
      <Button variant="contained" sx={buttonStyles} onClick={handleOpen}>
        <b className="font-andika">{text}</b>
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
                <div className="text-[2.5vmin] text-[#505050]">FROM</div>
                <DatePicker value={startDate} onChange={setStartDate} />
              </div>
              <div className="flex flex-col">
                <div className="text-[2.5vmin] text-[#505050]">TO</div>
                <DatePicker value={endDate} onChange={setEndDate} />
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mt-[6%] gap-[3%]">
            <Button
              variant="contained"
              sx={{
                ...buttonStyles,
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: "#52b202 ",
                color: "white",
              }}
              onClick={() => {
                handleExport();
                handleClose();
              }}
            >
              Download
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
