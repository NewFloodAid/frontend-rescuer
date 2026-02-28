import React, { useState, useRef, useEffect } from "react";
import { Report } from "@/types/report";
import { ReportStatusEnum } from "@/types/report_status";
import { DateDisplay, TimeDisplay } from "../DateTimeDisplay";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface TimestampDropdownProps {
    report: Report;
}

type TimestampEntry = {
    label: string;
    dateTime: string;
};

function getTimestampEntries(report: Report): TimestampEntry[] {
    const status = report.reportStatus.status;
    const entries: TimestampEntry[] = [];

    entries.push({ label: "แจ้งเมื่อ", dateTime: report.updatedAt || report.createdAt });

    if (
        status === ReportStatusEnum.enum.PROCESS ||
        status === ReportStatusEnum.enum.SENT ||
        status === ReportStatusEnum.enum.SUCCESS
    ) {
        if (report.processedAt) {
            entries.push({ label: "รับเรื่องเมื่อ", dateTime: report.processedAt });
        }
    }

    if (
        status === ReportStatusEnum.enum.SENT ||
        status === ReportStatusEnum.enum.SUCCESS
    ) {
        if (report.sentAt) {
            entries.push({ label: "ส่งเรื่องไปเมื่อ", dateTime: report.sentAt });
        }
    }

    if (status === ReportStatusEnum.enum.SUCCESS) {
        entries.push({
            label: "สำเร็จเมื่อ",
            dateTime: report.updatedAt,
        });
    }

    return entries;
}

function getCurrentTimestamp(report: Report): TimestampEntry {
    const status = report.reportStatus.status;

    switch (status) {
        case ReportStatusEnum.enum.PROCESS:
            return {
                label: "รับเรื่องเมื่อ",
                dateTime: report.processedAt || report.createdAt,
            };
        case ReportStatusEnum.enum.SENT:
            return {
                label: "ส่งเรื่องไปเมื่อ",
                dateTime: report.sentAt || report.createdAt,
            };
        case ReportStatusEnum.enum.SUCCESS:
            return {
                label: "สำเร็จเมื่อ",
                dateTime: report.updatedAt,
            };
        case ReportStatusEnum.enum.PENDING:
        default:
            return {
                label: "แจ้งเมื่อ",
                dateTime: report.updatedAt || report.createdAt,
            };
    }
}

const TimestampDropdown: React.FC<TimestampDropdownProps> = ({ report }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const status = report.reportStatus.status;
    const isPending = status === ReportStatusEnum.enum.PENDING;

    const current = getCurrentTimestamp(report);
    const allEntries = getTimestampEntries(report);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                type="button"
                onClick={() => !isPending && setIsOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-[15px] md:text-[2vmin] ${isPending
                    ? "cursor-default"
                    : "cursor-pointer hover:opacity-80 transition-opacity"
                    }`}
                style={{ background: "none", border: "none", color: "inherit", fontFamily: "kanit", padding: 0 }}
            >
                <span>
                    {current.label}: <DateDisplay dateTime={current.dateTime} /> เวลา{" "}
                    <TimeDisplay dateTime={current.dateTime} />
                </span>
                {!isPending &&
                    (isOpen ? (
                        <KeyboardArrowUpIcon sx={{ fontSize: "inherit" }} />
                    ) : (
                        <KeyboardArrowDownIcon sx={{ fontSize: "inherit" }} />
                    ))}
            </button>

            {isOpen && !isPending && (
                <div
                    className="absolute right-0 top-full mt-1 z-50 min-w-[250px] rounded-lg shadow-lg border border-white/20 overflow-hidden"
                    style={{ backgroundColor: "rgba(50, 50, 50, 0.95)", backdropFilter: "blur(8px)" }}
                >
                    {allEntries.map((entry, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center gap-2 px-4 py-2 text-[14px] md:text-[1.8vmin] text-white/90 ${idx < allEntries.length - 1 ? "border-b border-white/10" : ""
                                }`}
                        >
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                    backgroundColor:
                                        idx === allEntries.length - 1
                                            ? "#22C55E"
                                            : "rgba(255,255,255,0.4)",
                                }}
                            />
                            <span className="font-medium whitespace-nowrap">
                                {entry.label}:
                            </span>
                            <span className="whitespace-nowrap">
                                <DateDisplay dateTime={entry.dateTime} /> เวลา{" "}
                                <TimeDisplay dateTime={entry.dateTime} />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimestampDropdown;
