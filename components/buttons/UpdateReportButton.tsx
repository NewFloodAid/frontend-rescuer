import React from "react";
import { Button } from "@mui/material";
import { Report } from "@/types/report";
import { ReportStatusEnum } from "@/types/report_status";
import { useMutationUpdateReport } from "@/api/report";
import { useQueryGetReportStatuses } from "@/api/reportStatus";
import Loader from "../Loader";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface UpdateReportButtonProps {
  report: Report;
}

const UpdateReportButton: React.FC<UpdateReportButtonProps> = ({ report }) => {
  const reportStatusQuery = useQueryGetReportStatuses({ isUser: false });
  const mutationUpdateReport = useMutationUpdateReport();
  const MySwal = withReactContent(Swal);

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

    if (report.reportStatus.status === ReportStatusEnum.enum.PENDING) {
      try {
        const updatedReport = {
          ...report,
          reportStatus: newReportStatus,
        };
        await mutationUpdateReport.mutateAsync({ report: updatedReport });
      } catch (error) {
        console.error("Failed to update report status", error);
      }
      return;
    }

    const confirmTitle = 'ยืนยันการส่งเรื่อง';
    const confirmText = 'กรุณาตรวจสอบว่าท่านได้ส่งรายงานให้กับหน่วยงานที่รับผิดชอบเรียบร้อยแล้ว';
    const confirmColor = '#3B82F6';

    MySwal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#cccccc',
      confirmButtonText: '<span style="color:white; font-family:kanit; font-size:2vmin;">ยืนยัน</span>',
      cancelButtonText: '<span style="color:black; font-family:kanit; font-size:2vmin;">ยกเลิก</span>',
      customClass: {
        popup: 'font-kanit',
        container: 'z-[9999]',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedReport = {
          ...report,
          reportStatus: newReportStatus,
        };
        mutationUpdateReport.mutateAsync({ report: updatedReport }).then(() => {
          MySwal.fire({
            title: 'อัปเดตสถานะสำเร็จ!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            customClass: { popup: 'font-kanit', container: 'z-[9999]' }
          });
        }).catch((error) => {
          console.error("Failed to update report status", error);
          MySwal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถอัปเดตสถานะได้',
            icon: 'error',
            confirmButtonColor: '#FF0000',
            customClass: { popup: 'font-kanit', container: 'z-[9999]' }
          });
        });
      }
    });
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
