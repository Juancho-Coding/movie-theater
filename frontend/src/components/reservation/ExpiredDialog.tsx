import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const ExpiredDialog = ({ open, onClose }: props) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You took too long to complete the reservation, please try again
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface props {
  onClose: () => void;
  open: boolean;
}

export default ExpiredDialog;
