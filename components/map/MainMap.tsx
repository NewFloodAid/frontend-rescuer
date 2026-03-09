"use client";
import { useEffect, useRef, useState } from "react";
import { Report } from "@/types/report";
import ReportModal from "../reports/ReportModal";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/constants/map";
import { StatusMappingENGToColor } from "@/constants/report_status";
import { loadLeaflet } from "@/libs/loadLeaflet";
import { createLeafletPinIcon } from "@/libs/pinIcon";

interface MapProps {
  reports: Report[];
}

const mapStyle = {
  width: "65dvw",
  height: "83dvh",
  border: "1px solid rgba(0, 0, 0, 0.5)",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
};

const MainMap: React.FC<MapProps> = ({ reports }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;
      if (initPromiseRef.current) {
        await initPromiseRef.current;
        return;
      }

      initPromiseRef.current = (async () => {
        const L = await loadLeaflet();
        leafletRef.current = L;

        if (!mapContainerRef.current || mapRef.current) return;

        const container = mapContainerRef.current as HTMLDivElement & {
          _leaflet_id?: number;
        };
        if (container._leaflet_id !== undefined) {
          mapContainerRef.current.innerHTML = "";
          container._leaflet_id = undefined;
        }

        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        map.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], DEFAULT_ZOOM);

        markerLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        if (!mounted) {
          map.remove();
          mapRef.current = null;
          markerLayerRef.current = null;
          return;
        }

        setMapReady(true);
      })().finally(() => {
        initPromiseRef.current = null;
      });

      await initPromiseRef.current;
    };

    initMap().catch((error) => {
      console.error("Failed to initialize OpenStreetMap:", error);
    });

    const focusHandler = (event: Event) => {
      const payload = (event as CustomEvent<{ lat: number; lng: number }>).detail;
      if (!payload || !mapRef.current) return;
      const zoom = Math.max(mapRef.current.getZoom(), 18);
      mapRef.current.setView([payload.lat, payload.lng], zoom, { animate: true });
    };

    if (typeof window !== "undefined") {
      window.addEventListener("rescuer-map-focus", focusHandler as EventListener);
    }

    return () => {
      mounted = false;
      initPromiseRef.current = null;
      if (typeof window !== "undefined") {
        window.removeEventListener("rescuer-map-focus", focusHandler as EventListener);
      }
      if (markerLayerRef.current) {
        markerLayerRef.current.clearLayers();
        markerLayerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !leafletRef.current || !markerLayerRef.current) return;

    const L = leafletRef.current;
    markerLayerRef.current.clearLayers();

    reports.forEach((report) => {
      const markerColor =
        StatusMappingENGToColor[report?.reportStatus?.status] || "#000000";
      const marker = L.marker(
        [report.location.latitude, report.location.longitude],
        {
          icon: createLeafletPinIcon(L, markerColor),
          keyboard: false,
        },
      );

      marker.on("click", () => {
        setSelectedReport(report);
      });

      marker.addTo(markerLayerRef.current);
    });
  }, [reports, mapReady]);

  return (
    <>
      <div ref={mapContainerRef} style={mapStyle} />
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

export default MainMap;
