import React, { useEffect, useState } from "react";
import { Modal, Button, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { Report } from "@/types/report";
import { ReportStatusEnum } from "@/types/report_status";
import ReportMap from "./ReportMap";
import ReportImages from "./ReportImages";
import UpdateReportButton from "../buttons/UpdateReportButton";
import DeleteModal from "./DeleteModal";
import ReportDetail from "./ReportDetail";
import { DateDisplay, TimeDisplay } from "../DateTimeDisplay";
import { downloadReportPdf } from "@/api/report";

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

  const isReportStatusSuccess = (report:Report) => {
    return report.reportStatus.status === ReportStatusEnum.enum.SUCCESS;
  };

  const isReportStatusPendingOrProcessing = (report:Report) => {
    return (
      report.reportStatus.status === ReportStatusEnum.enum.PENDING ||
      report.reportStatus.status === ReportStatusEnum.enum.PROCESS
    );
  };

  const [report, setReport] = useState<Report>(initialReport);
  const [isConfirmDeleteReportModalOpen, setIsConfirmDeleteReportModalOpen] = useState(false);

  useEffect(() => {
    setReport(initialReport);
  }, [initialReport]);

  const showConfirmDeleteReportModal = () => {
    setIsConfirmDeleteReportModalOpen(true);
  };

  const closeConfirmDeleteReportModal = () => {
    setIsConfirmDeleteReportModalOpen(false);
  };

  // Filter images by phase
  const beforeImages = report.images.filter(img => img.phase === "BEFORE");
  const afterImages = report.images.filter(img => img.phase === "AFTER");

  return (
    <Modal open={isReportDetailModalOpen} onClose={onReportDetailModalClose}>
      <div className="flex h-screen items-center justify-center font-kanit p-4">
        <div className="w-[90vw] max-w-[1200px] max-h-[85vh] rounded-[10px] bg-white flex flex-col pb-[1%] overflow-y-auto">
          {isReportStatusSuccess(report) ? (
            // Two-section layout for SUCCESS status
            <>
              {/* Upside Section - Original Report */}
              <div className="w-full h-[5dvh] bg-[#505050] border border-[#00000033] rounded-[10px] flex items-center text-white">
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
                <div className="w-[20%] flex justify-end pr-[1%]">
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

              <div className="flex flex-row justify-between items-start my-[2%] px-[3%] gap-6">
                <div className="w-[33.33%]">
                  <ReportMap report={report} />
                </div>
                <div className="w-[33.33%]">
                  <ReportDetail report={report} setReport={setReport} />
                </div>
                <div className="w-[33.33%]">
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

              <div className="flex flex-row justify-between items-start my-[2%] px-[3%] gap-6">
                {/* Solved Stamp instead of map */}
                <div className="w-[33.33%]">
                  <img 
                    src="/images/solved.png" 
                    alt="Solved" 
                    style={{
                      width: "20dvw",
                      height: "auto",
                      aspectRatio: "1 / 1",
                      objectFit: "contain",
                      border: "1px solid rgba(0,0,0,0.5)",
                      borderRadius: "10px",
                      overflow: "hidden"
                    }}
                  />
                </div>
                <div className="w-[33.33%]">
                  {/* Custom Feedback Detail Component */}
                  <div className="w-[20dvw] h-auto aspect-square border border-black/50 rounded-[10px] shadow-inner overflow-y-auto">
                    <div className="flex justify-center text-[2.5vmin] mt-[4%] mb-[2%] font-bold text-black">
                      FEEDBACK
                    </div>
                    <div className="px-[5%] text-[1.75vmin]">
                      {report.reportAssistances.map((assistance) =>
                        assistance.quantity > 0 ? (
                          <div key={assistance.assistanceType.id} className="flex items-center mb-[2%]">
                            <input
                              type="checkbox"
                              checked={assistance.isActive}
                              readOnly
                              className="mr-[2%]"
                            />
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
                <div className="w-[33.33%]">
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
              <div className="w-full h-[5dvh] bg-[#505050] border border-[#00000033] rounded-[10px] flex items-center text-white">
                <div className="w-[20%] flex items-center pl-[1%]">
                  {report.reportStatus.status === ReportStatusEnum.enum.PROCESS && (
                    <img
                      src="/images/share-symbol.png"
                      alt="Download PDF"
                      title="Download PDF"
                      className="cursor-pointer"
                      style={{ height: "4dvh", width: "auto" }}
                      onClick={() => downloadReportPdf(report.id)}
                    />
                  )}
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
                <div className="w-[20%] flex justify-end pr-[1%]">
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

              <div className="flex flex-row justify-between items-start my-[2%] px-[3%] gap-6">
                <div className="w-[33.33%]">
                  <ReportMap report={report} />
                </div>
                <div className="w-[33.33%]">
                  <ReportDetail report={report} setReport={setReport} />
                </div>
                <div className="w-[33.33%]">
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

          <div className="flex justify-center space-x-6 mt-[-1%]">
            {isReportStatusPendingOrProcessing(report) && (
              <UpdateReportButton report={report} />
            )}
            <Button
              variant="contained"
              sx={{
                minWidth: "7dvw",
                height: "5dvh",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: "#FF0000",
                "&:hover": { backgroundColor: "#CC0000" },
                color: "white",
                fontSize: "2vmin",
                borderRadius: "10px",
                fontFamily: "kanit",
              }}
              onClick={showConfirmDeleteReportModal}
            >
              ลบ
            </Button>
            <DeleteModal
              report={report}
              isConfirmDeleteReportModalOpen={isConfirmDeleteReportModalOpen}
              onConfirmDeleteReportModalClose={closeConfirmDeleteReportModal}
              onReportDetailModalClose={onReportDetailModalClose}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
