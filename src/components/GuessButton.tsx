import Button from '@mui/material/Button';
import './Buttons.css';

interface guessProps {
    actualWord: string
    guessedWord: string
    hints: string[]
    guesses: string[]
    setHints: Function
    setGuesses: Function
    setOpen: Function
    setHeading: Function
    setMessage: Function
    clearInput: Function
    resetGame: Function
}

function updateHints(word: string, currentHints: string[], setHints: Function){
    if (currentHints.length === 0){ // give word length hint
        setHints([`This word has ${word.length} letters`]);
    }
    else if (currentHints.length === 1) { // give first letter hint
        setHints([...currentHints, `The first letter is '${word[0]}'`]);
    }
    else if (currentHints.length === 2) { // give last letter hint
        setHints([...currentHints, `The last letter is '${word[word.length-1]}'`]);
    }
}

function handleGuess(guessedWord: string, actualWord: string, hints: string[], guesses: string[], setHints: Function, setGuesses: Function, setOpen: Function, setHeading: Function, setMessage: Function, clearInput: Function, resetGame: Function){
    clearInput(guesses.length + 1);
    if (guessedWord === ""){
        setOpen(true);
        setHeading("Guess cannot be blank!");
        setMessage("");
        return;
    }
    if (!guesses.includes(guessedWord))
        setGuesses([...guesses, guessedWord]);
    else{
        setOpen(true);
        setHeading("Already guessed");
        setMessage(`The word: '${guessedWord}' has already been guessed`);
        return;
    }
    if (guessedWord.toLowerCase() !== actualWord.toLowerCase()){
        updateHints(actualWord, hints, setHints);
    }
    else{ // correct guess
        setOpen(true);
        setHeading("Congratulations");
        setMessage(`The word was ${actualWord}.`);
        resetGame();
    }
}

export default function GuessButton({guessedWord, actualWord, hints, guesses, setHints, setGuesses, setOpen, setHeading, setMessage, clearInput, resetGame}: guessProps){
    return (
        <Button variant="outlined" onClick={() => {handleGuess(guessedWord, actualWord, hints, guesses, setHints, setGuesses, setOpen, setHeading, setMessage, clearInput, resetGame)}}>
            guess
        </Button>
    )
}