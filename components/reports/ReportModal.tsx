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
import { shareReportToLine } from "@/libs/liff";

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

  return (
    <Modal open={isReportDetailModalOpen} onClose={onReportDetailModalClose}>
      <div className="flex h-screen items-center justify-center font-kanit">
        <div className="w-[90dvw] min-h-[60dvh] rounded-[10px] bg-white flex flex-col pb-[2%]">
          <div className="w-full h-[6dvh] bg-[#505050] border border-[#00000033] rounded-[10px] flex items-center text-white">
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
                  width: "4.5dvh",
                  height: "4.5dvh",
                }}
                onClick={onReportDetailModalClose}
              >
                <CancelIcon
                  sx={{
                    width: "4.5dvh",
                    height: "auto",
                    aspectRatio: "1 / 1",
                    color: "#FF0000",
                  }}
                />
              </IconButton>
            </div>
          </div>

          <div className="flex flex-row justify-between items-start my-[2%] px-[3%]">
            <ReportMap report={report} />
            <ReportDetail report={report} setReport={setReport} />
            {/* Filter images based on status */}
            <ReportImages
              report={{
                ...report,
                images: isReportStatusSuccess(report)
                  ? report.images
                  : report.images.filter(img => img.phase === "BEFORE"),
              }}
            />
          </div>

          <div className="flex justify-center space-x-6">
            {isReportStatusPendingOrProcessing(report) && (
              <UpdateReportButton report={report} />
            )}
            {report?.reportStatus?.status === ReportStatusEnum.enum.PROCESS && (
              <Button
                variant="contained"
                sx={{
                  minWidth: "7dvw",
                  height: "6dvh",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  backgroundColor: "#06C755",
                  "&:hover": { backgroundColor: "#059944" },
                  color: "white",
                  fontSize: "2vmin",
                  borderRadius: "10px",
                  fontFamily: "kanit",
                }}
                onClick={async () => {
                  const selectedAssistances = report.reportAssistances.filter(a => a.quantity > 0);
                  const description = selectedAssistances.map(a => `${a.assistanceType.name}: ${a.quantity} ${a.assistanceType.unit}`).join("\n");
                  await shareReportToLine({
                    title: `รายงานช่วยเหลือ: ${report.firstName} ${report.lastName}`,
                    description,
                    imageUrl: report.images[0]?.url || "/images/bg.png",
                  });
                }}
              >
                แชร์ไปที่ LINE
              </Button>
            )}
            <Button
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
