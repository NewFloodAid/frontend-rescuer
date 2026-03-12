"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Navbar";
import Loader from "@/components/Loader";
import { isAuthenticated } from "@/api/login";
import { useQueryGetTopAssistanceTopics } from "@/api/report";

type StatFilters = {
  startDate: string;
  endDate: string;
  limit: number;
};

const defaultFilters: StatFilters = {
  startDate: "",
  endDate: "",
  limit: 10,
};

function getPercent(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }
  return (value / total) * 100;
}

export default function StatsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<StatFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<StatFilters>(defaultFilters);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const queryStats = useQueryGetTopAssistanceTopics({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    limit: filters.limit,
  });
  const errorMessage =
    queryStats.error instanceof Error ? queryStats.error.message : "โหลดข้อมูลสถิติไม่สำเร็จ";

  const stats = queryStats.data ?? [];
  const totalRequests = useMemo(
    () => stats.reduce((sum, item) => sum + item.reportCount, 0),
    [stats]
  );
  const maxRequests = useMemo(
    () => stats.reduce((max, item) => Math.max(max, item.reportCount), 0),
    [stats]
  );

  const applyFilters = () => {
    setFilters({ ...draftFilters });
  };

  const clearFilters = () => {
    setDraftFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  if (queryStats.isPending && !queryStats.data) {
    return <Loader />;
  }

  return (
    <>
      <NavBar />

      <div className="px-[3%] py-5 font-kanit">
        <h1 className="text-[4vmin] font-bold text-[#505050]">สถิติเรื่องแจ้งเหตุ</h1>
        <p className="mt-1 text-[2.2vmin] text-[#666666]">
          หัวข้อความช่วยเหลือที่ถูกเลือกมากที่สุด
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-[#d8d8d8] bg-[#EFEFEF] p-4 md:grid-cols-4">
          <label className="flex flex-col gap-1 text-[2vmin] text-[#555555]">
            วันที่เริ่มต้น
            <input
              type="date"
              value={draftFilters.startDate}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, startDate: event.target.value }))
              }
              className="rounded-lg border border-[#c9c9c9] px-3 py-2 text-[2.1vmin]"
            />
          </label>

          <label className="flex flex-col gap-1 text-[2vmin] text-[#555555]">
            วันที่สิ้นสุด
            <input
              type="date"
              value={draftFilters.endDate}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, endDate: event.target.value }))
              }
              className="rounded-lg border border-[#c9c9c9] px-3 py-2 text-[2.1vmin]"
            />
          </label>

          <label className="flex flex-col gap-1 text-[2vmin] text-[#555555]">
            จำนวนหัวข้อที่แสดง
            <select
              value={draftFilters.limit}
              onChange={(event) =>
                setDraftFilters((prev) => ({ ...prev, limit: Number(event.target.value) }))
              }
              className="rounded-lg border border-[#c9c9c9] px-3 py-2 text-[2.1vmin]"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-lg bg-[#22C55E] px-4 py-2 text-[2.1vmin] text-white hover:bg-[#16a34a]"
            >
              ใช้ตัวกรอง
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg bg-[#6B7280] px-4 py-2 text-[2.1vmin] text-white hover:bg-[#4b5563]"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#d8d8d8] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[2.6vmin] font-semibold text-[#3a3a3a]">อันดับหัวข้อช่วยเหลือ</div>
            <div className="text-[2vmin] text-[#666666]">
              รวมทั้งหมด <b>{totalRequests}</b> รายการ
            </div>
          </div>

          {queryStats.isFetching && (
            <div className="mb-2 text-[2vmin] text-[#777777]">กำลังอัปเดตข้อมูล...</div>
          )}

          {queryStats.isError ? (
            <div className="rounded-xl bg-[#fff1f2] px-4 py-6 text-center text-[2.2vmin] text-[#b91c1c]">
              {errorMessage}
            </div>
          ) : stats.length === 0 ? (
            <div className="rounded-xl bg-[#f6f6f6] px-4 py-6 text-center text-[2.2vmin] text-[#777777]">
              ไม่พบข้อมูลในช่วงเวลาที่เลือก
            </div>
          ) : (
            <div className="space-y-3">
              {stats.map((item, index) => {
                const barPercent = maxRequests > 0 ? (item.reportCount / maxRequests) * 100 : 0;
                const percentOfTotal = getPercent(item.reportCount, totalRequests);

                return (
                  <div
                    key={`${item.assistanceTypeId}-${item.assistanceTypeName}`}
                    className="rounded-xl border border-[#ececec] bg-[#fafafa] p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-[2.2vmin] font-medium text-[#333333]">
                        #{index + 1} {item.assistanceTypeName}
                      </div>
                      <div className="text-right text-[2vmin] text-[#555555]">
                        <span className="font-semibold">{item.reportCount}</span> รายการ
                        <span className="mx-2">|</span>
                        <span>{percentOfTotal.toFixed(1)}%</span>
                        <span className="mx-2">|</span>
                        <span>จำนวนรวม {item.totalQuantity}</span>
                      </div>
                    </div>

                    <div className="h-3 w-full rounded-full bg-[#e8e8e8]">
                      <div
                        className="h-3 rounded-full bg-[#ff3388] transition-all duration-300"
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
