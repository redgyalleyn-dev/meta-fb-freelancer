import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Icon, IconButton } from "@mui/material";

const ConfirmationDialog = ({ open, setOpen, handleConfirm, item }: any) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth={"xs"}>
      <DialogTitle style={{ textAlign: "left" }}>
        Xác nhận
        <IconButton
          style={{ position: "absolute", top: 10, right: 10 }}
          onClick={() => setOpen(false)}
        >
          <Icon color="error">x</Icon>
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
        Bạn có chắc chắn xóa?
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", alignItems: "center" }}>
        <Button onClick={() => setOpen(false)} color="error" id="cancel-btn">
          Hủy
        </Button>
        <Button
          onClick={() => handleConfirm(item.id)}
          color="primary"
          autoFocus
          id="confirm-btn"
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
