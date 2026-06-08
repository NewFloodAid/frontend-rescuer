import { useEffect, useState } from "react";
import { useQueryGetAssistanceTypes } from "@/api/assistanceType";
import { useQueryGetSubdistrictFromProvince } from "@/api/subdistrict";
import { useQueryGetDistricts } from "@/api/district";
import { isSuperAdmin } from "@/api/login";

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
  const districtsQuery = useQueryGetDistricts("เชียงใหม่");

  const [selectedAssistanceType, setSelectedAssistanceType] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [isSuper, setIsSuper] = useState(false);

  useEffect(() => {
    setIsSuper(isSuperAdmin());
  }, []);

  const handleAssistanceTypeChange = (event: unknown, type: string | null) => {
    setSelectedAssistanceType(type || "");
    const selectedTypeId = assistanceTypesQuery.data?.find(
      (assistanceType) => assistanceType.name === type
    )?.id;
    onChangeReportsQueryParam("assistanceTypeId", selectedTypeId || null);
  };

  const handleDistrictChange = (event: unknown, districtName: string | null) => {
    setSelectedDistrict(districtName || "");
    const selectedDistrictId = districtsQuery.data?.find(
      (d) => d.nameInThai === districtName
    )?.id;
    onChangeReportsQueryParam("districtId", selectedDistrictId || null);
  };

  if (assistanceTypesQuery.isPending || subdistrictsQuery.isPending || districtsQuery.isPending) {
    return <div className="flex justify-center items-center h-[5dvh] px-4"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ff3388]"></div></div>;
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
      {isSuper && (
        <Dropdown
          placeholder="เขต"
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={
            districtsQuery.data?.map(
              (d) => d.nameInThai
            ) || []
          }
        />
      )}
      <ToggleButtons onChangeReportsQueryParam={onChangeReportsQueryParam} />
    </>
  );
};

export default FilterPart;
