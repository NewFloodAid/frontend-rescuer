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
import { useTutorial } from "@/providers/TutorialProvider";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DriveStep } from "driver.js";
import { Report } from "@/types/report";
import ReportModal from "@/components/reports/ReportModal";
import { ReportStatusEnum } from "@/types/report_status";

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
    element: "#tutorial-reports-desktop",
    popover: {
      title: "รายการแจ้งเหตุ",
      description: "ดูรายการแจ้งเหตุทั้งหมดที่นี่ คลิกที่การ์ดเพื่อดูรายละเอียดเพิ่มเติม",
      side: "top",
      align: "center",
    },
  },
];

const MOCK_REPORT_ID = 999999;
const initialMockReport: Report = {
  id: MOCK_REPORT_ID,
  userId: "mock-user-id",
  firstName: "สมชาย",
  lastName: "ใจดี",
  mainPhoneNumber: "0812345678",
  reservePhoneNumber: "",
  additionalDetail: "มีต้นไม้ล้มขวางถนน รถผ่านไม่ได้",
  afterAdditionalDetail: "ดำเนินการตัดต้นไม้และเคลียร์พื้นที่เรียบร้อยแล้ว",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  location: {
    id: 1,
    latitude: 18.7953,
    longitude: 98.9620,
    address: "ถนนสุเทพ ตำบลสุเทพ อำเภอเมือง เชียงใหม่",
    subDistrict: "สุเทพ",
    district: "เมืองเชียงใหม่",
    province: "เชียงใหม่",
    postalCode: "50200",
  },
  reportStatus: {
    id: 1,
    status: ReportStatusEnum.enum.PENDING,
    userOrderingNumber: 1,
    governmentOrderingNumber: 1,
  },
  images: [
    {
      id: 1,
      name: "mock-before.jpg",
      url: "/images/bg.png",
      phase: "BEFORE",
    },
    {
      id: 2,
      name: "mock-after.jpg",
      url: "/images/bg.png",
      phase: "AFTER",
    }
  ],
  reportAssistances: [
    {
      id: 1,
      assistanceType: { id: 1, name: "กู้ภัย" },
      quantity: 1,
      isActive: true,
    }
  ],
};

