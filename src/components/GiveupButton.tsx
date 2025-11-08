import Button from '@mui/material/Button';
import './Buttons.css';
import { END_CAUSES } from '../shared/types';
import { useGame } from '../shared/GameContext';

export default function GiveupButton(){
    const { word, setWinScreenVisible, setWinScreenText, setEndCause } = useGame();
    
    return (
        <Button 
            variant="outlined" onClick={() => {
                setWinScreenText(`The word was ${word}. Try again tomorrow!`);
                setEndCause(END_CAUSES.GIVE_UP);
                setWinScreenVisible(true);
                localStorage.setItem("word", word);
                }
            }>
            give up?
        </Button>
    )
}