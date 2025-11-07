import Button from '@mui/material/Button';
import './Buttons.css';
import { useEffect, useCallback } from 'react';
import { END_CAUSES } from '../shared/types';
import { useGame } from '../shared/GameContext';

var wordKeys = require("../resources/words_keys.json");

function updateHints(word: string, currentHints: string[], setHints: Function) {
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

export default function GuessButton() {
    const { 
        guessedWord, 
        definition, 
        hints, 
        guesses, 
        setHints, 
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
        if (guessedWord.current.toLowerCase() !== definition[0].toLowerCase()) {
            updateHints(definition[0], hints, setHints);
            setGuesses([...guesses, guessedWord.current]);
            if (guesses.length === 4){
                // lose after 4 incorrect guesses
                localStorage.setItem('word', definition[0]);
                setWinScreenText(`The word was ${definition[0]}. Try again tomorrow!`);
                setEndCause(END_CAUSES.INCORRECT_GUESSES);
                setWinScreenVisible(true);
            }
        }
        // Correct guess
        else { 
            localStorage.setItem('word', definition[0]);
            setWinScreenText(`Congratulations, the word is ${definition[0]}`);
            setEndCause(END_CAUSES.CORRECT);
            setWinScreenVisible(true);
        }
    }, [guessedWord, definition, hints, guesses, setHints, setGuesses, setToastVisible, setToastHeading, setToastMessage, inputClear, setInputClear, setWinScreenVisible, setWinScreenText, setEndCause]);

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