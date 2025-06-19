import Button from '@mui/material/Button';
import './Buttons.css';

interface giveupProps {
    word: string
    setWinScreen: Function
    setWinScreenText: Function
}

export default function GiveupButton({word, setWinScreen, setWinScreenText}: giveupProps){
    return (
        <Button 
            variant="outlined" onClick={() => {
                setWinScreenText(`The word was ${word}. Try again tomorrow!`);
                setWinScreen(true);
                localStorage.setItem("word", word);
                }
            }>
            give up?
        </Button>
    )
}