import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useGame } from '../shared/GameContext';

export default function WordToast() {
  const { toastHeading, toastMessage, toastVisible, setToastVisible } = useGame();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastVisible(false);
  };

  return (
    <Snackbar
      open={toastVisible}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity="error" 
        sx={{ 
          width: '100%',
          backgroundColor: '#c1c17d',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          fontFamily: '"Source Serif 4", serif',
          '& .MuiAlert-icon': {
            color: 'white',
            alignSelf: 'center'
          },
          '& .MuiIconButton-root': {
            color: 'white',
            alignSelf: 'center'
          },
          '& .MuiAlert-message': {
            marginTop: '8px'
          }
        }}
        variant="filled"
      >
        {toastHeading && <AlertTitle sx={{ fontFamily: '"Source Serif 4", serif', color: 'white' }}>{toastHeading}</AlertTitle>}
        {toastMessage}
      </Alert>
    </Snackbar>
  );
}