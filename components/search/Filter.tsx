import { useState } from "react";
import { useQueryGetReportStatuses } from "@/api/reportStatus";
import { StatusMappingToTH } from "@/constants/report_status";
import { useQueryGetSubdistrictFromProvince } from "@/api/subdistrict";
import InputDropdown from "../InputDropdown";
import Dropdown from "../Dropdown";
import ToggleButtons from "../buttons/ToggleButtons";
import Loader from "../Loader";

type FilterPartProps = {
  onChangeReportsQueryParam: (
    field: string,
    value: string | number | number[] | null
  ) => void;
};

const FilterPart: React.FC<FilterPartProps> = ({
  onChangeReportsQueryParam,
}) => {
  const reportStatusQuery = useQueryGetReportStatuses({ isUser: false });
  const subdistrictsQuery = useQueryGetSubdistrictFromProvince("เชียงใหม่");

  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleSubDistrictChange = (
    event: unknown,
    subdistrict: string | null
  ) => {
    setSelectedSubDistrict(subdistrict || "");
    onChangeReportsQueryParam("subdistrict", subdistrict);
  };

  const handleStatusChange = (event: unknown, status: string | null) => {
    setSelectedStatus(status || "");
    const selectedStatusId = reportStatusQuery.data?.find(
      (reportStatus) => StatusMappingToTH[reportStatus.status] === status
    )?.id;
    onChangeReportsQueryParam("reportStatusId", selectedStatusId || null);
  };

  if(reportStatusQuery.isPending || subdistrictsQuery.isPending ) {
    return <Loader />;
  }
  
  return (
    <>
      <div className="text-[2.5vmin] text-[#505050]">FILTER</div>
      <InputDropdown
        placeholder="ตำบล"
        value={selectedSubDistrict}
        onChange={handleSubDistrictChange}
        options={Array.from(
          new Set(
            subdistrictsQuery.data?.map(
              (subdistrict) => subdistrict.nameInThai
            ) || []
          )
        )}
      />
      <Dropdown
        placeholder="สถานะ"
        value={selectedStatus}
        onChange={handleStatusChange}
        options={
          reportStatusQuery.data?.map(
            (status) => StatusMappingToTH[status.status]
          ) || []
        }
      />
      <ToggleButtons onChangeReportsQueryParam={onChangeReportsQueryParam} />
    </>
  );
};

export default FilterPart;
