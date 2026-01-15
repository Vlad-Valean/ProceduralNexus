import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fabStyles } from "./ChatFab.styles";

export const ChatFab = () => {
  const handleClick = () => {
    // later: open chatbot dialog
    console.log("Chat FAB clicked");
  };

  return (
    <Fab
      color="primary"
      aria-label="open chat"
      sx={fabStyles}
      onClick={handleClick}
    >
      <AddIcon />
    </Fab>
  );
};
