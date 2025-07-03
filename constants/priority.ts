const PriorityMappingToColor: { [key: number]: string } = {
  0: "#00FF00", // Green
  1: "#FF0000", // Red
  2: "#FFAE00", // Yellow
  3: "#0077FF", // Blue
  4: "#808080", // Grey
};

const PriorityMappingToName: { [key: number]: string } = {
  0: "เสร็จสิ้น", // Green
  1: "ฉุกเฉิน", // Red
  2: "เร่งด่วน", // Yellow
  3: "ไม่เร่งด่วน", // Blue
};

export { PriorityMappingToColor, PriorityMappingToName };
