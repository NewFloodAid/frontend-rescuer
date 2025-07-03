const StatusMappingToTH: { [key: string]: string } = {
  PENDING: "รอดำเนินการ",
  REJECTED: "ตรวจสอบแล้วไม่พบเหตุ",
  PROCESS: "กำลังดำเนินการ",
  SUCCESS: "เสร็จสิ้น",
};

const StatusMappingENGToColor: { [key: string]: string } = {
  PENDING: "#FFA500", // Orange
  REJECTED: "#808080", // Grey
  PROCESS: "#0000FF", // Blue
  SUCCESS: "#008000", // Green
};

const StatusMappingToENG: { [key: string]: string } = {
  รอดำเนินการ: "PENDING",
  ตรวจสอบแล้วไม่พบเหตุ: "REJECTED",
  กำลังดำเนินการ: "PROCESS",
  เสร็จสิ้น: "SUCCESS",
};
  
export {StatusMappingToTH,StatusMappingToENG , StatusMappingENGToColor}