import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './WordModal.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgb(244, 244, 235)',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface WordProps{
    heading: string
    message: string
    open: boolean
    setOpen: Function
}

export default function WordModal({heading, message, open, setOpen}: WordProps) {

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box 
          sx={style} 
          className="wordModal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {heading}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}