import { useState } from "react";
import { useQueryGetAssistanceTypes } from "@/api/assistanceType";
import { useQueryGetSubdistrictFromProvince } from "@/api/subdistrict";

import Dropdown from "../Dropdown";
import ToggleButtons from "../buttons/ToggleButtons";
import Loader from "../Loader";

type FilterPartProps = {
  onChangeReportsQueryParam: (
    field: string,
    value: string | number | string[] | number[] | null
  ) => void;
};

const FilterPart: React.FC<FilterPartProps> = ({
  onChangeReportsQueryParam,
}) => {
  const assistanceTypesQuery = useQueryGetAssistanceTypes();
  const subdistrictsQuery = useQueryGetSubdistrictFromProvince("เชียงใหม่");


  const [selectedAssistanceType, setSelectedAssistanceType] = useState<string>("");



  const handleAssistanceTypeChange = (event: unknown, type: string | null) => {
    setSelectedAssistanceType(type || "");
    const selectedTypeId = assistanceTypesQuery.data?.find(
      (assistanceType) => assistanceType.name === type
    )?.id;
    onChangeReportsQueryParam("assistanceTypeId", selectedTypeId || null);
  };

  if (assistanceTypesQuery.isPending || subdistrictsQuery.isPending) {
    return <Loader />;
  }

  return (
    <>
      <div className="text-[2.5vmin] text-[#505050]">กรองข้อมูล</div>
      <Dropdown
        placeholder="ประเภท"
        value={selectedAssistanceType}
        onChange={handleAssistanceTypeChange}
        options={
          assistanceTypesQuery.data?.map(
            (type) => type.name
          ) || []
        }
      />
      <ToggleButtons onChangeReportsQueryParam={onChangeReportsQueryParam} />
    </>
  );
};

export default FilterPart;
