import { jwtDecode } from "jwt-decode";

export async function login(username: string, password: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ username, password }).toString(),
        }
      );
  
      const data = await response.json().catch(() => null);
  
      if (!response.ok || !data) {
        throw new Error(data?.message || "Incorrect username or password");
      }
  
      localStorage.setItem("jwtToken", data.jwtToken);
      return { success: true };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: err.message || "Login failed" };
    }
  }
 
  export function isAuthenticated() {
    const token = localStorage.getItem("jwtToken");
  
    try {
      if (!token) throw new Error("No token found");
  
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decoded.exp < currentTime) {
        throw new Error("Token expired");
      }
  
      return true;
    } catch (error) {
      localStorage.removeItem("jwtToken");
      return false;
    }
  }
  