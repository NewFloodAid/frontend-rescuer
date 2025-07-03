import Checkbox from "@mui/material/Checkbox";
import { ReportAssistance } from "@/types/report_assistance";

interface ReportCheckboxProps {
  reportStatus: string;
  reportAssistance: ReportAssistance;
  onCheckboxChange: (id: number, isActive: boolean) => void;
}

const ReportCheckbox: React.FC<ReportCheckboxProps> = ({
  reportStatus,
  reportAssistance,
  onCheckboxChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked;
    onCheckboxChange(reportAssistance.assistanceType.id, !newCheckedState);
  };

  return (
    <div className="font-semibold flex items-center">
      <Checkbox
        disabled={!(reportStatus === "PROCESS")}
        checked={!reportAssistance.isActive}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
      {reportAssistance.assistanceType.name}: {reportAssistance.quantity}{" "}
      {reportAssistance.assistanceType.unit}
    </div>
  );
};

export default ReportCheckbox;
