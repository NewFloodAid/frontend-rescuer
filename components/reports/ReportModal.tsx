import React, { useEffect, useState } from "react";
import { Modal, Button, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Report } from "@/types/report";
import { ReportStatusEnum } from "@/types/report_status";
import ReportMap from "./ReportMap";
import ReportImages from "./ReportImages";
import UpdateReportButton from "../buttons/UpdateReportButton";
import ReportDetail from "./ReportDetail";
import { DateDisplay, TimeDisplay } from "../DateTimeDisplay";
import { useMutationDownloadReportWord, useMutationDownloadReportImages, useMutationDeleteReport } from "@/api/report";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTutorial } from "@/providers/TutorialProvider";
import { DriveStep } from "driver.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const getTutorialSteps = (status: string): DriveStep[] => {
  const steps: DriveStep[] = [
    {
      element: "#tutorial-report-header",
      popover: {
        title: "ข้อมูลเบื้องต้น",
        description: "ส่วนนี้แสดงชื่อผู้แจ้ง วันที่ และเวลาที่แจ้งเหตุ",
      }
    },
    {
      element: "#tutorial-report-map",
      popover: {
        title: "แผนที่จุดเกิดเหตุ",
        description: "แสดงตำแหน่งที่ตั้งของจุดเกิดเหตุบนแผนที่",
      }
    },
    {
      element: "#tutorial-report-detail",
      popover: {
        title: "รายละเอียดการแจ้งเหตุ",
        description: "แสดงประเภทเหตุฉุกเฉิน รายละเอียดเพิ่มเติม และสถานะปัจจุบันของรายงาน",
      }
    },
    {
      element: "#tutorial-report-images",
      popover: {
        title: "รูปภาพก่อนดำเนินการ",
        description: "ภาพถ่ายที่ผู้แจ้งแนบมาเพื่อประกอบการแจ้งเหตุ",
      }
    }
  ];

  if (status === ReportStatusEnum.enum.PROCESS) {
    steps.push({
      element: "#tutorial-download-word",
      popover: {
        title: "ดาวน์โหลดเอกสาร",
        description: "คุณสามารถดาวน์โหลดใบพิมพ์รายงาน (Word) ได้จากปุ่มนี้",
      }
    });
    steps.push({
      element: "#tutorial-download-images",
      popover: {
        title: "ดาวน์โหลดรูปภาพ",
        description: "คุณสามารถดาวน์โหลดรูปภาพทั้งหมดของรายงานนี้ได้จากปุ่มนี้",
      }
    });
  }

  if (status === ReportStatusEnum.enum.PENDING || status === ReportStatusEnum.enum.PROCESS) {
    steps.push({
      element: "#tutorial-update-report",
      popover: {
        title: "อัปเดตรายงาน",
        description: "ปุ่มสำหรับอัปเดตสถานะของรายงานให้เข้าสู่ขั้นตอนต่อไป",
      }
    });
    steps.push({
      element: "#tutorial-delete-report",
      popover: {
        title: "ลบรายงาน",
        description: "ปุ่มสำหรับลบรายงานนี้ออกจากระบบอย่างถาวร หากเป็นข้อมูลเท็จ",
      }
    });
  }

  if (status === ReportStatusEnum.enum.SUCCESS) {
    steps.push({
      element: "#tutorial-report-feedback",
      popover: {
        title: "ผลการดำเนินการ (FEEDBACK)",
        description: "แสดงสรุปผลการปฏิบัติงาน จำนวนการช่วยเหลือ และรายละเอียดเพิ่มเติม",
      }
    });
    steps.push({
      element: "#tutorial-report-after-images",
      popover: {
        title: "รูปภาพหลังดำเนินการ",
        description: "ภาพถ่ายหลังจากที่เจ้าหน้าที่ได้ดำเนินการช่วยเหลือเรียบร้อยแล้ว",
      }
    });
  }

  return steps;
};

