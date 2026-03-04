import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Button } from "@mui/material";

import { Report } from "@/types/report";
import { ReportStatusEnum } from "@/types/report_status";
import { DateTimeDisplay, DateDisplay, TimeDisplay } from "../DateTimeDisplay";
import {
  StatusMappingENGToColor,
  StatusMappingToTH,
} from "@/constants/report_status";
import { useState, useEffect } from "react";
import ReportModal from "./ReportModal";
import ReportMap from "./ReportMap";
import ReportImages from "./ReportImages";
import UpdateReportButton from "../buttons/UpdateReportButton";
import ReportDetail from "./ReportDetail";
import { useMutationDeleteReport } from "@/api/report";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useMap } from "@vis.gl/react-google-maps";

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const map = useMap();
  const [isReportDetailModalOpen, setIsReportDetailModalOpen] = useState(false);

  const handleMarkerHover = (report: Report) => {
    if (map) {
      map.panTo({
        lat: report.location.latitude,
        lng: report.location.longitude,
      });
      map.setZoom(20);
    }
  };

  const showReportDetailModal = () => {
    setIsReportDetailModalOpen(true);
  };

  const closeReportDetailModal = () => {
    setIsReportDetailModalOpen(false);
  };

  // ----- MOBILE INLINE MODAL LOGIC START -----
  const isReportStatusSuccess = (report: Report) => {
    return report.reportStatus.status === ReportStatusEnum.enum.SUCCESS;
  };

  const isReportStatusPendingOrProcessing = (report: Report) => {
    return (
      report.reportStatus.status === ReportStatusEnum.enum.PENDING ||
      report.reportStatus.status === ReportStatusEnum.enum.PROCESS
    );
  };

  const [localReport, setLocalReport] = useState<Report>(report);
  const deleteReportMutation = useMutationDeleteReport();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setLocalReport(report);
  }, [report]);

  const handleDeleteConfirm = () => {
    MySwal.fire({
      title: 'ลบประวัติคำร้องขอ',
      text: "คุณต้องการลบรายงานนี้ออกจากระบบอย่างถาวรหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#cccccc',
      confirmButtonText: '<span style="color:white; font-family:kanit; font-size:16px;">ลบ</span>',
      cancelButtonText: '<span style="color:black; font-family:kanit; font-size:16px;">ยกเลิก</span>',
      customClass: {
        popup: 'font-kanit',
        container: 'z-[9999]',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReportMutation.mutateAsync(localReport.id).then(() => {
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

  const beforeImages = localReport.images.filter(img => img.phase === "BEFORE");
  const afterImages = localReport.images.filter(img => img.phase === "AFTER");
  // ----- END MOBILE INLINE MODAL LOGIC -----

  return (
    <>
      {/* DESKTOP COMPACT CARD */}
      <Card
        variant="outlined"
        sx={{
          width: { xs: "100%", md: "22.2dvw" },
          height: { xs: "65vh", md: "48dvh" },
          border: `2.2px solid ${StatusMappingENGToColor[report?.reportStatus?.status]}`,
          borderRadius: "12px",
          fontFamily: "kanit",
          marginBottom: "1%",
          padding: "0.5rem",
          display: { xs: "none", md: "flex" }, // Hide on mobile
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
        }}
        onClick={() => showReportDetailModal()}
        onMouseEnter={() => handleMarkerHover(report)}
      >
        {report.reportStatus?.status === "SUCCESS" ? (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

            {/* Top Heading */}
            <div className="flex flex-row justify-between shrink-0 mb-3">
              <div className="text-[18px] md:text-[2vmin] font-normal leading-tight">
                {report.firstName} {report.lastName}
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <div className="flex gap-2 text-[16px] md:text-[1.8vmin] font-semibold text-black leading-tight">
                  <DateTimeDisplay dateTime={report.editedAt || report.createdAt} />
                </div>
                <div
                  className="font-bold text-[18px] md:text-[2vmin] mt-1"
                  style={{ color: StatusMappingENGToColor[report?.reportStatus?.status] }}
                >
                  {StatusMappingToTH[report?.reportStatus?.status]}
                </div>
              </div>
            </div>

            {/* Top Body (Before Info) */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col flex-1 pr-2">
                {report.reportAssistances
                  .sort((a, b) => b.assistanceType.id - a.assistanceType.id)
                  .map((assistance) =>
                    assistance.quantity > 0 ? (
                      <div className="mb-2" key={`success-assist-${assistance.assistanceType.id}`}>
                        <div className="font-bold text-[18px] md:text-[2vmin] leading-tight">
                          {assistance.assistanceType.name}
                        </div>
                        <div className="text-[16px] md:text-[1.8vmin] text-gray-500 mt-1">
                          <div className="line-clamp-2">
                            {report.additionalDetail}
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
              </div>
              {report.images.filter(img => img.phase === "BEFORE").length > 0 && (
                <div className="w-[30%] shrink-0 pl-2">
                  {report.images.filter(img => img.phase === "BEFORE").slice(0, 1).map((img, idx) => (
                    <CardMedia
                      key={`success-before-img-${img.url || idx}`}
                      component="img"
                      image={img.url || "/images/bg.png"}
                      sx={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Feedback Box */}
            <div className="mt-4 p-3 rounded-[12px] flex flex-col shrink-0"
              style={{ border: `2px solid ${StatusMappingENGToColor[report?.reportStatus?.status]}` }}>
              <div className="flex flex-row justify-between items-start mb-2">
                <div className="font-bold text-black text-[15px] md:text-[1.8vmin] leading-tight uppercase">
                  ข้อเสนอแนะ
                </div>
                <div className="text-[14px] md:text-[1.6vmin] font-semibold text-black leading-tight mt-0.5">
                  <DateTimeDisplay dateTime={report.updatedAt} />
                </div>
              </div>
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col flex-1 pr-2 text-[16px] md:text-[1.8vmin] text-gray-500">
                  <div className="line-clamp-2">
                    {report.afterAdditionalDetail || "-"}
                  </div>
                </div>
                {report.images.filter(img => img.phase === "AFTER").length > 0 && (
                  <div className="w-[30%] shrink-0 pl-2">
                    {report.images.filter(img => img.phase === "AFTER").slice(0, 1).map((img, idx) => (
                      <CardMedia
                        key={`success-after-img-${img.url || idx}`}
                        component="img"
                        image={img.url || "/images/bg.png"}
                        sx={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "8px" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-row justify-between items-end text-[16px] md:text-[1.6vmin] mt-auto shrink-0 pt-3 text-black">
              <div>เบอร์โทร {report.mainPhoneNumber}</div>
              <div>เบอร์สำรอง {report.reservePhoneNumber}</div>
            </div>

          </div>
        ) : (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

            {/* Top Heading */}
            <div className="flex flex-row justify-between shrink-0 mb-3">
              <div className="text-[18px] md:text-[2vmin] font-normal leading-tight">
                {report.firstName} {report.lastName}
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <div className="flex gap-2 text-[16px] md:text-[1.8vmin] font-semibold text-black leading-tight">
                  <DateTimeDisplay dateTime={report.editedAt || report.createdAt} />
                </div>
                <div
                  className="font-bold text-[18px] md:text-[2vmin] mt-1"
                  style={{ color: StatusMappingENGToColor[report?.reportStatus?.status] }}
                >
                  {StatusMappingToTH[report?.reportStatus?.status]}
                </div>
              </div>
            </div>

            {/* Top Body (Before Info) */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col flex-1 pr-2">
                {report.reportAssistances
                  .sort((a, b) => b.assistanceType.id - a.assistanceType.id)
                  .map((assistance) =>
                    assistance.quantity > 0 ? (
                      <div className="mb-2" key={`pending-assist-${assistance.assistanceType.id}`}>
                        <div className="font-bold text-[18px] md:text-[2vmin] leading-tight">
                          {assistance.assistanceType.name}
                        </div>
                        <div className="text-[16px] md:text-[1.8vmin] text-gray-500 mt-1">
                          <div className="line-clamp-2">
                            {report.additionalDetail}
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
              </div>
              {report.images.filter(img => img.phase === "BEFORE").length > 0 && (
                <div className="w-[30%] shrink-0 pl-2">
                  {report.images.filter(img => img.phase === "BEFORE").slice(0, 1).map((img, idx) => (
                    <CardMedia
                      key={`pending-before-img-${img.url || idx}`}
                      component="img"
                      image={img.url || "/images/bg.png"}
                      sx={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Empty space filler for non-success statuses to push footer down */}
            <div className="flex-1" />

            {/* Footer */}
            <div className="flex flex-row justify-between items-end text-[16px] md:text-[1.6vmin] mt-auto shrink-0 pt-3 text-black">
              <div>เบอร์โทร {report.mainPhoneNumber}</div>
              <div>เบอร์สำรอง {report.reservePhoneNumber}</div>
            </div>

          </div>
        )}
      </Card>

      {/* MOBILE INLINE MODAL VIEW */}
      {/* Hide SUCCESS reports entirely on mobile */}
      {!isReportStatusSuccess(localReport) && (
        <div
          className="flex flex-col md:hidden w-full font-kanit bg-white rounded-[10px] shadow-sm overflow-hidden mb-4"
          style={{ border: `2px solid ${StatusMappingENGToColor[report?.reportStatus?.status]}` }}
        >
          {isReportStatusSuccess(localReport) ? (
            // Unified Layout for SUCCESS status
            <div className="flex flex-col w-full">
              {/* Unified Header */}
              <div className="w-full min-h-[6dvh] py-3 bg-[#505050] border-b border-[#00000033] flex flex-col items-center px-[3%] text-white">
                <div className="text-[18px] font-bold text-center mt-2">
                  {localReport.firstName} {localReport.lastName}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex flex-col w-full px-[4%] py-[4%] gap-4">
                {/* Before Section */}
                <div className="flex flex-col">
                  <div className="flex flex-col border-b-2 border-gray-200 pb-[2%] mb-[4%]">
                    <span className="text-[20px] font-bold text-gray-800">ข้อมูลการแจ้งเหตุ (ก่อนดำเนินการ)</span>
                    <span className="text-[16px] text-gray-500 font-medium tracking-wide mt-1">
                      แจ้งเมื่อ: <DateDisplay dateTime={localReport.createdAt} /> เวลา <TimeDisplay dateTime={localReport.createdAt} />น.
                    </span>
                  </div>
                  <div className="flex flex-col gap-6 w-full">
                    <div className="w-full h-[25vh] overflow-hidden rounded-[10px]">
                      <ReportMap report={localReport} />
                    </div>
                    <div className="w-full">
                      <ReportDetail report={localReport} setReport={setLocalReport} />
                    </div>
                    <div className="w-full">
                      <ReportImages report={{ ...localReport, images: beforeImages }} />
                    </div>
                  </div>
                </div>

                {/* After Section */}
                <div className="flex flex-col mt-4">
                  <div className="flex flex-col border-b-2 border-gray-200 pb-[2%] mb-[4%]">
                    <span className="text-[20px] font-bold text-[#22C55E]">ผลการดำเนินการ</span>
                    <span className="text-[16px] text-gray-500 font-medium tracking-wide mt-1">
                      เสร็จสิ้นเมื่อ: <DateDisplay dateTime={localReport.updatedAt || localReport.createdAt} /> เวลา <TimeDisplay dateTime={localReport.updatedAt || localReport.createdAt} />น.
                    </span>
                  </div>
                  <div className="flex flex-col gap-6 w-full">
                    <div className="w-full flex justify-center items-center">
                      <img
                        src="/images/solved.png"
                        alt="Solved"
                        className="w-[50%] h-auto aspect-square object-contain"
                      />
                    </div>
                    <div className="w-full">
                      <div className="w-full h-auto aspect-square border border-black/50 rounded-[10px] shadow-inner overflow-y-auto">
                        <div className="flex justify-center text-[20px] mt-[4%] mb-[2%] font-bold text-[#22C55E]">
                          ข้อเสนอแนะ
                        </div>
                        <div className="px-[5%] text-[16px]">
                          {localReport.reportAssistances.map((assistance) =>
                            assistance.quantity > 0 ? (
                              <div key={assistance.assistanceType.id} className="font-semibold flex items-center mb-[2%]">
                                <span>
                                  {assistance.assistanceType.name}
                                </span>
                              </div>
                            ) : null
                          )}
                          <div className="mt-[4%] mb-[2%] text-[16px]">
                            <div className="px-[3%] font-semibold">สถานที่เกิดเหตุ:</div>
                            <div className="w-full px-[5%] font-normal break-words mt-[2%]">
                              {localReport.location.address}
                            </div>
                          </div>
                          <div className="mt-[4%] mb-[4%] text-[16px]">
                            <div className="px-[3%] font-semibold">รายละเอียดเพิ่มเติม:</div>
                            <div className="w-full px-[5%] font-normal break-words mt-[2%] text-gray-500">
                              <div className="line-clamp-2">
                                {localReport.afterAdditionalDetail || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <ReportImages report={{ ...localReport, images: afterImages }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Original single-section layout for other statuses
            <>
              <div className="w-full min-h-[5dvh] py-4 bg-[#505050] border border-[#00000033] flex flex-col items-center text-white px-4">
                <div className="font-bold text-center text-[16px] leading-tight mt-2">
                  {localReport.firstName} {localReport.lastName}
                </div>
                <div className="flex flex-row justify-center gap-2 text-[16px] text-gray-300 mt-2 mb-2">
                  <div>
                    <DateDisplay dateTime={localReport.createdAt} />
                  </div>
                  <div>
                    เวลา <TimeDisplay dateTime={localReport.createdAt} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col my-[4%] px-[4%] gap-6 w-full">
                <div className="w-full h-[25vh] overflow-hidden rounded-[10px]">
                  <ReportMap report={localReport} />
                </div>
                <div className="w-full">
                  <ReportDetail report={localReport} setReport={setLocalReport} />
                </div>
                <div className="w-full">
                  <ReportImages
                    report={{
                      ...localReport,
                      images: beforeImages,
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons for Mobile */}
          <div className="flex flex-wrap md:flex-nowrap justify-center w-full mt-[2%] mb-[4%] gap-4 md:gap-0 md:space-x-6">
            {isReportStatusPendingOrProcessing(localReport) && (
              <div>
                <UpdateReportButton report={localReport} />
              </div>
            )}
            <Button
              variant="contained"
              sx={{
                minWidth: "35vw",
                height: "6.5dvh",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                backgroundColor: "#FF0000",
                "&:hover": { backgroundColor: "#CC0000" },
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                borderRadius: "10px",
                fontFamily: "kanit",
              }}
              onClick={handleDeleteConfirm}
            >
              ลบ
            </Button>
          </div>
        </div>
      )}

      <ReportModal
        initialReport={report}
        isReportDetailModalOpen={isReportDetailModalOpen}
        onReportDetailModalClose={closeReportDetailModal}
      />
    </>
  );
};

export default ReportCard;
