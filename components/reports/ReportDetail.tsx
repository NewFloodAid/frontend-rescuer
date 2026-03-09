import { ReportAssistance } from "@/types/report_assistance";
import ReportCheckbox from "./ReportCheckbox";
import { StatusMappingENGToColor, StatusMappingToTH } from "@/constants/report_status";
import { Report } from "@/types/report";

interface ReportDetailProps {
  report: Report;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report }) => {
  const selectedAssistances = report.reportAssistances.filter(
    (assistance) => assistance.quantity > 0,
  );

  return (
    <div className="h-auto w-full aspect-square overflow-y-auto rounded-[10px] border border-black/50 shadow-inner">
      <div
        className="mt-[4%] mb-[2%] flex justify-center text-[15px] font-bold md:text-[2.5vmin] md:font-normal"
        style={{
          color: StatusMappingENGToColor[report?.reportStatus?.status],
        }}
      >
        {StatusMappingToTH[report?.reportStatus?.status]}
      </div>

      <div className="px-[5%] text-[14px] md:text-[1.75vmin]">
        {selectedAssistances.map((assistance: ReportAssistance) => (
          <div key={`detail-${assistance.id}-${assistance.assistanceType.id}`}>
            <ReportCheckbox reportAssistance={assistance} />
          </div>
        ))}

        <div className="mt-[2%] mb-[2%] text-[14px] md:text-[1.75vmin]">
          <div className="px-[3%] font-semibold">สถานที่เกิดเหตุ:</div>
          <div className="mt-[1%] w-full break-words px-[5%] font-normal">{report.location.address}</div>
        </div>

        <div className="mt-[2%] mb-[4%] text-[14px] md:text-[1.75vmin]">
          <div className="px-[3%] font-semibold">รายละเอียดเพิ่มเติม:</div>
          <div className="mt-[1%] w-full break-words px-[5%] font-normal">
            {report.additionalDetail || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
