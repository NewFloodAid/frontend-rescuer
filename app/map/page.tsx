"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import NavBar from "@/components/Navbar";
import { useQueryGetReports } from "@/api/report";
import MainMap from "@/components/map/MainMap";
import { GetReportsQueryParams } from "@/types/report";
import { isAuthenticated } from "@/api/login";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import FilterPart from "@/components/search/Filter";
import StatusList from "@/components/search/PriorityList";
import ReportCarousel from "@/components/search/ReportCarousel";
import { useTutorial } from "@/providers/TutorialProvider";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DriveStep } from "driver.js";

const mapTutorialSteps: DriveStep[] = [
  {
    element: "#nav-main-menu",
    popover: {
      title: "เมนูหลัก",
      description: "กลับไปที่หน้ารายการแจ้งเหตุ",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#nav-export",
    popover: {
      title: "ดาวน์โหลดข้อมูล",
      description: "ดาวน์โหลดข้อมูลรายงานเป็นไฟล์ Excel ตามช่วงเวลาที่ต้องการ",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#tutorial-filter",
    popover: {
      title: "กรองข้อมูล",
      description: "กรองหมุดบนแผนที่ตามหมวดหมู่หรือสถานะ",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tutorial-map-view",
    popover: {
      title: "แผนที่",
      description: "ดูรายงานบนแผนที่ คลิกที่หมุดเพื่อดูรายละเอียด",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#tutorial-map-sidebar",
    popover: {
      title: "สถิติ",
      description: "ดูสรุปสถิติสถานะและรายงาน",
      side: "left",
      align: "start",
    },
  },
];

export default function Map() {
  const [queryParams, setQueryParams] = useState<GetReportsQueryParams>({});
  const queryReports = useQueryGetReports(queryParams);

  const router = useRouter();

  const { startTutorial } = useTutorial();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      const seen = localStorage.getItem("tutorial_seen_map");
      if (!seen) {
        setTimeout(() => {
          startTutorial(mapTutorialSteps, "map");
        }, 1000);
      }
    }
  }, [router, startTutorial]);

  const reports = useMemo(() => queryReports.data || [], [queryReports.data]);

  const filteredReports = useMemo(() => {
    const [firstName = "", lastName = ""] = "".split(" ");
    return reports.filter(
      (report) =>
        report.firstName.toLowerCase().includes(firstName) &&
        report.lastName.toLowerCase().includes(lastName)
    );
  }, [reports]);

  useEffect(() => {
    queryReports.refetch();
  }, [queryParams]);

  const onChangeReportsQueryParam = useCallback(
    (field: string, value: string | number | string[] | number[] | null) => {
      setQueryParams((prevParams) => ({ ...prevParams, [field]: value }));
    },
    []
  );

  if (queryReports.isPending) {
    return <Loader />;
  }

  return (
    <>
      <NavBar />
      <div className="mt-[0.75%] px-[3%]">
        <div id="tutorial-filter" className="flex flex-row mb-[1%] items-center font-kanit gap-[2%]">
          <FilterPart onChangeReportsQueryParam={onChangeReportsQueryParam} />
          <button
            onClick={() => startTutorial(mapTutorialSteps, "map")}
            className="flex items-center gap-1 px-3 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            title="Start Tutorial"
          >
            <HelpOutlineIcon />
            <span>Help</span>
          </button>
        </div>
        <div className="flex flex-row items-start">
          <div id="tutorial-map-view" className="w-3/4">
            <MainMap reports={filteredReports} />
          </div>
          <div id="tutorial-map-sidebar" className="flex flex-col items-center w-1/4 gap-10">
            <StatusList reports={filteredReports} />
            <ReportCarousel reports={filteredReports} />
          </div>
        </div>
      </div>
    </>
  );
}
