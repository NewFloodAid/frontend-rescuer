"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import NavBar from "@/components/Navbar";
import { useQueryGetReports } from "@/api/report";
import MainMap from "@/components/map/MainMap";
import { GetReportsQueryParams } from "@/types/report";
import { isAuthenticated } from "@/api/login";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import FilterPart from "@/components/search/Filter";
import StatusList from "@/components/search/PriorityList";

export default function Map() {
  const [queryParams, setQueryParams] = useState<GetReportsQueryParams>({});
  const queryReports = useQueryGetReports(queryParams);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  const reports = useMemo(() => queryReports.data || [], [queryReports.data]);

  const filteredReports = useMemo(() => {
    const [firstName = "", lastName = ""] = searchInput.toLowerCase().split(" ");
    return reports.filter(
      (report) =>
        report.firstName.toLowerCase().includes(firstName) &&
        report.lastName.toLowerCase().includes(lastName)
    );
  }, [searchInput, reports]);

  useEffect(() => {
    queryReports.refetch();
  }, [queryParams]);

  const onChangeReportsQueryParam = useCallback(
    (field: string, value: string | number | string[] | number[] | null) => {
      setQueryParams((prevParams) => ({ ...prevParams, [field]: value }));
    },
    []
  );

  if (queryReports.isPending) {
    return <Loader />;
  }

  return (
    <>
      <NavBar />
      <div className="mt-[0.75%] px-[3%]">
        <div className="flex flex-row mb-[1%] items-center font-kanit gap-[2%]">
          <FilterPart onChangeReportsQueryParam={onChangeReportsQueryParam} />
        </div>
        <div className="flex flex-row items-start">
          <div className="w-3/4">
            <MainMap reports={filteredReports} />
          </div>
          <div className="flex justify-center w-1/4">
            <StatusList reports={filteredReports} />
          </div>
        </div>
      </div>
    </>
  );
}
