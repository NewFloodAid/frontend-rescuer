import { useCallback, useState } from "react";
import { DriveStep } from "driver.js";
import { useTutorial } from "@/providers/TutorialProvider";
import { ReportStatusEnum } from "@/types/report_status";
import { Report } from "@/types/report";
import { isSuperAdmin } from "@/api/login";

// Helper: click hamburger to open drawer, wait for animation, then advance
function openDrawerAndMoveNext(driverRef: React.RefObject<any>) {
  const menuBtn = document.querySelector("#nav-hamburger") as HTMLButtonElement;
  menuBtn?.click();
  setTimeout(() => {
    driverRef.current?.moveNext();
  }, 400);
}

// Helper: close drawer by clicking the close button, then advance
function closeDrawerAndMoveNext(driverRef: React.RefObject<any>) {
  // MUI Drawer backdrop or close button
  const closeBtn = document.querySelector(
    ".MuiDrawer-root .MuiIconButton-root"
  ) as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.click();
  } else {
    // fallback: click backdrop
    const backdrop = document.querySelector(
      ".MuiBackdrop-root"
    ) as HTMLElement;
    backdrop?.click();
  }
  setTimeout(() => {
    driverRef.current?.moveNext();
  }, 400);
}

/**
 * Build the main tutorial steps dynamically.
 * The drawer steps differ based on admin role (Super Admin has extra button).
 */
function buildMainTutorialSteps(
  driverRef: React.RefObject<any>
): DriveStep[] {
  const steps: DriveStep[] = [
    // Step 1: Highlight navbar — explain hamburger
    {
      element: "#tutorial-navbar",
      popover: {
        title: "แถบเมนู",
        description:
          "คลิกที่ไอคอน ☰ ทางขวามือเพื่อเปิดเมนูการนำทาง มาดูกันว่ามีเมนูอะไรบ้าง",
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
        description: "ไปที่หน้ารายการแจ้งเหตุ เพื่อดูและจัดการคำร้องทั้งหมด",
        side: "left" as const,
        align: "center" as const,
        onPrevClick: () => {
          closeDrawerAndMoveNext(driverRef);
          // Go back is complex, skip for simplicity
        },
      },
    },
    // Step 3: Drawer — แผนที่
    {
      element: "#drawer-map",
      popover: {
        title: "แผนที่",
        description:
          "เปลี่ยนเป็นมุมมองแผนที่เพื่อดูตำแหน่งที่แจ้งเหตุบนแผนที่",
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
        description: "เพิ่ม แก้ไข หรือลบประเภทความช่วยเหลือที่ประชาชนสามารถร้องขอได้",
        side: "left" as const,
        align: "center" as const,
      },
    },
  ];

  // Step 6 (Super Admin only): Drawer — จัดการผู้ดูแล
  if (isSuperAdmin()) {
    steps.push({
      element: "#drawer-manage-admins",
      popover: {
        title: "จัดการผู้ดูแล",
        description:
          "เพิ่ม แก้ไข หรือลบบัญชีผู้ดูแลระบบ และกำหนดเขตที่ดูแลให้แต่ละคน (เฉพาะผู้ดูแลระบบเท่านั้น)",
        side: "left" as const,
        align: "center" as const,
      },
    });
  }

  // Step 7: Drawer — ดาวน์โหลดข้อมูล
  steps.push({
    element: "#drawer-export",
    popover: {
      title: "ดาวน์โหลดข้อมูล",
      description:
        "ดาวน์โหลดข้อมูลรายงานเป็นไฟล์ Excel ตามช่วงเวลาที่ต้องการ",
      side: "left" as const,
      align: "center" as const,
    },
  });

  // Step 8: Drawer — ออกจากระบบ (last drawer step → close drawer on next)
  steps.push({
    element: "#drawer-logout",
    popover: {
      title: "ออกจากระบบ",
      description: "ออกจากระบบเมื่อใช้งานเสร็จสิ้น",
      side: "left" as const,
      align: "center" as const,
      onNextClick: () => {
        closeDrawerAndMoveNext(driverRef);
      },
    },
  });

  // Step 9: Filter
  steps.push({
    element: "#tutorial-filter",
    popover: {
      title: "กรองข้อมูล",
      description:
        "ใช้ตัวเลือกนี้เพื่อกรองรายงานตามสถานะ เช่น รอดำเนินการ กำลังดำเนินการ ส่งเรื่องไปแล้ว หรือเสร็จสิ้น",
      side: "bottom" as const,
      align: "start" as const,
    },
  });

  // Step 10: Search
  steps.push({
    element: "#tutorial-search",
    popover: {
      title: "ค้นหา",
      description:
        "ค้นหารายงานที่ต้องการด้วยชื่อ หรือกรองตามช่วงเวลาที่ต้องการ",
      side: "bottom" as const,
      align: "start" as const,
    },
  });

  // Step 11: Report list
  steps.push({
    element: "#tutorial-reports-desktop",
    popover: {
      title: "รายการแจ้งเหตุ",
      description:
        "ดูรายการแจ้งเหตุทั้งหมดที่นี่ คลิกที่การ์ดเพื่อดูรายละเอียดเพิ่มเติม และดำเนินการต่อ",
      side: "top" as const,
      align: "center" as const,
    },
  });

  return steps;
}

