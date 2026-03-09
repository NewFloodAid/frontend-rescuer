import { ReportAssistance } from "@/types/report_assistance";

interface ReportCheckboxProps {
  reportAssistance: ReportAssistance;
}

const ReportCheckbox: React.FC<ReportCheckboxProps> = ({ reportAssistance }) => {
  const extraDetail = reportAssistance.extraDetail?.trim();
  const extraFieldLabel = reportAssistance.assistanceType.extraFieldLabel?.trim();

  return (
    <div className="mb-[2%]">
      <div className="font-semibold">{reportAssistance.assistanceType.name}</div>
      {extraDetail && (
        <div className="mt-[0.5%] break-words pl-[4%] text-[13px] font-normal text-[#555555] md:text-[1.6vmin]">
          {(extraFieldLabel || "รายละเอียดเพิ่มเติม") + ": "}
          {extraDetail}
        </div>
      )}
    </div>
  );
};

export default ReportCheckbox;
