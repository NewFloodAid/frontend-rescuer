import { Paper, Stack } from "@mui/material";
import Place from "@mui/icons-material/Place";
import { Report } from "@/types/report";
import { StatusMappingToTH, StatusMappingENGToColor } from "@/constants/report_status";

interface Params {
  pColor: string;
  pName: string;
  cardText: number;
  outerBgColor: string;
  cardTextColor: string;
}

function Priority({
  pColor,
  pName,
  cardText,
  outerBgColor,
  cardTextColor,
}: Params) {
  const styles = {
    outerPaper: {
      height: "4.5dvh",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "4%",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      backgroundColor: outerBgColor,
      borderRadius: "10px",
    },
    innerPaper: {
      height: "4dvh",
      width: "5dvh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2vmin",
      fontWeight: "600",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      color: cardTextColor,
      borderRadius: "10px",
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
  };

  return (
    <Paper elevation={8} sx={styles.outerPaper}>
      <div style={styles.leftSection}>
        <Place sx={{ color: pColor, fontSize: "2.5vmin" }} />
        <span
          className="font-semibold text-[2vmin]"
          style={{ color: pColor }}
        >
          {pName}
        </span>
      </div>
      <Paper elevation={8} sx={styles.innerPaper}>
        {cardText}
      </Paper>
    </Paper>
  );
}

const StatusList = ({ reports }: { reports: Report[] }) => {
  const statusCounts = reports.reduce(
    (acc: { [key: string]: number }, report) => {
      const status = report.reportStatus.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, PROCESS: 0, SENT: 0, SUCCESS: 0 }
  );

  const getStatusProps = (status: string) => ({
    pColor: StatusMappingENGToColor[status],
    pName: StatusMappingToTH[status],
    cardText: statusCounts[status],
    outerBgColor: "#FFFFFF",
    cardTextColor: StatusMappingENGToColor[status],
  });

  return (
    <div className="font-kanit flex justify-center w-full">
      <Stack direction="column" sx={{ width: "15dvw" }} spacing={1}>
        <Priority
          pColor="#ffffffff"
          pName="ทั้งหมด"
          cardText={
            statusCounts["PENDING"] +
            statusCounts["PROCESS"] +
            statusCounts["SENT"] +
            statusCounts["SUCCESS"]
          }
          outerBgColor="#929292ff"
          cardTextColor="#000000ff"
        />
        <Priority {...getStatusProps("PENDING")} />
        <Priority {...getStatusProps("PROCESS")} />
        <Priority {...getStatusProps("SENT")} />
        <Priority {...getStatusProps("SUCCESS")} />
      </Stack>
    </div>
  );
};

export default StatusList;
