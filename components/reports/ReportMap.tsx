"use client";
import { useEffect, useState } from "react";
import { Report } from "@/types/report";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { PriorityMappingToColor } from "@/constants/priority";

interface ReportMapProps {
  report: Report;
}

const mapStyle = {
  width: "26dvw",
  height: "auto",
  aspectRatio: "1 / 1",
  border: "1px solid rgba(0,0,0,0.5)",
  borderRadius: "10px",
  overflow: "hidden",
};

const ReportMap: React.FC<ReportMapProps> = ({ report }) => {
  const [pinColor, setPinColor] = useState<string>(
    PriorityMappingToColor[Number(report.priority)]
  );

  useEffect(() => {
    setPinColor(PriorityMappingToColor[Number(report.priority)]);
  }, [report]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        style={mapStyle}
        defaultCenter={{
          lat: report.location.latitude,
          lng: report.location.longitude,
        }}
        defaultZoom={16}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <AdvancedMarker
          position={{
            lat: report.location.latitude,
            lng: report.location.longitude,
          }}
        >
          <Pin
            background={pinColor}
            borderColor={pinColor}
            glyphColor={"#FFFFFF"}
          />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};

export default ReportMap;