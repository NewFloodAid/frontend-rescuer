import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useQueryGetReportStatuses } from "@/api/reportStatus";
import { StatusMappingToTH, StatusMappingENGToColor } from "@/constants/report_status";

type ToggleButtonsProps = {
  onChangeReportsQueryParam: (
    field: string,
    value: string | string[] | number | number[] | null
  ) => void;
};

const ToggleButtons: React.FC<ToggleButtonsProps> = ({
  onChangeReportsQueryParam,
}) => {
  const { data: statusList = [], isPending } = useQueryGetReportStatuses({ isUser: false });
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);

  useEffect(() => {
    onChangeReportsQueryParam("reportStatusId", selectedStatusId);
  }, [selectedStatusId, onChangeReportsQueryParam]);

  if (isPending) return <div>Loading...</div>;

  const handleButtonClick = (buttonId: number) => {
    if (selectedStatusId === buttonId) {
      setSelectedStatusId(null); // Deselect if clicking the same button
    } else {
      setSelectedStatusId(buttonId);
    }
  };

  return (
    <div className="grow">
      {statusList.map((button) => (
        <Button
          key={button.id}
          variant="contained"
          onClick={() => handleButtonClick(button.id)}
          sx={{
            height: "5dvh",
            paddingInline: "2%",
            marginRight: "1%",
            fontFamily: "kanit",
            fontSize: "2.3vmin",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "55px",
            backgroundColor:
              selectedStatusId === null
                ? StatusMappingENGToColor[button.status]
                : selectedStatusId === button.id
                  ? StatusMappingENGToColor[button.status]
                  : "#E0E0E0",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor:
                selectedStatusId === null
                  ? StatusMappingENGToColor[button.status]
                  : selectedStatusId === button.id
                    ? StatusMappingENGToColor[button.status]
                    : "#E0E0E0",
            },
          }}
        >
          {StatusMappingToTH[button.status] === "กำลังดำเนินการ" || StatusMappingToTH[button.status] === "รอดำเนินการ"
            ? "รอดำเนินการ"
            : StatusMappingToTH[button.status]}
        </Button>
      ))}
    </div>
  );
};

export default ToggleButtons;
