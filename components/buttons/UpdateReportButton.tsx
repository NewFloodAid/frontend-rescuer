import React from "react";
import { Button } from "@mui/material";
import { Report } from "@/types/report";
import { ReportStatusEnum } from "@/types/report_status";
import { useMutationUpdateReport } from "@/api/report";
import { useQueryGetReportStatuses } from "@/api/reportStatus";
import Loader from "../Loader";

interface UpdateReportButtonProps {
  report: Report;
}

const UpdateReportButton: React.FC<UpdateReportButtonProps> = ({ report }) => {
  const reportStatusQuery = useQueryGetReportStatuses({ isUser: false });
  const mutationUpdateReport = useMutationUpdateReport();

  const getStatusButtonStyle = (status: string) => {
    switch (status) {
      case ReportStatusEnum.enum.PENDING:
        return {
          backgroundColor: "#FACC15",
          "&:hover": { backgroundColor: "#EAB308" },
        };
      case ReportStatusEnum.enum.PROCESS:
        return {
          backgroundColor: "#3B82F6",
          "&:hover": { backgroundColor: "#2563EB" },
        };
      case ReportStatusEnum.enum.SENT:
        return {
          backgroundColor: "#00BFFF",
          "&:hover": { backgroundColor: "#009ACD" },
        };
      case ReportStatusEnum.enum.SUCCESS:
        return {
          backgroundColor: "#22C55E",
          "&:hover": { backgroundColor: "#16A34A" },
        };
      default:
        return {
          backgroundColor: "#6B7280",
          "&:hover": { backgroundColor: "#4B5563" },
        };
    }
  };

  const handleUpdateReport = async () => {
    if (reportStatusQuery.isLoading || !reportStatusQuery.data) {
      console.error("Report statuses are still loading");
      return;
    }

    let newStatus: string | undefined;

    if (report.reportStatus.status === ReportStatusEnum.enum.PENDING) {
      newStatus = ReportStatusEnum.enum.PROCESS;
    } else if (report.reportStatus.status === ReportStatusEnum.enum.PROCESS) {
      newStatus = ReportStatusEnum.enum.SENT;
    } else {
      // SENT and SUCCESS cannot be updated here
      return;
    }

    const newReportStatus = reportStatusQuery.data.find(
      (status) => status.status === newStatus
    );

    if (!newReportStatus) {
      console.error("Failed to find new report status");
      return;
    }

    try {
      const updatedReport = {
        ...report,
        reportStatus: newReportStatus,
      };
      await mutationUpdateReport.mutateAsync({ report: updatedReport });
    } catch (error) {
      console.error("Failed to update report status", error);
    }
  };

  const reportStatusLabel =
    report.reportStatus.status === ReportStatusEnum.enum.PENDING
      ? "รับคำขอ"
      : report.reportStatus.status === ReportStatusEnum.enum.PROCESS
        ? "ส่งเรื่องไปแล้ว"
        : "อัพเดต";

  if (reportStatusQuery.isPending) {
    return <Loader />;
  }

  return (
    <Button
      variant="contained"
      sx={{
        ...getStatusButtonStyle(report.reportStatus.status),
        minWidth: "7dvw",
        height: "6dvh",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        color: "#FFFFFF",
        fontSize: "2vmin",
        borderRadius: "10px",
        fontFamily: "kanit",
      }}
      onClick={handleUpdateReport}
    >
      {reportStatusLabel}
    </Button>
  );
};

export default UpdateReportButton;
