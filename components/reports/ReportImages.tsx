import { Report } from "@/types/report";
import { Card, CardMedia } from "@mui/material";

interface ReportImagesProps {
  report: Report;
}

const ReportImages: React.FC<ReportImagesProps> = ({ report }) => {
  const hasImages = report.images && report.images.length > 0;
  const imagesToShow = report.images || [];
  const placeholders = 4 - imagesToShow.length;

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "auto",
        aspectRatio: "1 / 1",
        border: hasImages ? "none" : "1px solid rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        display: "flex",
        alignItems: hasImages ? "flex-start" : "center",
        justifyContent: hasImages ? "flex-start" : "center",
      }}
    >
      {hasImages ? (
        <div className="flex flex-wrap gap-[2%] w-full h-full p-[2%]">
          {imagesToShow.map((image, index) => (
            <CardMedia
              key={index}
              component="img"
              image={image.url || "/images/bg.png"}
              alt={`Report image ${index + 1}`}
              sx={{
                width: "49%",
                height: "49%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                border: "1px solid rgba(0, 0, 0, 0.5)",
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          ))}
          {[...Array(placeholders)].map((_, index) => (
            <div
              key={`placeholder-${index}`}
              style={{
                width: "49%",
                height: "49%",
                aspectRatio: "1 / 1",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                backgroundColor: "#F0F0F0",
              }}
            />
          ))}
        </div>
      ) : (
        <span>ไม่มีรูปภาพ</span>
      )}
    </Card>
  );
};

export default ReportImages;
