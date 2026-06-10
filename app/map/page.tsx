"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import NavBar from "@/components/Navbar";
import { useQueryGetReports } from "@/api/report";
import MainMap from "@/components/map/MainMap";
import { GetReportsQueryParams } from "@/types/report";
import { isAuthenticated, isSuperAdmin } from "@/api/login";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import FilterPart from "@/components/search/Filter";
import StatusList from "@/components/search/PriorityList";
import ReportCarousel from "@/components/search/ReportCarousel";
import { useTutorial } from "@/providers/TutorialProvider";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DriveStep } from "driver.js";

// Helper: click hamburger to open drawer, wait for animation, then advance
function openDrawerAndMoveNext(driverRef: React.RefObject<any>) {
  const menuBtn = document.querySelector("#nav-hamburger") as HTMLButtonElement;
  menuBtn?.click();
  setTimeout(() => {
    driverRef.current?.moveNext();
  }, 400);
}

// Helper: close drawer, then advance
function closeDrawerAndMoveNext(driverRef: React.RefObject<any>) {
  const closeBtn = document.querySelector(
    ".MuiDrawer-root .MuiIconButton-root"
  ) as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.click();
  } else {
    const backdrop = document.querySelector(".MuiBackdrop-root") as HTMLElement;
    backdrop?.click();
  }
  setTimeout(() => {
    driverRef.current?.moveNext();
  }, 400);
}

function buildMapTutorialSteps(driverRef: React.RefObject<any>): DriveStep[] {
  const steps: DriveStep[] = [
    // Step 1: Navbar — explain hamburger menu
    {
      element: "#tutorial-map-navbar",
      popover: {
        title: "แถบเมนู",
        description:
          "คลิกที่ไอคอน ☰ ทางขวามือเพื่อเปิดเมนู สามารถนำทางไปหน้าอื่น ๆ ได้จากที่นี่",
        side: "bottom" as const,
        align: "center" as const,
        onNextClick: () => {
          openDrawerAndMoveNext(driverRef);
        },
      },
    },
    // Step 2: Drawer — รายการแจ้งเหตุ
    {
      element: "#drawer-main",
      popover: {
        title: "รายการแจ้งเหตุทั้งหมด",
        description: "กลับไปที่หน้ารายการแจ้งเหตุ",
        side: "left" as const,
        align: "center" as const,
      },
    },
    // Step 3: Drawer — แผนที่ (current page)
    {
      element: "#drawer-map",
      popover: {
        title: "แผนที่ (หน้านี้)",
        description: "คุณอยู่ที่หน้านี้ — ดูตำแหน่งที่แจ้งเหตุบนแผนที่",
        side: "left" as const,
        align: "center" as const,
      },
    },
    // Step 4: Drawer — สถิติ
    {
      element: "#drawer-stats",
      popover: {
        title: "สถิติ",
        description: "ดูสถิติรายงานทั้งหมด แยกตามประเภท สถานะ และช่วงเวลา",
        side: "left" as const,
        align: "center" as const,
      },
    },
    // Step 5: Drawer — จัดการประเภท
    {
      element: "#drawer-assistance-types",
      popover: {
        title: "จัดการประเภท",
        description: "เพิ่ม แก้ไข หรือลบประเภทความช่วยเหลือ",
        side: "left" as const,
        align: "center" as const,
      },
    },
  ];

  // Super Admin only
  if (isSuperAdmin()) {
    steps.push({
      element: "#drawer-manage-admins",
      popover: {
        title: "จัดการผู้ดูแล",
        description:
          "เพิ่ม แก้ไข หรือลบบัญชีผู้ดูแลระบบ (เฉพาะผู้ดูแลระบบเท่านั้น)",
        side: "left" as const,
        align: "center" as const,
      },
    });
  }

  // Drawer — ดาวน์โหลดข้อมูล
  steps.push({
    element: "#drawer-export",
    popover: {
      title: "ดาวน์โหลดข้อมูล",
      description: "ดาวน์โหลดข้อมูลรายงานเป็นไฟล์ Excel ตามช่วงเวลาที่ต้องการ",
      side: "left" as const,
      align: "center" as const,
      // Last drawer step → close drawer on next
      onNextClick: () => {
        closeDrawerAndMoveNext(driverRef);
      },
    },
  });

  // After drawer closes — map-specific steps
  steps.push({
    element: "#tutorial-filter",
    popover: {
      title: "กรองข้อมูล",
      description: "กรองหมุดบนแผนที่ตามหมวดหมู่หรือสถานะ",
      side: "bottom" as const,
      align: "start" as const,
    },
  });

  steps.push({
    element: "#tutorial-map-view",
    popover: {
      title: "แผนที่",
      description: "ดูรายงานบนแผนที่ คลิกที่หมุดเพื่อดูรายละเอียด",
      side: "left" as const,
      align: "start" as const,
    },
  });

  steps.push({
    element: "#tutorial-map-status",
    popover: {
      title: "สถิติสถานะ",
      description: "ดูสรุปสถิติสถานะของรายการแจ้งเหตุทั้งหมด",
      side: "left" as const,
      align: "start" as const,
    },
  });

  steps.push({
    element: "#tutorial-map-carousel",
    popover: {
      title: "รายงานล่าสุด",
      description: "ดูรายการแจ้งเหตุย่อและเลื่อนดูรายการอื่นๆ ได้ในส่วนนี้",
      side: "left" as const,
      align: "start" as const,
    },
  });

  return steps;
}

