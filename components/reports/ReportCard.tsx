import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid2 } from "@mui/material";
import { Report } from "@/types/report";
import { DateTimeDisplay } from "../DateTimeDisplay";
import {
  StatusMappingENGToColor,
  StatusMappingToTH,
} from "@/constants/report_status";
import { useState } from "react";
import ReportModal from "./ReportModal";
import { PriorityMappingToColor } from "@/constants/priority";
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

  const borderColor = PriorityMappingToColor[Number(report.priority)];

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: "22dvw",
          height: "38dvh",
          border: `2px solid ${borderColor}`,
          borderRadius: "10px",
          fontFamily: "kanit",
          marginBottom: "1%",
          padding: "1%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
        }}
        onClick={() => showReportDetailModal()}
        onMouseEnter={() => handleMarkerHover(report)}
      >
        <Grid2>
          <div className="flex flex-row justify-between items-center text-[1.5vmin] mb-[1%]">
            ผู้ร้อง {report.firstName} {report.lastName}
            <DateTimeDisplay dateTime={report.createdAt} />
          </div>
          <div
            className="flex justify-end mb-[2%] text-[2vmin]"
            style={{
              color: StatusMappingENGToColor[report?.reportStatus?.status],
            }}
          >
            {StatusMappingToTH[report?.reportStatus?.status]}
          </div>
          <div className="flex justify-between items-start">
            <div className="text-[1.5vmin]">
              {report.reportAssistances
                .sort((a, b) => b.assistanceType.id - a.assistanceType.id)
                .map((assistance) =>
                  assistance.quantity > 0 ? (
                    <div className="mb-4" key={assistance.assistanceType.id}>
                      <div className="font-semibold">
                        {assistance.assistanceType.name}: {assistance.quantity}{" "}
                        {assistance.assistanceType.unit}
                      </div>
                    </div>
                  ) : null
                )}
            </div>
            {report.images.length > 0 && (
              <div>
                <CardMedia
                  component="img"
                  image={report.images[0]?.url || "/images/bg.png"}
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
        </Grid2>
        <Grid2>
          <div className="flex flex-row justify-between items-center text-[1.5vmin]">
            <div>เบอร์โทร {report.mainPhoneNumber}</div>
            <div>เบอร์สำรอง {report.reservePhoneNumber}</div>
          </div>
        </Grid2>
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
