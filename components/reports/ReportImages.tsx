import { useState } from "react";
import { Report } from "@/types/report";
import { Card, CardMedia, Modal, Box, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface ReportImagesProps {
  report: Report;
}

const ReportImages: React.FC<ReportImagesProps> = ({ report }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const hasImages = report.images && report.images.length > 0;
  const imagesToShow = report.images || [];
  const placeholders = 4 - imagesToShow.length;

  return (
    <>
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
                onClick={() => handleImageClick(image.url || "/images/bg.png")}
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
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
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

      <Modal
        open={!!selectedImage}
        onClose={handleClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              color: "white",
            }}
          >
            <CancelIcon sx={{ fontSize: 40 }} />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size preview"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ReportImages;
