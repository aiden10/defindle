
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { END_CAUSES } from './types';
import { MAX_GUESSES, BASE_URL } from './constants';
import wordKeys from '../resources/words_keys.json';

interface GameContextType {
    inputClear: number;
    setInputClear: (clear: number) => void;
    toastHeading: string;
    setToastHeading: (heading: string) => void;
    toastMessage: string;
    setToastMessage: (message: string) => void;
    winScreenText: string;
    setWinScreenText: (text: string) => void;
    guesses: string[];
    setGuesses: (guesses: string[]) => void;
    guessedWord: React.RefObject<string>;
    definition: string[];
    setDefinition: (definition: string[]) => void;
    word: string;
    setWord: (word: string) => void;
    toastVisible: boolean;
    setToastVisible: (open: boolean) => void;
    winScreenVisible: boolean;
    setWinScreenVisible: (visible: boolean) => void;
    endCause: END_CAUSES;
    setEndCause: (cause: END_CAUSES) => void;
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    handleGuess: () => void;
    handleGiveUp: () => void;
    handleCustomWord: (customWord: string) => string;
    customGame: boolean;
    setCustomGame: (custom: boolean) => void;
    restartGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [inputClear, setInputClear] = useState<number>(0);
    const [toastHeading, setToastHeading] = useState<string>("");
    const [toastMessage, setToastMessage] = useState<string>("");
    const [winScreenText, setWinScreenText] = useState<string>("You've already completed today's word. Come back tomorrow.");
    const [guesses, setGuesses] = useState<string[]>([]);
    const guessedWord = useRef<string>("");
    const [definition, setDefinition] = useState<string[]>([""]);
    const [word, setWord] = useState<string>("");
    const [toastVisible, setToastVisible] = useState(false);
    const [winScreenVisible, setWinScreenVisible] = useState(false);
    const [endCause, setEndCause] = useState(END_CAUSES.NONE);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [customGame, setCustomGame] = useState<boolean>(false);

    const handleCustomWord = (customWord: string) => {
        if (customWord in wordKeys) return `${BASE_URL}/custom/${btoa(customWord)}`;
        return "";
    };

    const handleGiveUp = useCallback(() => {
        if (customGame) setWinScreenText(`The word was ${word}`);
        else setWinScreenText(`The word was ${word}. Try again tomorrow!`);
        setEndCause(END_CAUSES.GIVE_UP);
        setWinScreenVisible(true);
        if (!customGame) localStorage.setItem('word', word);
    }, [word, setWinScreenText, setEndCause, setWinScreenVisible]);

    const handleGuess = useCallback(() => {
        setInputClear((prev) => prev + 1);

        const currentGuess = (guessedWord.current || '').trim();

        // Blank guess
        if (!currentGuess) {
            setToastVisible(true);
            setToastHeading('Guess cannot be blank!');
            setToastMessage('');
            return;
        }

        // Invalid word
        if (!(currentGuess.toLowerCase() in wordKeys)) {
            setToastVisible(true);
            setToastHeading('Invalid word');
            setToastMessage(`'${currentGuess}' is not a valid word`);
            return;
        }

        // Already guessed
        if (guesses.includes(currentGuess)) {
            setToastVisible(true);
            setToastHeading('Already guessed');
            setToastMessage(`The word: '${currentGuess}' has already been guessed`);
            return;
        }

        // Incorrect
        if (currentGuess.toLowerCase() !== word.toLowerCase()) {
            setGuesses((prev) => [...prev, currentGuess]);
            if (guesses.length + 1 >= MAX_GUESSES) {
                localStorage.setItem('word', word);
                setWinScreenText(`The word was ${word}. Try again tomorrow!`);
                setEndCause(END_CAUSES.INCORRECT_GUESSES);
                setWinScreenVisible(true);
            }
            return;
        }

        // Correct
        if (!customGame) localStorage.setItem('word', word);
        setWinScreenText(`Congratulations, the word was ${word}`);
        setEndCause(END_CAUSES.CORRECT);
        setWinScreenVisible(true);
    }, [
        word,
        guesses,
        setGuesses,
        setToastVisible,
        setToastHeading,
        setToastMessage,
        setInputClear,
        setWinScreenVisible,
        setWinScreenText,
        setEndCause
    ]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !modalOpen) handleGuess();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleGuess, modalOpen]);

    const restartGame = () => {
        setEndCause(END_CAUSES.NONE);
        setGuesses([]);
        setWinScreenVisible(false);
    };

    const value = {
        inputClear,
        setInputClear,
        toastHeading,
        setToastHeading,
        toastMessage,
        setToastMessage,
        winScreenText,
        setWinScreenText,
        guesses,
        setGuesses,
        guessedWord,
        word,
        setWord,
        definition,
        setDefinition,
        toastVisible,
        setToastVisible,
        winScreenVisible,
        setWinScreenVisible,
        endCause,
        setEndCause,
        modalOpen,
        setModalOpen,
        handleGuess,
        handleGiveUp,
        handleCustomWord,
        customGame,
        setCustomGame,
        restartGame
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};