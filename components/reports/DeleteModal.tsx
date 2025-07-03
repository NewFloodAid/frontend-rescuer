import React from "react";
import { Modal, Button } from "@mui/material";
import { useMutationDeleteReport } from "@/api/report";
import { Report } from "@/types/report";

interface DeleteReportModalProps {
  report: Report;
  isConfirmDeleteReportModalOpen: boolean;
  onConfirmDeleteReportModalClose: () => void;
  onReportDetailModalClose: () => void;
}

const DeleteModal: React.FC<DeleteReportModalProps> = ({
  report,
  isConfirmDeleteReportModalOpen,
  onConfirmDeleteReportModalClose,
  onReportDetailModalClose,
}) => {
  const deleteReportMutation = useMutationDeleteReport();
  return (
    <Modal
      open={isConfirmDeleteReportModalOpen}
      onClose={onConfirmDeleteReportModalClose}
    >
      <div className="flex h-screen items-center justify-center font-kanit">
        <div className="w-[30dvw] h-[30dvh] rounded-[10px] bg-white flex flex-col items-center justify-center p-[5%]">
          {/* Centered Text */}
          <div className="font-semibold text-[4vmin] text-center">
            ลบประวัติคำร้องขอ
          </div>

          {/* Centered Buttons */}
          <div className="flex gap-x-6 mt-[10%]">
            <Button
              onClick={() => {
                deleteReportMutation.mutateAsync(report.id);
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

export default DeleteModal;
