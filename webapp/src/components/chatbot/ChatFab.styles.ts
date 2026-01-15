import type { SxProps, Theme } from "@mui/material";

export const fabStyles: SxProps<Theme> = {
  position: "fixed",
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  zIndex: 1300,
  boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
  backgroundColor: "#67728A",
  "&:hover": {
    backgroundColor: "#56607a",
  },
  "&:focus": {
    outline: "none",
    boxShadow: "none",
  },
  "&.Mui-focusVisible": {
    outline: "none",
    boxShadow: "none",
  },
};
