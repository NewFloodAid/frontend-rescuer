"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Navbar";
import { isAuthenticated, isSuperAdmin } from "@/api/login";
import { useQueryGetAuditLogs } from "@/api/admin";
import Loader from "@/components/Loader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "เข้าสู่ระบบ",
  LOGOUT: "ออกจากระบบ",
  CREATE: "สร้าง",
  UPDATE: "อัปเดต",
  DEACTIVATE: "ปิดใช้งาน",
  DELETE: "ลบ",
};

const ENTITY_LABELS: Record<string, string> = {
  ADMIN: "ผู้ดูแล",
  REPORT: "รายงาน",
};

export default function AuditLogs() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const auditLogsQuery = useQueryGetAuditLogs(page, pageSize);

  useEffect(() => {
    if (!isAuthenticated() || !isSuperAdmin()) {
      router.replace("/main");
    }
  }, [router]);

  if (auditLogsQuery.isPending) return <Loader />;

  const logs = auditLogsQuery.data?.content || [];
  const totalPages = auditLogsQuery.data?.totalPages || 0;

  return (
    <>
      <NavBar />
      <div className="px-[3%] py-4 font-kanit">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">บันทึกการใช้งาน</h1>
          <button
            onClick={() => router.push("/admin/manage-admins")}
            className="px-4 py-2 bg-[#ff3388] text-white rounded-lg hover:bg-[#ff0066] transition-colors font-bold"
          >
            ← จัดการผู้ดูแล
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-3 text-left">วันที่</th>
                <th className="p-3 text-left">ผู้ดูแล (ID)</th>
                <th className="p-3 text-left">การกระทำ</th>
                <th className="p-3 text-left">ประเภท</th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm">
                    {new Date(log.createdAt).toLocaleString("th-TH")}
                  </td>
                  <td className="p-3">{log.adminId}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {ENTITY_LABELS[log.entityType] || log.entityType || "-"}
                  </td>
                  <td className="p-3 text-sm">{log.entityId || "-"}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {log.ipAddress || "-"}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    ไม่มีบันทึกการใช้งาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Stack spacing={2} sx={{ marginY: "2%", alignItems: "center" }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_e, value) => setPage(value - 1)}
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontFamily: "kanit",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#ff3388",
                  color: "#FFFFFF",
                },
              }}
            />
          </Stack>
        )}
      </div>
    </>
  );
}
