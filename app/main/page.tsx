"use client";
import { useCallback, useEffect, useState } from "react";
import NavBar from "@/components/Navbar";
import { useQueryGetReportsPaged } from "@/api/report";
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ReportModal from "@/components/reports/ReportModal";
import { useMainTutorial } from "./useMainTutorial";

export default function Main() {
  const [queryParams, setQueryParams] = useState<GetReportsQueryParams>({
    page: 0,
    size: REPORT_ITEM_PER_PAGE,
  });
  const queryReports = useQueryGetReportsPaged(queryParams);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  // Custom hook to handle all tutorial-related logic
  const {
    isMockOpen,
    mockReport,
    startFullMainTutorial,
    handleMockUpdate,
    closeMockReport
  } = useMainTutorial();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      const seen = localStorage.getItem("tutorial_seen_main");
      if (!seen) {
        setTimeout(() => {
          startFullMainTutorial();
        }, 1000);
      }
    }
  }, [router, startFullMainTutorial]);

  const onChangeReportsQueryParam = useCallback(
    (field: string, value: string | number | string[] | number[] | null) => {
      setQueryParams((prevParams) => {
        const nextParams = { ...prevParams } as Record<
          string,
          string | number | string[] | number[] | undefined
        >;

        if (value === null || value === "") {
          delete nextParams[field];
        } else {
          nextParams[field] = value;
        }

        if (field !== "page") {
          nextParams.page = 0;
        }

        nextParams.size = REPORT_ITEM_PER_PAGE;
        return nextParams as GetReportsQueryParams;
      });
    },
    []
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      onChangeReportsQueryParam("keyword", searchInput.trim() || null);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchInput, onChangeReportsQueryParam]);

  const reports = queryReports.data?.content || [];
  const totalPages = queryReports.data?.totalPages || 0;
  const currentPage = (queryParams.page ?? 0) + 1;

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    onChangeReportsQueryParam("page", value - 1);
  };

  if (queryReports.isPending && !queryReports.data) {
    return <Loader />;
  }

  return (
    <>
      <div id="tutorial-navbar" className="w-full">
        <NavBar />
      </div>

      <div className="hidden md:block mt-[0.75%] px-[3%]">
        <div id="tutorial-filter" className="flex flex-row mb-[1%] items-center font-kanit gap-[2%]">
          <FilterPart onChangeReportsQueryParam={onChangeReportsQueryParam} />
          <button
            onClick={() => startFullMainTutorial()}
            className="flex items-center gap-1 px-3 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            title="Start Tutorial"
          >
            <HelpOutlineIcon />
            <span>วิธีใช้</span>
          </button>
        </div>
      </div>

      <div className="mt-[1%] px-[3%]">
        <div id="tutorial-search" className="hidden md:block">
          <SearchPart
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onChangeReportsQueryParam={onChangeReportsQueryParam}
          />
        </div>
        <div id="tutorial-reports-desktop" className="hidden md:flex flex-wrap gap-[1.5%] items-start mt-4">
          {reports.map((report) => (
            <ReportCard report={report} key={report.id} />
          ))}
        </div>
        <div id="tutorial-reports-mobile" className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 mt-4 pb-4 w-full" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {reports.map((report) => (
            <div key={report.id} className="w-[85vw] shrink-0 snap-center flex justify-center">
              <ReportCard report={report} />
            </div>
          ))}
        </div>
        {reports.length > 0 && totalPages > 0 && (
          <Stack spacing={2} sx={{ marginY: "2%", display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
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

      {/* Interactive Mock Report for Tutorial */}
      {isMockOpen && (
        <ReportModal
          initialReport={mockReport}
          isReportDetailModalOpen={isMockOpen}
          onReportDetailModalClose={closeMockReport}
          isMock={true}
          onMockUpdate={handleMockUpdate}
        />
      )}
    </>
  );
}
