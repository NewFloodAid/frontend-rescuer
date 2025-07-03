export async function excel(startDate: string, endDate: string, priorities: string) {
  try {
    const params = new URLSearchParams({
      startDate: startDate,
      endDate: endDate,
      priorities: priorities 
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/excel/export?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const blob = await response.blob(); // Expecting a blob response (Excel file)
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { success: false, message: (error as Error).message };
  }
}
