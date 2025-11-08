import Button from '@mui/material/Button';
import './Buttons.css';
import { useEffect, useCallback } from 'react';
import { END_CAUSES } from '../shared/types';
import { useGame } from '../shared/GameContext';
import { MAX_GUESSES } from '../shared/constants';

var wordKeys = require("../resources/words_keys.json");

export default function GuessButton() {
    const { 
        guessedWord, 
        word,
        guesses, 
        setGuesses,
        setToastVisible, 
        setToastHeading, 
        setToastMessage, 
        inputClear,
        setInputClear, 
        setWinScreenVisible, 
        setWinScreenText, 
        setEndCause 
    } = useGame();

    const handleGuess = useCallback(() => {
        setInputClear(inputClear + 1);

        // Blank guess
        if (guessedWord.current === "") {
            setToastVisible(true);
            setToastHeading("Guess cannot be blank!");
            setToastMessage("");
            return;
        }

        // Invalid word
        if (!(guessedWord.current.toLowerCase() in wordKeys)) {
            setToastVisible(true);
            setToastHeading("Invalid word");
            setToastMessage(`'${guessedWord.current}' is not a valid word`);
            return;
        }

        // Already guessed word
        if (guesses.includes(guessedWord.current)) {
            setToastVisible(true);
            setToastHeading("Already guessed");
            setToastMessage(`The word: '${guessedWord.current}' has already been guessed`);
            return;
        }
        // Incorrect guess
        if (guessedWord.current.toLowerCase() !== word.toLowerCase()) {
            setGuesses([...guesses, guessedWord.current]);
            if (guesses.length + 1 === MAX_GUESSES){
                localStorage.setItem('word', word);
                setWinScreenText(`The word was ${word}. Try again tomorrow!`);
                setEndCause(END_CAUSES.INCORRECT_GUESSES);
                setWinScreenVisible(true);
            }
        }
        // Correct guess
        else { 
            localStorage.setItem('word', word);
            setWinScreenText(`Congratulations, the word was ${word}`);
            setEndCause(END_CAUSES.CORRECT);
            setWinScreenVisible(true);
        }
    }, [guessedWord, word, guesses, setGuesses, setToastVisible, setToastHeading, setToastMessage, inputClear, setInputClear, setWinScreenVisible, setWinScreenText, setEndCause]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleGuess();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleGuess]);

    return (
        <Button variant="outlined" onClick={handleGuess}>
            guess
        </Button>
    )
}