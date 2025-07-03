"use client";

import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <CircularProgress size="7vmin" sx={{ color: "#ff3388" }} />
    </div>
  );
}

export default Loader;
