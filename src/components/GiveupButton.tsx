import Button from '@mui/material/Button';
import './Buttons.css';
import { END_CAUSES } from '../shared/types';

interface giveupProps {
    word: string
    setWinScreen: Function
    setWinScreenText: Function
    setEndCause: Function
}

export default function GiveupButton({word, setWinScreen, setWinScreenText, setEndCause}: giveupProps){
    return (
        <Button 
            variant="outlined" onClick={() => {
                setWinScreenText(`The word was ${word}. Try again tomorrow!`);
                setEndCause(END_CAUSES.GIVE_UP);
                setWinScreen(true);
                localStorage.setItem("word", word);
                }
            }>
            give up?
        </Button>
    )
}