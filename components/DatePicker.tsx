"use client";
import { Paper, Box } from "@mui/material";
import { useMemo } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const displayValue = useMemo(() => {
    if (!value) return "dd/mm/yy";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return "dd/mm/yy";
    return `${day}/${month}/${year.substring(2)}`;
  }, [value]);

  return (
    <div>
      <Paper
        sx={{
          width: "12dvw",
          height: "4.55dvh",
          marginRight: "1%",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          position: "relative",
          cursor: "pointer",
        }}
        elevation={1}
      >
        <span style={{ fontSize: "2vmin", fontFamily: "Kanit", color: value ? "inherit" : "#A9A9A9" }}>
          {displayValue}
        </span>
        <CalendarTodayIcon sx={{ fontSize: "2.5vmin", color: "#505050", position: "absolute", right: "5%" }} />

        <input
          type="date"
          style={{
            position: "absolute",
            opacity: 0,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
          value={value}
          onChange={handleInputChange}
        />
      </Paper>
    </div>
  );
};

export default DatePicker;
