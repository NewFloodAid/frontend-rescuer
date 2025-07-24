const StatusMappingToTH: { [key: string]: string } = {
  PENDING: "รอดำเนินการ",
  PROCESS: "รวบรวมข้อมูล",
  SENT: "ส่งเรื่องไปแล้ว",
  SUCCESS: "เสร็จสิ้น",
};

const StatusMappingENGToColor: { [key: string]: string } = {
  PENDING: "#ff0000ff",
  PROCESS: "#FFA500",
  SENT: "#0088ffff",
  SUCCESS: "#00ac28ff",
};

const StatusMappingToENG: { [key: string]: string } = {
  รอดำเนินการ: "PENDING",
  รวบรวมข้อมูล: "PROCESS",
  ส่งต่อไปแล้ว: "SENT",
  เสร็จสิ้น: "SUCCESS",
};
  
export {StatusMappingToTH,StatusMappingToENG , StatusMappingENGToColor}