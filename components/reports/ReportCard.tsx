import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

import { Report } from "@/types/report";
import { DateTimeDisplay } from "../DateTimeDisplay";
import {
  StatusMappingENGToColor,
  StatusMappingToTH,
} from "@/constants/report_status";
import { useState } from "react";
import ReportModal from "./ReportModal";
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

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: "22dvw",
          height: "43dvh",
          border: `2px solid ${StatusMappingENGToColor[report?.reportStatus?.status]}`,
          borderRadius: "12px",
          fontFamily: "kanit",
          marginBottom: "1%",
          padding: "0.5rem",
          display: "flex",
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
            {/* Upper half: original report */}
            <div style={{ flex: 1, borderBottom: "1px solid #00ac28ff", paddingBottom: 4 }}>
              <div className="flex flex-row justify-between items-center text-[2vmin] mb-[1%]">
                {report.firstName} {report.lastName}
                <DateTimeDisplay dateTime={report.createdAt} />
              </div>
              <div
                className="flex justify-end mb-[1%] text-[2vmin] font-semibold"
                style={{ color: StatusMappingENGToColor[report?.reportStatus?.status] }}
              >
                {StatusMappingToTH[report?.reportStatus?.status]}
              </div>
              <div className="flex justify-between items-start">
                <div className="text-[2vmin]">
                  {report.reportAssistances
                    .sort((a, b) => b.assistanceType.id - a.assistanceType.id)
                    .map((assistance) =>
                      assistance.quantity > 0 ? (
                        <div className="mb-4" key={assistance.assistanceType.id}>
                          <div className="font-semibold">
                            {assistance.assistanceType.name}
                          </div>
                          {/* Always show additional detail */}
                          <div className="text-[1.5xvmin] mt-1">{report.additionalDetail}</div>
                        </div>
                      ) : null
                    )}
                </div>
                {/* Show BEFORE images only in upper half */}
                {report.images.filter(img => img.phase === "BEFORE").length > 0 && (
                  <div>
                    <CardMedia
                      component="img"
                      image={report.images.find(img => img.phase === "BEFORE")?.url || "/images/bg.png"}
                      alt="Report Image"
                      sx={{
                        width: "12.5vmin",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
              </div>

            </div>
            {/* Lower half: afterAdditionalDetail and AFTER images */}
            <div style={{ flex: 1, paddingTop: 4, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className="flex flex-row justify-between items-center text-[2vmin] mb-[1%]">
                <span className="font-semibold">ข้อเสนอแนะ</span>
                <DateTimeDisplay dateTime={report.updatedAt} />
              </div>
              <div className="flex justify-between items-start">
                <div className="text-[2vmin]">
                  {report.afterAdditionalDetail || ""}
                </div>
                {/* Show AFTER images only in lower half */}
                {report.images.filter(img => img.phase === "AFTER").length > 0 && (
                  <div>
                    <CardMedia
                      component="img"
                      image={report.images.find(img => img.phase === "AFTER")?.url || "/images/bg.png"}
                      alt="After Image"
                      sx={{
                        width: "12.5vmin",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Always show phone numbers at the bottom */}
            <div className="flex flex-row justify-between items-center text-[2vmin] mt-auto">
              <div>เบอร์โทร {report.mainPhoneNumber}</div>
              <div>เบอร์สำรอง {report.reservePhoneNumber}</div>
            </div>
          </div>
        ) : (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <div className="flex flex-row justify-between items-center text-[2vmin] mb-[1%]">
                {report.firstName} {report.lastName}
                <DateTimeDisplay dateTime={report.createdAt} />
              </div>
              <div
                className="flex justify-end mb-[1%] text-[2vmin] font-semibold"
                style={{ color: StatusMappingENGToColor[report?.reportStatus?.status] }}
              >
                {StatusMappingToTH[report?.reportStatus?.status]}
              </div>
              <div className="flex justify-between items-start">
                <div className="text-[2vmin]">
                  {report.reportAssistances
                    .sort((a, b) => b.assistanceType.id - a.assistanceType.id)
                    .map((assistance) =>
                      assistance.quantity > 0 ? (
                        <div className="mb-4" key={assistance.assistanceType.id}>
                          <div className="font-semibold">
                            {assistance.assistanceType.name}
                          </div>
                          {/* Always show additional detail */}
                          <div className="text-[2vmin] mt-1">{report.additionalDetail}</div>
                        </div>
                      ) : null
                    )}
                </div>
                {/* Only show BEFORE images if not SUCCESS */}
                {report.images.filter(img => img.phase === "BEFORE").length > 0 && (
                  <div>
                    <CardMedia
                      component="img"
                      image={report.images.find(img => img.phase === "BEFORE")?.url || "/images/bg.png"}
                      alt="Report Image"
                      sx={{
                        width: "12.5vmin",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Always show phone numbers at the bottom */}
            <div className="flex flex-row justify-between items-center text-[2vmin] mt-auto">
              <div>เบอร์โทร {report.mainPhoneNumber}</div>
              <div>เบอร์สำรอง {report.reservePhoneNumber}</div>
            </div>
          </div>
        )}
      </Card>
      <ReportModal
        initialReport={report}
        isReportDetailModalOpen={isReportDetailModalOpen}
        onReportDetailModalClose={closeReportDetailModal}
      />
    </>
  );
};

export default ReportCard;
