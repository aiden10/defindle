import Button from '@mui/material/Button';
import './Buttons.css';
import { END_CAUSES } from '../shared/types';
import { useGame } from '../shared/GameContext';

export default function GiveupButton(){
    const { definition, setWinScreenVisible, setWinScreenText, setEndCause } = useGame();
    
    return (
        <Button 
            variant="outlined" onClick={() => {
                setWinScreenText(`The word was ${definition[0]}. Try again tomorrow!`);
                setEndCause(END_CAUSES.GIVE_UP);
                setWinScreenVisible(true);
                localStorage.setItem("word", definition[0]);
                }
            }>
            give up?
        </Button>
    )
}