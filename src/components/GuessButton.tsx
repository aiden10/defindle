import Button from '@mui/material/Button';
import './Buttons.css';
import { useEffect } from 'react';
import { END_CAUSES } from '../shared/types';

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
    setWinScreen: Function
    setWinScreenText: Function
    setEndCause: Function
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

function handleGuess(guessedWord: string, actualWord: string, hints: string[], guesses: string[], setHints: Function, setGuesses:
     Function, setOpen: Function, setHeading: Function, setMessage: Function, clearInput: Function, setWinScreen: Function, setWinScreenText: Function, setEndCause: Function){
    clearInput(guesses.length + 1);

    // Blank guess
    if (guessedWord === ""){
        setOpen(true);
        setHeading("Guess cannot be blank!");
        setMessage("");
        return;
    }

    // Already guessed word
    if (guesses.includes(guessedWord)){
        setOpen(true);
        setHeading("Already guessed");
        setMessage(`The word: '${guessedWord}' has already been guessed`);
        return;
    }
    // Incorrect guess
    if (guessedWord.toLowerCase() !== actualWord.toLowerCase()){
        updateHints(actualWord, hints, setHints);
        setGuesses([...guesses, guessedWord]);
        if (guesses.length === 4){
            // lose after 4 incorrect guesses
            localStorage.setItem('word', actualWord);
            setWinScreenText(`The word was ${actualWord}. Try again tomorrow!`);
            setEndCause(END_CAUSES.INCORRECT_GUESSES);
            setWinScreen(true);
        }
    }
    // Correct guess
    else{ 
        localStorage.setItem('word', actualWord);
        setWinScreenText(`Congratulations, the word is ${actualWord}`, actualWord);
        setEndCause(END_CAUSES.CORRECT);
        setWinScreen(true);
    }
}

export default function GuessButton({guessedWord, actualWord, hints, guesses, setHints, setGuesses,
     setOpen, setHeading, setMessage, clearInput, setWinScreen, setWinScreenText, setEndCause}: guessProps){
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleGuess(guessedWord, actualWord, hints, guesses, setHints, setGuesses, setOpen, setHeading,
                     setMessage, clearInput, setWinScreen, setWinScreenText, setEndCause);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [guessedWord, actualWord, hints, guesses, setHints, setGuesses, setOpen, setHeading, setMessage, clearInput, setWinScreen, setWinScreenText, setEndCause]);
    return (
        <Button variant="outlined" onClick={() => {handleGuess(guessedWord, actualWord, hints, guesses, setHints, 
        setGuesses, setOpen, setHeading, setMessage, clearInput, setWinScreen, setWinScreenText, setEndCause)}}>
            guess
        </Button>
    )
}