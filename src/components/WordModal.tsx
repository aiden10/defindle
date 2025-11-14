import './WordModal.css';
import './Buttons.css';
import './WordInput.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useGame } from '../shared/GameContext';
import { useState } from 'react';
import WordInput from './WordInput';

export default function WordModal() {
  const { modalOpen, setModalOpen, setToastHeading, setToastMessage, setToastVisible, handleCustomWord } = useGame();
  const [customWord, setCustomWord] = useState<string>("");
  const [finalWord, setFinalWord] = useState<string>("");
  const [customURL, setCustomURL] = useState<string>("");

  const handleCopyURL = () => {
    navigator.clipboard.writeText(customURL);
    setToastHeading("URL Copied");
    setToastMessage(`${customURL} copied to clipboard`);
    setToastVisible(true);
  };
  
  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="wordModal">
          <Typography 
            id="modal-modal-title" 
            variant="h2" 
            component="h4"
          >
            Custom Game
          </Typography>

          <Typography 
            id="modal-modal-description"
          >
            Enter the word you'd like to create a game for:
          </Typography>

          <WordInput 
            customValue={customWord}
            onCustomChange={setCustomWord}
            label="word"
            customGames={true}
          />
          <Button 
            variant="outlined"
            fullWidth
            onClick={() => {
              const url = handleCustomWord(customWord);
              if (url !== "") {
                setCustomURL(url);
                setFinalWord(customWord);
              } else {
                setToastHeading("Invalid word");
                setToastMessage(`'${customWord}' is not a valid word`);
                setToastVisible(true);
              }
            }}
          > 
            submit
          </Button>
          {finalWord && (
            <>
              <Typography 
                variant="h6" 
                sx={{ mb: 2, mt: 3, fontFamily: 'inherit', fontWeight: 600 }}
              >
                link to game for: {finalWord}
              </Typography>

              {customURL && (
                <>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={customURL}
                    slotProps={{ input: { readOnly: true } }}
                    sx={{
                      mb: 2
                    }}
                  />
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={handleCopyURL}
                  >
                    Copy URL
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}