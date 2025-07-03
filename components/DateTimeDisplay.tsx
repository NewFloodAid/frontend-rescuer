import React from "react";

type DateTimeDisplayProps = {
  dateTime: string; // Expecting the date in string format
};

export const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  dateTime,
}) => {
  const date = new Date(dateTime); // Convert string to Date object

  // Format Date: DD/MM/YY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  // Format Time: HH:mm น.
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return (
    <div className="flex flex-row justify-between items-center gap-[1dvw]">
      <div>{`${day}/${month}/${year}`}</div>
      <div>{`${hours}:${minutes} น.`}</div>
    </div>
  );
};

export const DateDisplay: React.FC<DateTimeDisplayProps> = ({ dateTime }) => {
  const date = new Date(dateTime); // Convert string to Date object

  // Format Date: DD/MM/YY
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return <>{`${day}/${month}/${year}`}</>;
};

export const TimeDisplay: React.FC<DateTimeDisplayProps> = ({ dateTime }) => {
  const date = new Date(dateTime); // Convert string to Date object

  // Format Time: HH:mm น.
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return <>{`${hours}:${minutes} น.`}</>;
};
