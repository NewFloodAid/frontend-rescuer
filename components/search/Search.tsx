"use client";
import { ChangeEvent, useState } from "react";
import { Paper, InputBase } from "@mui/material";
import DatePicker from "../DatePicker";

type SearchPartProps = {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  onChangeReportsQueryParam: (field: string, value: string | null) => void;
};

const SearchPart: React.FC<SearchPartProps> = ({
  searchInput,
  setSearchInput,
  onChangeReportsQueryParam,
}) => {

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, searchInput: string) => {
    setSearchInput(searchInput);

  };

  const handleFromDateChange = (fromDate: string) => {
    setFromDate(fromDate);
    onChangeReportsQueryParam("startDate", fromDate);
  };

  const handleToDateChange = (toDate: string) => {
    setToDate(toDate);
    onChangeReportsQueryParam("endDate", toDate);
  };

  return (
    <div className="flex flex-row mb-[1%] items-center font-kanit">
      <div className="text-[2.5vmin] text-[#505050] mr-[1%]">ค้นหา</div>
      <Paper
        sx={{
          width: "40dvw",
          height: "4.5dvh",
          marginRight: "1%",
          borderRadius: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "1.3%",
          border: "1px solid rgba(0, 0, 0, 0.2)",
        }}
        elevation={1}
      >
        <InputBase
          sx={{ fontSize: "2vmin", fontFamily: "kanit", width: "90%" }}
          value={searchInput}
          onChange={(e) => handleSearchChange(e, e.target.value)}
        />
      </Paper>
      <div className="text-[2.5vmin] text-[#505050] mr-[1%]">ตั้งแต่วันที่</div>
      <DatePicker value={fromDate} onChange={handleFromDateChange} />
      <div className="text-[2.5vmin] text-[#505050] mx-[1%]">ถึงวันที่</div>
      <DatePicker value={toDate} onChange={handleToDateChange} />
    </div>
  );
};

export default SearchPart;
