import React from "react";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";

const ChatOptionsPopover = ({
  anchorEl,
  open,
  onClose,
  onRename,
  onDelete,
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      anchorPosition={{ top: 200, left: 260 }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          bgcolor: "#1f1f1f",
          color: "#fff",
          width: 120,
          height: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
    >
      <MenuItem
        onClick={() => {
          onRename();
          onClose();
        }}
        sx={{
          color: "#fff",
          padding: "0 8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <LuPencil />
        Rename
      </MenuItem>
      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
        sx={{
          color: "red",
          padding: "0 8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <FaRegTrashAlt />
        Delete
      </MenuItem>
    </Popover>
  );
};

export default ChatOptionsPopover;
