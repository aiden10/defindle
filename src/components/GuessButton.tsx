import Button from '@mui/material/Button';
import './Buttons.css';
import { useEffect } from 'react';

interface guessProps {
    actualWord: string
    guessedWord: string
    setScore: Function
    score: number
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

function handleGuess(guessedWord: string, actualWord: string, setScore: Function, score: number, hints: string[], guesses: string[], setHints: Function, setGuesses: Function, setOpen: Function, setHeading: Function, setMessage: Function, clearInput: Function, resetGame: Function){
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
        setScore(score - 1); // lose 1 point if the word was wrong
    }
    else{ // correct guess
        setOpen(true);
        setHeading("Congratulations");
        setMessage(`The word was ${actualWord}.`);
        if (hints.length === 0)
            setScore(score + 3); // 3 points if no hints were needed
        else if (hints.length === 1)
            setScore(score + 2); // 2 points if one hint was needed
        else if (hints.length === 2)
            setScore(score + 1); // 1 points if one hint was needed
        // no points if 3 hints were needed
        resetGame();
    }
}

export default function GuessButton({guessedWord, actualWord, setScore, score, hints, guesses, setHints, setGuesses, setOpen, setHeading, setMessage, clearInput, resetGame}: guessProps){
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleGuess(guessedWord, actualWord, setScore, score, hints, guesses, setHints, setGuesses, setOpen, setHeading, setMessage, clearInput, resetGame);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [guessedWord, actualWord, setScore, score, hints, guesses, setHints, setGuesses, setOpen, setHeading, setMessage, clearInput, resetGame]);
    return (
        <Button variant="outlined" onClick={() => {handleGuess(guessedWord, actualWord, setScore, score, hints, guesses, setHints, setGuesses, setOpen, setHeading, setMessage, clearInput, resetGame)}}>
            guess
        </Button>
    )
}