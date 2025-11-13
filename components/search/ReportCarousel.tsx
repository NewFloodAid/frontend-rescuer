"use client";
import { Report } from "@/types/report";
import ReportCard from "../reports/ReportCard";
import { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ReportCarousel = ({ reports }: { reports: Report[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? reports.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === reports.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (reports.length === 0) {
    return <div className="font-kanit text-white">ไม่พบรายงาน</div>;
  }

  return (
    <div className="flex flex-row items-center justify-center font-kanit">
      <IconButton onClick={goToPrevious} sx={{ color: "gray" }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <div className="">
        <ReportCard report={reports[currentIndex]} />
      </div>
      <IconButton onClick={goToNext} sx={{ color: "gray" }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
};

export default ReportCarousel;
