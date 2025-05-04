import Button from '@mui/material/Button';
import './Buttons.css';

interface giveupProps {
    actualWord: string
    resetGame: Function
    setOpen: Function // for actual word modal
    setHeading: Function
    setMessage: Function
}

export default function GiveupButton({actualWord, resetGame, setOpen, setMessage, setHeading}: giveupProps){
    return (
        <Button 
            variant="outlined" onClick={() => {
                resetGame(); 
                setOpen(true);
                setHeading("The word is...");
                setMessage(`${actualWord}`);
                }
            }>
            give up?
        </Button>
    )
}