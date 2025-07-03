"use client";
import { Paper, InputBase } from "@mui/material";

type DatePickerProps = {
  value: string;
  onChange: (date: string) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); 
  };

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
          paddingLeft: "1.3%",
          border: "1px solid rgba(0, 0, 0, 0.2)",
        }}
        elevation={1}
      >
        <InputBase
          type="date"
          sx={{
            fontSize: "2vmin",
            fontFamily: "Kanit",
            width: "90%",
          }}
          value={value}
          onChange={handleInputChange}
        />
      </Paper>
    </div>
  );
};

export default DatePicker;
