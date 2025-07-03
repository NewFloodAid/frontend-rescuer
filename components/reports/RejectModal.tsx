import React from "react";
import { Modal, Button } from "@mui/material";
import { useMutationUpdateReport } from "@/api/report";
import { Report } from "@/types/report";
import { useQueryGetReportStatuses } from "@/api/reportStatus";
import {ReportStatusEnum } from "@/types/report_status";
import Loader from "../Loader";

interface RejectReportModalProps {
  report: Report;
  isConfirmDeleteReportModalOpen: boolean;
  onConfirmDeleteReportModalClose: () => void;
  onReportDetailModalClose: () => void;
}

const RejectReportModal: React.FC<RejectReportModalProps> = ({
  report,
  isConfirmDeleteReportModalOpen,
  onConfirmDeleteReportModalClose,
  onReportDetailModalClose,
}) => {
  const reportStatusQuery = useQueryGetReportStatuses({ isUser: false });
  const rejectStatus = reportStatusQuery.data?.find(
    (status) => status.status === ReportStatusEnum.enum.REJECTED
  );
  const rejectReportMutation = useMutationUpdateReport();

  if(reportStatusQuery.isPending) {
    return <Loader />;
  }
  return (
    <Modal
      open={isConfirmDeleteReportModalOpen}
      onClose={onConfirmDeleteReportModalClose}
    >
      <div className="flex h-screen items-center justify-center font-kanit">
        <div className="w-[30dvw] h-[30dvh] rounded-[10px] bg-white flex flex-col items-center justify-center p-[5%]">
          {/* Centered Text */}
          <div className="font-semibold text-[4vmin] text-center">
            ยกเลิกคำร้องขอ
          </div>

          <div className="flex gap-x-6 mt-[10%]">
            <Button
              onClick={() => {
                rejectReportMutation.mutateAsync({
                  report: {
                    ...report,
                    reportStatus: rejectStatus!
                  }
                });
                onConfirmDeleteReportModalClose();
                onReportDetailModalClose();
              }}
              variant="contained"
              sx={{
                minWidth: "6dvw",
                height: "6dvh",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: "#FF0000",
                fontFamily: "kanit",
                fontSize: "2vmin",
              }}
            >
              ลบ
            </Button>
            <Button
              variant="contained"
              sx={{
                minWidth: "6dvw",
                height: "6dvh",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: "#FFFFFF",
                fontFamily: "kanit",
                fontSize: "2vmin",
                color: "#000000",
              }}
              onClick={onConfirmDeleteReportModalClose}
            >
              ยกเลิก
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RejectReportModal;
