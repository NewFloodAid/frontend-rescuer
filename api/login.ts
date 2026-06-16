import { jwtDecode } from "jwt-decode";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  fullName: string;
  districtIds: number[];
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      if (response.status === 423) {
        throw new Error(data?.message || "บัญชีถูกล็อก กรุณาลองใหม่ภายหลัง");
      }
      if (response.status === 403) {
        throw new Error(data?.message || "บัญชีถูกปิดใช้งาน");
      }
      throw new Error(data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }

    const loginData = data as LoginResponse;
    localStorage.setItem("jwtToken", loginData.accessToken);
    localStorage.setItem("refreshToken", loginData.refreshToken);
    localStorage.setItem("adminRole", loginData.role);
    localStorage.setItem("adminFullName", loginData.fullName);
    localStorage.setItem("adminDistrictIds", JSON.stringify(loginData.districtIds));

    return { success: true };
  } catch (error) {
    const err = error as Error;
    return { success: false, message: err.message || "เข้าสู่ระบบไม่สำเร็จ" };
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      clearAuthData();
      return false;
    }

    const data = await response.json();
    localStorage.setItem("jwtToken", data.accessToken);
    if (data.role) localStorage.setItem("adminRole", data.role);
    if (data.fullName) localStorage.setItem("adminFullName", data.fullName);
    if (data.districtIds) localStorage.setItem("adminDistrictIds", JSON.stringify(data.districtIds));

    return true;
  } catch {
    clearAuthData();
    return false;
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch {
    // Ignore errors during logout
  } finally {
    clearAuthData();
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("jwtToken");

  try {
    if (!token) throw new Error("No token found");

    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      throw new Error("Token expired");
    }

    return true;
  } catch {
    return false;
  }
}

export function getAdminRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminRole");
}

export function getAdminFullName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminFullName");
}

export function getAdminDistrictIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const ids = localStorage.getItem("adminDistrictIds");
    return ids ? JSON.parse(ids) : [];
  } catch {
    return [];
  }
}

export function isSuperAdmin(): boolean {
  return getAdminRole() === "SUPER_ADMIN";
}

export function isDistrictAdmin(): boolean {
  return getAdminRole() === "DISTRICT_ADMIN";
}

function clearAuthData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("adminFullName");
  localStorage.removeItem("adminDistrictIds");
}
