import { Toaster as HotToaster } from "react-hot-toast";

import { useTheme } from "@emotion/react";
import { alpha } from "@mui/system";

export const Toaster = () => {
  const theme = useTheme();

  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          backdropFilter: "blur(6px)",
          background: alpha(theme.palette.primary.main, 0.8),
          color: theme.palette.common.white,
          boxShadow: theme.shadows[16],
        },
      }}
    />
  );
};