export const MOCK_REPORT_ID = 999999;
export const initialMockReport: Report = {
  id: MOCK_REPORT_ID,
  userId: "mock-user-id",
  firstName: "สมชาย",
  lastName: "ใจดี",
  mainPhoneNumber: "0812345678",
  reservePhoneNumber: "",
  additionalDetail: "มีต้นไม้ล้มขวางถนน รถผ่านไม่ได้",
  afterAdditionalDetail:
    "ดำเนินการตัดต้นไม้และเคลียร์พื้นที่เรียบร้อยแล้ว",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  location: {
    id: 1,
    latitude: 18.7953,
    longitude: 98.962,
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
    },
  ],
  reportAssistances: [
    {
      id: 1,
      assistanceType: { id: 1, name: "กู้ภัย" },
      quantity: 1,
      isActive: true,
    },
  ],
};

export function useMainTutorial() {
  const { startTutorial, closeTutorial, driverRef } = useTutorial();
  const [isMockOpen, setIsMockOpen] = useState(false);
  const [mockReport, setMockReport] = useState<Report>(initialMockReport);

  const startMockTutorial = useCallback(
    (status: "PENDING" | "PROCESS" | "SENT") => {
      setTimeout(() => {
        let steps: DriveStep[] = [];
        if (status === "PENDING") {
          steps = [
            {
              element: "#report-modal-content",
              popover: {
                title: "รายละเอียดคำร้องขอ",
                description:
                  "นี่คือหน้าต่างแสดงรายละเอียดทั้งหมดของคำร้องขอ ทั้งตำแหน่งที่ตั้ง รูปภาพประกอบ และข้อมูลผู้แจ้งเหตุ คุณสามารถตรวจสอบข้อมูลทั้งหมดได้ที่นี่",
                side: "left",
                align: "center",
              },
            },
            {
              element: "#tutorial-update-report",
              popover: {
                title: "รับคำขอ",
                description:
                  "เมื่อตรวจสอบข้อมูลเบื้องต้นแล้ว ให้คลิกที่ปุ่มนี้เพื่อเปลี่ยนสถานะเป็น 'รวบรวมข้อมูล' และดำเนินการขั้นต่อไป",
                side: "top",
                align: "center",
                showButtons: ["previous"],
                popoverClass: "action-step-popover",
              },
            },
          ];
        } else if (status === "PROCESS") {
          steps = [
            {
              element: "#tutorial-download-word",
              popover: {
                title: "ดาวน์โหลดเอกสาร",
                description:
                  "คุณสามารถดาวน์โหลดข้อมูลคำร้องขอในรูปแบบไฟล์ Word ได้ที่นี่",
                side: "left",
                align: "center",
              },
            },
            {
              element: "#tutorial-download-images",
              popover: {
                title: "ดาวน์โหลดรูปภาพ",
                description:
                  "ปุ่มนี้ใช้สำหรับดาวน์โหลดรูปภาพประกอบทั้งหมดของคำร้องขอ",
                side: "left",
                align: "center",
              },
            },
            {
              element: "#tutorial-update-report",
              popover: {
                title: "ส่งเรื่องต่อไป",
                description:
                  "เมื่อดำเนินการดาวน์โหลด และส่งเรื่องไปยังหน่วยงานที่เกี่ยวข้องเสร็จสิ้น ให้คลิกที่ปุ่มนี้เพื่อเปลี่ยนสถานะเป็น 'ส่งเรื่องไปแล้ว'",
                side: "top",
                align: "center",
                showButtons: ["previous"],
                popoverClass: "action-step-popover",
              },
            },
          ];
        } else if (status === "SENT") {
          steps = [
            {
              element: "#report-modal-content",
              popover: {
                title: "เสร็จสิ้นการสาธิต",
                description:
                  "หลังจากส่งเรื่องไปแล้ว ระบบจะแสดงสถานะเป็น 'ส่งเรื่องไปแล้ว' ที่เหลือจะเป็นหน้าที่ของคนในชุมชน ในการตรวจสอบการแก้ไข และอัปเดตสถานะ เป็น 'เสร็จสิ้น'ได้",
                side: "left",
                align: "center",
                onNextClick: () => {
                  closeTutorial();
                  setIsMockOpen(false);
                  setMockReport(initialMockReport);
                },
              },
            },
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
    },
    [startTutorial, closeTutorial]
  );

  const startFullMainTutorial = useCallback(() => {
    const steps = buildMainTutorialSteps(driverRef);
    startTutorial(steps, "main", () => {
      setIsMockOpen(true);
      setMockReport(initialMockReport);
      startMockTutorial("PENDING");
    });
  }, [startTutorial, startMockTutorial, driverRef]);

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
      ...(nextStatus === "PROCESS"
        ? { processedAt: new Date().toISOString() }
        : {}),
      ...(nextStatus === "SENT"
        ? { sentAt: new Date().toISOString() }
        : {}),
    }));

    if (nextStatus === "PROCESS" || nextStatus === "SENT") {
      startMockTutorial(nextStatus);
    }
  }, [mockReport, startMockTutorial]);

  const closeMockReport = useCallback(() => {
    closeTutorial();
    setIsMockOpen(false);
    setMockReport(initialMockReport);
  }, [closeTutorial]);

  return {
    isMockOpen,
    mockReport,
    startFullMainTutorial,
    handleMockUpdate,
    closeMockReport,
  };
}
