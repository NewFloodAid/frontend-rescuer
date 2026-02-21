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
  return (
    <div className="font-semibold flex items-center mb-[2%]">
      {reportAssistance.assistanceType.name}: {reportAssistance.quantity}{" "}
      {reportAssistance.assistanceType.unit}
    </div>
  );
};

export default ReportCheckbox;