interface ReportModalProps {
  initialReport: Report;
  isReportDetailModalOpen: boolean;
  onReportDetailModalClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  initialReport,
  isReportDetailModalOpen,
  onReportDetailModalClose,
}) => {

  const isReportStatusSuccess = (report: Report) => {
    return report.reportStatus.status === ReportStatusEnum.enum.SUCCESS;
  };

  const isReportStatusPendingOrProcessing = (report: Report) => {
    return (
      report.reportStatus.status === ReportStatusEnum.enum.PENDING ||
      report.reportStatus.status === ReportStatusEnum.enum.PROCESS
    );
  };

  const [report, setReport] = useState<Report>(initialReport);
  const { startTutorial } = useTutorial();

  const deleteReportMutation = useMutationDeleteReport();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setReport(initialReport);
  }, [initialReport]);

  useEffect(() => {
    if (isReportDetailModalOpen && report) {
      const status = report.reportStatus.status;
      const seenKey = `tutorial_seen_report_${status}`;
      const seen = localStorage.getItem(seenKey);

      if (!seen) {
        // slight delay to let modal animate in
        setTimeout(() => {
          startTutorial(getTutorialSteps(status), `report_${status}`);
        }, 500);
      }
    }
  }, [isReportDetailModalOpen, report, startTutorial]);

  const handleDeleteConfirm = () => {
    MySwal.fire({
      title: 'ลบประวัติคำร้องขอ',
      text: "คุณต้องการลบรายงานนี้ออกจากระบบอย่างถาวรหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#cccccc',
      confirmButtonText: '<span style="color:white; font-family:kanit; font-size:2vmin;">ลบ</span>',
      cancelButtonText: '<span style="color:black; font-family:kanit; font-size:2vmin;">ยกเลิก</span>',
      customClass: {
        popup: 'font-kanit',
        container: 'z-[9999]',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReportMutation.mutateAsync(report.id).then(() => {
          onReportDetailModalClose();
          MySwal.fire({
            title: 'ลบสำเร็จ!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            customClass: { popup: 'font-kanit' }
          });
        });
      }
    });
  };

  const { mutate: downloadWord } = useMutationDownloadReportWord();
  const { mutate: downloadImages } = useMutationDownloadReportImages();

  // Filter images by phase
  const beforeImages = report.images.filter(img => img.phase === "BEFORE");
  const afterImages = report.images.filter(img => img.phase === "AFTER");

  return (
    <Modal open={isReportDetailModalOpen} onClose={onReportDetailModalClose}>
      <div className="flex h-screen w-screen items-center justify-center font-kanit p-4 outline-none">
        <div className="relative flex items-start">
          <div className="w-[85vw] max-w-[1200px] max-h-[85vh] rounded-[10px] bg-white flex flex-col pb-[1%] overflow-y-auto shadow-xl">
            {isReportStatusSuccess(report) ? (
              // Two-section layout for SUCCESS status
              <>
                {/* Upside Section - Original Report */}
                <div id="tutorial-report-header" className="w-full h-[5dvh] bg-[#505050] border border-[#00000033] rounded-[10px] flex items-center text-white">
                  <div className="w-[20%]" />
                  <div className="w-[60%] flex flex-row justify-between">
                    <div>
                      คำร้องขอของ: {report.firstName} {report.lastName}
                    </div>
                    <div>
                      <DateDisplay dateTime={report.createdAt} />
                    </div>
                    <div>
                      เวลา <TimeDisplay dateTime={report.createdAt} />
                    </div>
                  </div>
                  <div className="w-[20%] flex justify-end pr-[1%] gap-[1vw]">
                    <IconButton
                      title="Tutorial"
                      sx={{
                        width: "4dvh",
                        height: "4dvh",
                      }}
                      onClick={() => startTutorial(getTutorialSteps(report.reportStatus.status), `report_${report.reportStatus.status}`)}
                    >
                      <HelpOutlineIcon
                        sx={{
                          width: "4dvh",
                          height: "auto",
                          aspectRatio: "1 / 1",
                          color: "#FFFFFF",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      sx={{
                        width: "4dvh",
                        height: "4dvh",
                      }}
                      onClick={onReportDetailModalClose}
                    >
                      <CancelIcon
                        sx={{
                          width: "4dvh",
                          height: "auto",
                          aspectRatio: "1 / 1",
                          color: "#FF0000",
                        }}
                      />
                    </IconButton>
                  </div>
                </div>

                <div className="flex flex-row justify-center items-start my-[2%] px-[2%] gap-[3%]">
                  <div id="tutorial-report-map" className="w-[31%]">
                    <ReportMap report={report} />
                  </div>
                  <div id="tutorial-report-detail" className="w-[31%]">
                    <ReportDetail report={report} setReport={setReport} />
                  </div>
                  <div id="tutorial-report-images" className="w-[31%]">
                    <ReportImages
                      report={{
                        ...report,
                        images: beforeImages,
                      }}
                    />
                  </div>
                </div>

                {/* Downside Section - Feedback */}
                <div className="w-full h-[5dvh] bg-[#505050] border border-[#00000033] rounded-[10px] flex items-center text-white mt-[0%]">
                  <div className="w-[20%]" />
                  <div className="w-[60%] flex flex-row justify-between">
                    <div>
                      FEEDBACK
                    </div>
                    <div>
                      <DateDisplay dateTime={report.updatedAt || report.createdAt} />
                    </div>
                    <div>
                      เวลา <TimeDisplay dateTime={report.updatedAt || report.createdAt} />
                    </div>
                  </div>
                  <div className="w-[20%]" />
                </div>

                <div className="flex flex-row justify-center items-start my-[2%] px-[2%] gap-[3%]">
                  {/* Solved Stamp instead of map */}
                  <div className="w-[31%]">
                    <img
                      src="/images/solved.png"
                      alt="Solved"
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        objectFit: "contain",
                        border: "1px solid rgba(0,0,0,0.5)",
                        borderRadius: "10px",
                        overflow: "hidden"
                      }}
                    />
                  </div>
                  <div id="tutorial-report-feedback" className="w-[31%]">
                    {/* Custom Feedback Detail Component */}
                    <div className="w-full h-auto aspect-square border border-black/50 rounded-[10px] shadow-inner overflow-y-auto">
                      <div className="flex justify-center text-[2.5vmin] mt-[4%] mb-[2%] font-bold text-black">
                        FEEDBACK
                      </div>
                      <div className="px-[5%] text-[1.75vmin]">
                        {report.reportAssistances.map((assistance) =>
                          assistance.quantity > 0 ? (
                            <div key={assistance.assistanceType.id} className="flex items-center mb-[2%]">
                              <span>
                                {assistance.assistanceType.name}: {assistance.quantity} งาน
                              </span>
                            </div>
                          ) : null
                        )}
                        <div className="mt-[2%] mb-[4%] text-[1.75vmin]">
                          <div className="px-[3%] font-semibold">รายละเอียดเพิ่มเติม:</div>
                          <div className="w-full px-[5%] font-normal break-words">
                            {report.afterAdditionalDetail || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="tutorial-report-after-images" className="w-[33.33%]">
                    <ReportImages
                      report={{
                        ...report,
                        images: afterImages,
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              // Original single-section layout for other statuses
              <>
                <div id="tutorial-report-header" className="w-full h-[5dvh] bg-[#505050] border border-[#00000033] rounded-[10px] flex items-center text-white">
                  <div className="w-[20%] flex items-center pl-[1%]">

                  </div>
                  <div className="w-[60%] flex flex-row justify-between">
                    <div>
                      คำร้องขอของ: {report.firstName} {report.lastName}
                    </div>
                    <div>
                      <DateDisplay dateTime={report.createdAt} />
                    </div>
                    <div>
                      เวลา <TimeDisplay dateTime={report.createdAt} />
                    </div>
                  </div>
                  <div className="w-[20%] flex justify-end pr-[1%] gap-[1vw]">
                    <IconButton
                      title="Tutorial"
                      sx={{
                        width: "4dvh",
                        height: "4dvh",
                      }}
                      onClick={() => startTutorial(getTutorialSteps(report.reportStatus.status), `report_${report.reportStatus.status}`)}
                    >
                      <HelpOutlineIcon
                        sx={{
                          width: "4dvh",
                          height: "auto",
                          aspectRatio: "1 / 1",
                          color: "#FFFFFF",
                        }}
                      />
                    </IconButton>
                    <IconButton
                      sx={{
                        width: "4dvh",
                        height: "4dvh",
                      }}
                      onClick={onReportDetailModalClose}
                    >
                      <CancelIcon
                        sx={{
                          width: "4dvh",
                          height: "auto",
                          aspectRatio: "1 / 1",
                          color: "#FF0000",
                        }}
                      />
                    </IconButton>
                  </div>
                </div>

                <div className="flex flex-row justify-center items-start my-[2%] px-[2%] gap-[3%]">
                  <div id="tutorial-report-map" className="w-[31%]">
                    <ReportMap report={report} />
                  </div>
                  <div id="tutorial-report-detail" className="w-[31%]">
                    <ReportDetail report={report} setReport={setReport} />
                  </div>
                  <div id="tutorial-report-images" className="w-[31%]">
                    <ReportImages
                      report={{
                        ...report,
                        images: beforeImages,
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-center w-full mt-[-1%] mb-[0%] space-x-6">
              {isReportStatusPendingOrProcessing(report) && (
                <div id="tutorial-update-report">
                  <UpdateReportButton report={report} />
                </div>
              )}
              <Button
                id="tutorial-delete-report"
                variant="contained"
                sx={{
                  minWidth: "7dvw",
                  height: "6dvh",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  backgroundColor: "#FF0000",
                  "&:hover": { backgroundColor: "#CC0000" },
                  color: "white",
                  fontSize: "2vmin",
                  borderRadius: "10px",
                  fontFamily: "kanit",
                }}
                onClick={handleDeleteConfirm}
              >
                ลบ
              </Button>
            </div>
          </div>

          {report.reportStatus.status === ReportStatusEnum.enum.PROCESS && (
            <div className="absolute left-full top-[10dvh] flex flex-col gap-[2dvh]">
              <Button
                id="tutorial-download-word"
                variant="contained"
                sx={{
                  minWidth: "7dvw",
                  height: "6dvh",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  borderLeft: "none",
                  backgroundColor: "#FF69B4", // Hot Pink
                  "&:hover": { backgroundColor: "#FF1493" }, // Deep Pink
                  color: "white",
                  fontSize: "2vmin",
                  borderRadius: "0 10px 10px 0",
                  fontFamily: "kanit",
                  whiteSpace: "nowrap",
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                  display: "flex",
                  gap: "0.5vw",
                }}
                onClick={() => downloadWord(report)}
              >
                ดาวน์โหลดไฟล์
                <img src="/images/word-logo.png" alt="Word" className="w-[6vmin] h-auto object-contain" />
              </Button>
              <Button
                id="tutorial-download-images"
                variant="contained"
                sx={{
                  minWidth: "7dvw",
                  height: "6dvh",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  borderLeft: "none",
                  backgroundColor: "#FF69B4", // Hot Pink
                  "&:hover": { backgroundColor: "#FF1493" }, // Deep Pink
                  color: "white",
                  fontSize: "2vmin",
                  borderRadius: "0 10px 10px 0",
                  fontFamily: "kanit",
                  whiteSpace: "nowrap",
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                }}
                onClick={() => downloadImages(report)}
              >
                ดาวน์โหลดรูปภาพ
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
