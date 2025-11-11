import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useGame } from '../shared/GameContext';
import { useEffect, useState } from 'react';

export default function WordToast() {
  const { toastHeading, toastMessage, toastVisible, setToastVisible } = useGame();
  const [progress, setProgress] = useState(100);
  const duration = 2000;

  useEffect(() => {
    if (toastVisible) {
      setProgress(100);
      let start = Date.now();
      let frame: number;
      const tick = () => {
        const elapsed = Date.now() - start;
        const percent = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(percent);
        if (percent > 0) {
          frame = requestAnimationFrame(tick);
        }
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }
  }, [toastVisible]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastVisible(false);
  };

  return (
    <Snackbar
      open={toastVisible}
      autoHideDuration={duration}
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
          position: 'relative',
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
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '4px',
            width: `${progress}%`,
            background: 'rgba(0,0,0,0.3)',
            transition: 'width 50ms linear'
          }}
        />
      </Alert>
    </Snackbar>
  );
}