"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExportButton from "./Export";
import { getAdminFullName, getAdminRole, isSuperAdmin, logout } from "@/api/login";

const drawerButtonStyles = {
  width: "100%",
  height: "50px",
  padding: "0 20px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  fontSize: "18px",
  fontFamily: "kanit",
  backgroundColor: "white",
  color: "#ff3388",
  borderRadius: "10px",
  marginBottom: "10px",
};

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const adminFullName = getAdminFullName();
  const adminRole = getAdminRole();

  const roleLabel =
    adminRole === "SUPER_ADMIN"
      ? "ผู้ดูแลระบบ"
      : adminRole === "DISTRICT_ADMIN"
        ? "ผู้ดูแลเขต"
        : "เจ้าหน้าที่";
  const roleBgColor =
    adminRole === "SUPER_ADMIN"
      ? "bg-amber-400 text-amber-900"
      : "bg-blue-400 text-blue-900";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navigateTo = (path: string) => {
    setDrawerOpen(false);
    router.push(path);
  };

  return (
    <div className="relative flex h-[7dvh] min-h-[60px] w-full items-center justify-between rounded-bl-[38px] bg-[#ff3388] px-[4vw]">
      <div className="flex items-center gap-[2dvw]">
        <div
          id="nav-logo"
          className="select-none font-andika text-[36px] text-white cursor-pointer"
          onClick={() => router.push("/main")}
        >
          ONSPOT
        </div>
        {adminFullName && (
          <div className="hidden md:flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${roleBgColor}`}
            >
              {roleLabel}
            </span>
            <span className="text-white text-sm font-kanit">
              {adminFullName}
            </span>
          </div>
        )}
      </div>

      <div>
        <IconButton
          onClick={toggleDrawer(true)}
          sx={{ color: "white" }}
          aria-label="menu"
        >
          <MenuIcon fontSize="large" />
        </IconButton>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              width: { xs: "80vw", sm: "350px" },
              backgroundColor: "#fdfdfd",
              padding: "20px",
            },
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-andika font-bold text-[#ff3388]">เมนู</h2>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          
          {adminFullName && (
            <div className="md:hidden flex flex-col gap-2 mb-6 p-4 bg-gray-100 rounded-xl">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${roleBgColor}`}>
                  {roleLabel}
                </span>
              </div>
              <span className="text-gray-800 font-kanit font-semibold">
                {adminFullName}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              variant={pathname === "/main" ? "contained" : "outlined"}
              sx={{
                 ...drawerButtonStyles,
                 backgroundColor: pathname === "/main" ? "#ff3388" : "white",
                 color: pathname === "/main" ? "white" : "#ff3388",
                 borderColor: "#ff3388",
                 "&:hover": { backgroundColor: pathname === "/main" ? "#e62e7a" : "#fff0f5" }
              }}
              onClick={() => navigateTo("/main")}
            >
              <b className="font-andika">รายการแจ้งเหตุทั้งหมด</b>
            </Button>

            <Button
              variant={pathname === "/map" ? "contained" : "outlined"}
              sx={{
                 ...drawerButtonStyles,
                 backgroundColor: pathname === "/map" ? "#ff3388" : "white",
                 color: pathname === "/map" ? "white" : "#ff3388",
                 borderColor: "#ff3388",
                 "&:hover": { backgroundColor: pathname === "/map" ? "#e62e7a" : "#fff0f5" }
              }}
              onClick={() => navigateTo("/map")}
            >
              <b className="font-andika">แผนที่</b>
            </Button>

            <Button
              variant={pathname === "/stats" ? "contained" : "outlined"}
              sx={{
                 ...drawerButtonStyles,
                 backgroundColor: pathname === "/stats" ? "#ff3388" : "white",
                 color: pathname === "/stats" ? "white" : "#ff3388",
                 borderColor: "#ff3388",
                 "&:hover": { backgroundColor: pathname === "/stats" ? "#e62e7a" : "#fff0f5" }
              }}
              onClick={() => navigateTo("/stats")}
            >
              <b className="font-andika">สถิติ</b>
            </Button>

            <Button
              variant={pathname === "/assistance-types" ? "contained" : "outlined"}
              sx={{
                 ...drawerButtonStyles,
                 backgroundColor: pathname === "/assistance-types" ? "#ff3388" : "white",
                 color: pathname === "/assistance-types" ? "white" : "#ff3388",
                 borderColor: "#ff3388",
                 "&:hover": { backgroundColor: pathname === "/assistance-types" ? "#e62e7a" : "#fff0f5" }
              }}
              onClick={() => navigateTo("/assistance-types")}
            >
              <b className="font-andika">จัดการประเภท</b>
            </Button>

            {isSuperAdmin() && (
              <Button
                variant={pathname === "/admin/manage-admins" ? "contained" : "outlined"}
                sx={{
                   ...drawerButtonStyles,
                   backgroundColor: pathname === "/admin/manage-admins" ? "#ff3388" : "#fef3c7",
                   color: pathname === "/admin/manage-admins" ? "white" : "#92400e",
                   borderColor: "#f59e0b",
                   "&:hover": { backgroundColor: pathname === "/admin/manage-admins" ? "#e62e7a" : "#fde68a" }
                }}
                onClick={() => navigateTo("/admin/manage-admins")}
              >
                <b className="font-andika">จัดการผู้ดูแล</b>
              </Button>
            )}

            <div className="w-full flex justify-center border-t border-gray-200 pt-3 mt-2">
              <ExportButton
                text="ดาวน์โหลดข้อมูล"
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </div>

            <Button
              variant="contained"
              sx={{
                ...drawerButtonStyles,
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                marginTop: "10px",
                justifyContent: "center",
                "&:hover": { backgroundColor: "#fecaca" },
              }}
              onClick={handleLogout}
            >
              <b className="font-andika">ออกจากระบบ</b>
            </Button>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default NavBar;