export default function Map() {
  const [queryParams, setQueryParams] = useState<GetReportsQueryParams>({});
  const queryReports = useQueryGetReports(queryParams);

  const router = useRouter();

  const { startTutorial, driverRef } = useTutorial();

  const startMapTutorial = useCallback(() => {
    const steps = buildMapTutorialSteps(driverRef);
    startTutorial(steps, "map");
  }, [startTutorial, driverRef]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    } else {
      const seen = localStorage.getItem("tutorial_seen_map");
      if (!seen) {
        setTimeout(() => {
          startMapTutorial();
        }, 1000);
      }
    }
  }, [router, startMapTutorial]);

  const reports = useMemo(() => queryReports.data || [], [queryReports.data]);

  const filteredReports = useMemo(() => {
    const [firstName = "", lastName = ""] = "".split(" ");
    return reports.filter(
      (report) =>
        report.firstName.toLowerCase().includes(firstName) &&
        report.lastName.toLowerCase().includes(lastName)
    );
  }, [reports]);

  const onChangeReportsQueryParam = useCallback(
    (field: string, value: string | number | string[] | number[] | null) => {
      setQueryParams((prevParams) => ({ ...prevParams, [field]: value }));
    },
    []
  );

  if (queryReports.isPending && !queryReports.data) {
    return <Loader />;
  }

  return (
    <>
      <div id="tutorial-map-navbar" className="w-full">
        <NavBar />
      </div>
      <div className="mt-[0.75%] px-[3%]">
        <div id="tutorial-filter" className="flex flex-row mb-[1%] items-center font-kanit gap-[2%]">
          <FilterPart onChangeReportsQueryParam={onChangeReportsQueryParam} />
          <button
            onClick={() => startMapTutorial()}
            className="flex items-center gap-1 px-3 py-2 bg-white text-black rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            title="Start Tutorial"
          >
            <HelpOutlineIcon />
            <span>วิธีใช้</span>
          </button>
        </div>
        <div className="flex flex-row items-start">
          <div id="tutorial-map-view" className="w-3/4">
            <MainMap reports={filteredReports} />
          </div>
          <div className="flex flex-col items-center w-1/4 gap-10">
            <div id="tutorial-map-status" className="w-full">
              <StatusList reports={filteredReports} />
            </div>
            <div id="tutorial-map-carousel" className="w-full">
              <ReportCarousel reports={filteredReports} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
