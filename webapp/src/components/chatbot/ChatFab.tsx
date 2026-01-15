import { useState } from "react";
import { Fab } from "@mui/material";
import { fabStyles } from "./ChatFab.styles";
import { ChatDialog } from "./ChatDialog";

export const ChatFab = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="open chat"
        sx={fabStyles}
        onClick={handleClick}
      >
        <img
          src="/robot-assistant.png"
          alt="Chatbot"
          style={{ width: 32, height: 32 }}
        />
      </Fab>
      <ChatDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};
