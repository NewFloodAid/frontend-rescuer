import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

type ToggleButtonsProps = {
  onChangeReportsQueryParam: (
    field: string,
    value: string | number | number[] | null
  ) => void;
};

const buttons = [
  { id: 1, label: "ไม่เร่งด่วน", color: "#0077FF", priority: 3 },
  { id: 2, label: "เร่งด่วน", color: "#FFAE00", priority: 2 },
  { id: 3, label: "ฉุกเฉิน", color: "#FF0000", priority: 1 },
];

const ToggleButtons: React.FC<ToggleButtonsProps> = ({
  onChangeReportsQueryParam,
}) => {
  const [selectedButtons, setSelectedButtons] = useState<number[]>([
    1, 2, 3,
  ]);

  const handleButtonClick = (buttonId: number) => {
    setSelectedButtons((prevSelected) => {
      const newSelected = prevSelected.includes(buttonId)
        ? prevSelected.filter((id) => id !== buttonId)
        : [...prevSelected, buttonId];
      return newSelected;
    });
  };

  useEffect(() => {
    const selectedPriorities = selectedButtons
      .map((id) => buttons.find((button) => button.id === id)?.priority)
      .filter((priority): priority is number => priority !== undefined);
    onChangeReportsQueryParam(
      "priorities",
      selectedPriorities.length !== 0 ? selectedPriorities : []
    );
  }, [selectedButtons, onChangeReportsQueryParam]);

  return (
    <div className="grow">
      {buttons.map((button) => (
        <Button
          key={button.id}
          variant="contained"
          onClick={() => handleButtonClick(button.id)}
          sx={{
            height: "4.5dvh",
            paddingInline: "3%",
            marginRight: "2%",
            fontFamily: "kanit",
            fontSize: "2vmin",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "30px",
            backgroundColor: selectedButtons.includes(button.id)
              ? button.color
              : "#E0E0E0",
            color: selectedButtons.includes(button.id) ? "#FFFFFF" : "#000000",
            "&:hover": {
              backgroundColor: selectedButtons.includes(button.id)
                ? button.color
                : "#E0E0E0",
            },
          }}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default ToggleButtons;
