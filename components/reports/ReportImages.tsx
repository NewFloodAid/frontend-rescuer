import { useState } from "react";
import { Report } from "@/types/report";
import { Card, Modal, Box, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Image from "next/image";

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
              <div
                key={index}
                className="relative flex items-center justify-center bg-white border border-black/50 rounded-[10px] overflow-hidden"
                style={{ width: "49%", height: "49%", aspectRatio: "1 / 1" }}
              >
                <Image
                  src={image.url || "/images/bg.png"}
                  alt={`Report image ${index + 1}`}
                  onClick={() => handleImageClick(image.url || "/images/bg.png")}
                  fill
                  className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
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
            <div className="relative w-[90vw] h-[90vh] max-w-[1200px] max-h-[800px]">
              <Image
                src={selectedImage}
                alt="Full size preview"
                fill
                className="object-contain rounded-[8px]"
                sizes="100vw"
                quality={100}
              />
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ReportImages;
