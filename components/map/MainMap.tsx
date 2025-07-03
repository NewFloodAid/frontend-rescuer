"use client";
import { useState } from "react";
import { PriorityMappingToColor } from "@/constants/priority";
import { Report } from "@/types/report";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import ReportModal from "../reports/ReportModal";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/constants/map";

interface MapProps {
  reports: Report[];
}

const mapStyle = {
  width: "60dvw",
  height: "37dvh",
  border: "1px solid rgba(0, 0, 0, 0.5)",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
};

const MapWithMarkers: React.FC<{ reports: Report[] }> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report);
  };
  return (
    <>
      {reports.map((report) => {
        const pinColor = PriorityMappingToColor[Number(report.priority)];
        return (
          <AdvancedMarker
            key={report.id}
            position={{
              lat: report.location.latitude,
              lng: report.location.longitude,
            }}
            onClick={() => handleMarkerClick(report)}
          >
            <Pin
              background={pinColor}
              borderColor={pinColor}
              glyphColor={"#FFFFFF"}
            />
          </AdvancedMarker>
        );
      })}
      {selectedReport && (
        <ReportModal
          initialReport={selectedReport}
          isReportDetailModalOpen={!!selectedReport}
          onReportDetailModalClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
};

const MainMap: React.FC<MapProps> = ({ reports }) => {
  return (
    <Map
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
      style={mapStyle}
      defaultCenter={DEFAULT_CENTER}
      defaultZoom={DEFAULT_ZOOM}
      gestureHandling="greedy"
      // disableDefaultUI
    >
      <MapWithMarkers reports={reports} />
    </Map>
  );
};

export default MainMap;
