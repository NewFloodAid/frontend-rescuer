"use client";
import { useEffect, useRef, useState } from "react";
import { Report } from "@/types/report";
import { StatusMappingENGToColor } from "@/constants/report_status";
import { loadLeaflet } from "@/libs/loadLeaflet";
import { createLeafletPinIcon } from "@/libs/pinIcon";

interface ReportMapProps {
  report: Report;
}

const mapStyle = {
  width: "100%",
  height: "auto",
  aspectRatio: "1 / 1",
  border: "1px solid rgba(0,0,0,0.5)",
  borderRadius: "10px",
  overflow: "hidden",
};

const ReportMap: React.FC<ReportMapProps> = ({ report }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const [mapReady, setMapReady] = useState(false);

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

        map.setView([report.location.latitude, report.location.longitude], 16);

        const pinColor =
          StatusMappingENGToColor[report?.reportStatus?.status] || "#000000";

        markerRef.current = L.marker(
          [report.location.latitude, report.location.longitude],
          {
            icon: createLeafletPinIcon(L, pinColor),
            interactive: false,
            keyboard: false,
          },
        ).addTo(map);

        mapRef.current = map;
        if (!mounted) {
          markerRef.current?.remove();
          markerRef.current = null;
          map.remove();
          mapRef.current = null;
          return;
        }

        setMapReady(true);
      })().finally(() => {
        initPromiseRef.current = null;
      });

      await initPromiseRef.current;
    };

    initMap().catch((error) => {
      console.error("Failed to initialize report map:", error);
    });

    return () => {
      mounted = false;
      initPromiseRef.current = null;
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !leafletRef.current || !mapRef.current || !markerRef.current) {
      return;
    }

    const L = leafletRef.current;
    const pinColor =
      StatusMappingENGToColor[report?.reportStatus?.status] || "#000000";

    markerRef.current.setLatLng([report.location.latitude, report.location.longitude]);
    markerRef.current.setIcon(createLeafletPinIcon(L, pinColor));
    mapRef.current.setView(
      [report.location.latitude, report.location.longitude],
      mapRef.current.getZoom(),
      { animate: false },
    );
  }, [report, mapReady]);

  return <div ref={mapContainerRef} style={mapStyle} />;
};

export default ReportMap;
