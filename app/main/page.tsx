"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import NavBar from "@/components/Navbar";
import { useQueryGetReports } from "@/api/report";
import SearchPart from "@/components/search/Search";
import ReportCard from "@/components/reports/ReportCard";
import FilterPart from "@/components/search/Filter";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { GetReportsQueryParams } from "@/types/report";
import { REPORT_ITEM_PER_PAGE } from "@/constants/pagination";
import { isAuthenticated } from "@/api/login";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useTutorial } from "@/providers/TutorialProvider";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DriveStep } from "driver.js";

const mainTutorialSteps: DriveStep[] = [
  {
    element: "#nav-main-menu",
    popover: {
      title: "เมนูหลัก",
      description: "ไปที่หน้ารายการแจ้งเหตุ",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#nav-map",
    popover: {
      title: "แผนที่",
      description: "เปลี่ยนเป็นมุมมองแผนที่เพื่อดูตำแหน่งที่แจ้งเหตุ",
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
      description: "ใช้ตัวเลือกนี้เพื่อกรองรายงานตามสถานะหรือหมวดหมู่",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tutorial-search",
    popover: {
      title: "ค้นหา",
      description: "ค้นหารายงานที่ต้องการด้วยชื่อ หรือช่วงเวลาที่ต้องการ",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tutorial-reports",
    popover: {
      title: "รายการแจ้งเหตุ",
      description: "ดูรายการแจ้งเหตุทั้งหมดที่นี่ คลิกที่การ์ดเพื่อดูรายละเอียดเพิ่มเติม",
      side: "top",
      align: "center",
    },
  },
];

export default function Main() {
  const [queryParams, setQueryParams] = useState<GetReportsQueryParams>({});
  const queryReports = useQueryGetReports(queryParams);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { startTutorial } = useTutorial();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      const seen = localStorage.getItem("tutorial_seen_main");
      if (!seen) {
        setTimeout(() => {
          startTutorial(mainTutorialSteps, "main");
        }, 1000);
      }
    }
  }, [router, startTutorial]);

  const reports = useMemo(() => queryReports.data || [], [queryReports.data]);

  const filteredReports = useMemo(() => {
    const searchLower = searchInput.toLowerCase().trim();

    if (!searchLower) return reports; // Return all if empty search

    return reports.filter((report) => {
      // Search across all text fields
      const searchableText = [
        report.firstName,
        report.lastName,
        report.mainPhoneNumber,
        report.reservePhoneNumber || "",
        report.additionalDetail,
        report.afterAdditionalDetail || "",
        report.location?.subDistrict || "",
        report.location?.district || "",
        report.location?.province || "",
        report.reportStatus?.status || "",
        // Add assistance types
        ...report.reportAssistances.map(a => a.assistanceType?.name || ""),
      ].join(" ").toLowerCase();

      return searchableText.includes(searchLower);
    });
  }, [searchInput, reports]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredReports.length / REPORT_ITEM_PER_PAGE);
    if (page > totalPages) {
      setPage(1);
    }
  }, [filteredReports, page]);

  useEffect(() => {
    queryReports.refetch();
  }, [queryParams]);

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const onChangeReportsQueryParam = useCallback(
    (field: string, value: string | number | string[] | number[] | null) => {
      setQueryParams((prevParams) => ({ ...prevParams, [field]: value }));
    },
    []
  );

  const paginatedReports = useMemo(
    () => filteredReports.slice((page - 1) * REPORT_ITEM_PER_PAGE, page * REPORT_ITEM_PER_PAGE),
    [filteredReports, page]
  );

  if (queryReports.isPending) {
    return <Loader />;
  }

  return (
    <>
      <div id="tutorial-navbar">
        <NavBar />
      </div>
      <div className="mt-[0.75%] px-[3%]">
        <div id="tutorial-filter" className="flex flex-row mb-[1%] items-center font-kanit gap-[2%]">
          <FilterPart onChangeReportsQueryParam={onChangeReportsQueryParam} />
          <button
            onClick={() => startTutorial(mainTutorialSteps, "main")}
            className="flex items-center gap-1 px-3 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            title="Start Tutorial"
          >
            <HelpOutlineIcon />
            <span>Help</span>
          </button>
        </div>
      </div>

      <div className="mt-[1%] px-[3%]">
        <div id="tutorial-search">
          <SearchPart
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onChangeReportsQueryParam={onChangeReportsQueryParam}
          />
        </div>
        <div id="tutorial-reports" className="flex flex-wrap gap-[1.5%] items-start mt-4">
          {paginatedReports.map((report) => (
            <ReportCard report={report} key={report.id} />
          ))}
        </div>
        {paginatedReports.length > 0 && (
          <Stack spacing={2} alignItems="center" sx={{ marginY: "2%" }}>
            <Pagination
              count={Math.ceil(filteredReports.length / REPORT_ITEM_PER_PAGE)}
              page={page}
              onChange={handleChangePage}
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#000000",
                  fontFamily: "kanit",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#ff3388",
                  color: "#FFFFFF",
                },
                "& .MuiPaginationItem-root.Mui-selected:hover": {
                  backgroundColor: "#ff0066",
                },
              }}
            />
          </Stack>
        )}
      </div>
    </>
  );
}