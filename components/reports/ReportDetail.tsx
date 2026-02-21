import { useState } from "react";
import { ReportAssistance } from "@/types/report_assistance";
import ReportCheckbox from "./ReportCheckbox";
import {
  StatusMappingENGToColor,
  StatusMappingToTH,
} from "@/constants/report_status";
import { Report } from "@/types/report";

interface ReportDetailProps {
  report: Report;
  setReport: React.Dispatch<React.SetStateAction<Report>>;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, setReport }) => {
  const [assistances, setAssistances] = useState(report.reportAssistances);

  const handleCheckboxChange = (id: number, isActive: boolean) => {
    const updatedAssistances = assistances.map((assistance) =>
      assistance.assistanceType.id === id
        ? { ...assistance, isActive }
        : assistance
    );

    setAssistances(updatedAssistances);

    setReport((prevReport: Report) => ({
      ...prevReport,
      reportAssistances: updatedAssistances,
    }));
  };

  return (
    <div className="w-full h-auto aspect-square border border-black/50  rounded-[10px] shadow-inner overflow-y-auto">
      <div
        className="flex justify-center text-[2.5vmin] mt-[4%] mb-[2%]"
        style={{
          color: StatusMappingENGToColor[report?.reportStatus?.status],
        }}
      >
        {StatusMappingToTH[report?.reportStatus?.status]}
      </div>
      <div className="px-[5%] text-[1.75vmin]">
        {assistances.map((assistance: ReportAssistance) =>
          assistance.quantity > 0 ? (
            <ReportCheckbox
              key={assistance.assistanceType.id}
              reportStatus={report.reportStatus.status}
              reportAssistance={assistance}
              onCheckboxChange={handleCheckboxChange}
            />
          ) : null
        )}
        <div className="mt-[2%] mb-[2%] text-[1.75vmin]">
          <div className="px-[3%] font-semibold">สถานที่เกิดเหตุ:</div>
          <div className="w-full px-[5%] font-normal break-words mt-[1%]">
            {report.location.address}
          </div>
        </div>
        <div className="mt-[2%] mb-[4%] text-[1.75vmin]">
          <div className="px-[3%] font-semibold">รายละเอียดเพิ่มเติม:</div>
          <div className="w-full px-[5%] font-normal break-words mt-[1%]">
            {report.additionalDetail || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
