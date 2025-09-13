export async function excel(startDate: string, endDate: string) {
  try {
    const params = new URLSearchParams();
    
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    const token = localStorage.getItem("jwtToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    headers["X-Source-App"] = "Web";

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/excel/export?${params.toString()}`;
    console.log('Export URL:', url);
    console.log('Environment variable:', process.env.NEXT_PUBLIC_API_BASE_URL);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Failed to fetch data: ${response.status} ${errorText}`);
    }

    // Get the blob from the response
    const blob = await response.blob();
    console.log('Blob size:', blob.size);
    console.log('Blob type:', blob.type);
    
    // Create a download link
    const url2 = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url2;
    a.download = 'reports.xlsx';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url2);

    return { success: true };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { success: false, message: (error as Error).message };
  }
}