export default function Main() {
  const [queryParams, setQueryParams] = useState<GetReportsQueryParams>({
    page: 0,
    size: REPORT_ITEM_PER_PAGE,
  });
  const queryReports = useQueryGetReportsPaged(queryParams);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const { startTutorial, closeTutorial } = useTutorial();

  // Mock Report Tutorial Flow State
  const [isMockOpen, setIsMockOpen] = useState(false);
  const [mockReport, setMockReport] = useState<Report>(initialMockReport);

  const startMockTutorial = useCallback((status: "PENDING" | "PROCESS" | "SENT") => {
    setTimeout(() => {
      let steps: DriveStep[] = [];
      if (status === "PENDING") {
        steps = [
          {
            element: "#report-modal-content",
            popover: {
              title: "รายละเอียดคำร้องขอ",
              description: "นี่คือหน้าต่างแสดงรายละเอียดทั้งหมดของคำร้องขอ ทั้งตำแหน่งที่ตั้ง รูปภาพประกอบ และข้อมูลผู้แจ้งเหตุ คุณสามารถตรวจสอบข้อมูลทั้งหมดได้ที่นี่",
              side: "left",
              align: "center",
            }
          },
          {
            element: "#tutorial-update-report",
            popover: {
              title: "รับคำขอ",
              description: "เมื่อตรวจสอบข้อมูลเบื้องต้นแล้ว ให้คลิกที่ปุ่มนี้เพื่อเปลี่ยนสถานะเป็น 'รวบรวมข้อมูล' และดำเนินการขั้นต่อไป",
              side: "top",
              align: "center",
              showButtons: ["previous"], // Hide Next/Done button
              popoverClass: "action-step-popover", // Add class for styling
            }
          }
        ];
      } else if (status === "PROCESS") {
        steps = [
          {
            element: "#tutorial-download-word",
            popover: {
              title: "ดาวน์โหลดเอกสาร",
              description: "คุณสามารถดาวน์โหลดข้อมูลคำร้องขอในรูปแบบไฟล์ Word ได้ที่นี่",
              side: "left",
              align: "center",
            }
          },
          {
            element: "#tutorial-download-images",
            popover: {
              title: "ดาวน์โหลดรูปภาพ",
              description: "ปุ่มนี้ใช้สำหรับดาวน์โหลดรูปภาพประกอบทั้งหมดของคำร้องขอ",
              side: "left",
              align: "center",
            }
          },
          {
            element: "#tutorial-update-report",
            popover: {
              title: "ส่งเรื่องต่อไป",
              description: "เมื่อดำเนินการดาวน์โหลด และส่งเรื่องไปยังหน่วยงานที่เกี่ยวข้องเสร็จสิ้น ให้คลิกที่ปุ่มนี้เพื่อเปลี่ยนสถานะเป็น 'ส่งเรื่องไปแล้ว'",
              side: "top",
              align: "center",
              showButtons: ["previous"], // Hide Next/Done button
              popoverClass: "action-step-popover", // Add class for styling
            }
          }
        ];
      } else if (status === "SENT") {
        steps = [
          {
            element: "#report-modal-content",
            popover: {
              title: "เสร็จสิ้นการสาธิต",
              description: "หลังจากส่งเรื่องไปแล้ว ระบบจะแสดงสถานะเป็น 'ส่งเรื่องไปแล้ว' ที่เหลือจะเป็นหน้าที่ของคนในชุมชน ในการตรวจสอบการแก้ไข และอัปเดตสถานะ เป็น 'เสร็จสิ้น'ได้",
              side: "left",
              align: "center",
              onNextClick: () => {
                closeTutorial();
                setIsMockOpen(false);
                setMockReport(initialMockReport);
              }
            }
          }
        ];
      }
      if (steps.length > 0) {
        startTutorial(steps, `mock_report_${status}`, () => {
          if (status === "SENT") {
            closeTutorial();
            setIsMockOpen(false);
            setMockReport(initialMockReport);
          }
        });
      }
    }, 800);
  }, [startTutorial, closeTutorial]);

  const startFullMainTutorial = useCallback(() => {
    startTutorial(mainTutorialSteps, "main", () => {
      // Callback when main tutorial finishes -> start mock flow
      setIsMockOpen(true);
      setMockReport(initialMockReport);
      startMockTutorial("PENDING");
    });
  }, [startTutorial, startMockTutorial]);

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

  const handleMockUpdate = useCallback(() => {
    const currentStatus = mockReport.reportStatus.status;
    let nextStatus: "PENDING" | "PROCESS" | "SENT" | "SUCCESS" = "PENDING";
    let statusId = 1;

    if (currentStatus === ReportStatusEnum.enum.PENDING) {
      nextStatus = "PROCESS";
      statusId = 2;
    } else if (currentStatus === ReportStatusEnum.enum.PROCESS) {
      nextStatus = "SENT";
      statusId = 3;
    }

    setMockReport((prev) => ({
      ...prev,
      reportStatus: {
        ...prev.reportStatus,
        id: statusId,
        status: nextStatus as "PENDING" | "PROCESS" | "SENT" | "SUCCESS",
      },
      // Simulate timestamp updates
      ...(nextStatus === "PROCESS" ? { processedAt: new Date().toISOString() } : {}),
      ...(nextStatus === "SENT" ? { sentAt: new Date().toISOString() } : {}),
    }));

    if (nextStatus === "PROCESS" || nextStatus === "SENT") {
      startMockTutorial(nextStatus);
    }
  }, [mockReport, startMockTutorial]);

  if (queryReports.isPending) {
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
          onReportDetailModalClose={() => {
            closeTutorial();
            setIsMockOpen(false);
            setMockReport(initialMockReport);
          }}
          isMock={true}
          onMockUpdate={handleMockUpdate}
        />
      )}
    </>
  );
}
