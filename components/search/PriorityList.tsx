import { Paper, Stack } from "@mui/material";
import Place from "@mui/icons-material/Place";
import { Report } from "@/types/report";
import { PriorityMappingToName } from "@/constants/priority";

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
      height: "5dvh",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: "3%",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      backgroundColor: outerBgColor,
    },
    innerPaper: {
      height: "5dvh",
      width: "7dvh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2.3vmin",
      fontWeight: "600",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      color: cardTextColor,
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
        <Place sx={{ color: pColor, fontSize: "3vmin" }} />
        <span
          className="font-semibold text-[2.3vmin]"
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

interface PriorityListProps {
  reports: Report[];
}

const PriorityList = ({ reports }: PriorityListProps) => {
  const priorityCounts = reports.reduce(
    (acc: { [key: string]: number }, report) => {
      const priorityName = PriorityMappingToName[report.priority];
      acc[priorityName] = (acc[priorityName] || 0) + 1;
      return acc;
    },
    { ฉุกเฉิน: 0, เร่งด่วน: 0, ไม่เร่งด่วน: 0, เสร็จสิ้น: 0 }
  );

  return (
    <div className="font-kanit">
      <Stack direction="column" sx={{ width: "18dvw" }} spacing={2}>
        <Priority
          pColor="#FFFFFF"
          pName="ทั้งหมด"
          cardText={
            priorityCounts["ฉุกเฉิน"] +
            priorityCounts["เร่งด่วน"] +
            priorityCounts["ไม่เร่งด่วน"] +
            priorityCounts["เสร็จสิ้น"] 
          }
          outerBgColor="#505050"
          cardTextColor="#000000"
        />
        <Priority
          pColor="#FF0000"
          pName="ฉุกเฉิน"
          cardText={priorityCounts["ฉุกเฉิน"]}
          outerBgColor="#FFFFFF"
          cardTextColor="#FF0000"
        />
        <Priority
          pColor="#FFAE00"
          pName="เร่งด่วน"
          cardText={priorityCounts["เร่งด่วน"]}
          outerBgColor="#FFFFFF"
          cardTextColor="#FFAE00"
        />
        <Priority
          pColor="#0077FF"
          pName="ไม่เร่งด่วน"
          cardText={priorityCounts["ไม่เร่งด่วน"]}
          outerBgColor="#FFFFFF"
          cardTextColor="#0077FF"
        />
        <Priority
          pColor="#00FF00"
          pName="เสร็จสิ้น"
          cardText={priorityCounts["เสร็จสิ้น"]}
          outerBgColor="#FFFFFF"
          cardTextColor="#00FF00"
        />
      </Stack>
    </div>
  );
};

export default PriorityList;
