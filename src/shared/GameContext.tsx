import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { END_CAUSES } from './types';

interface GameContextType {
    inputClear: number;
    setInputClear: (clear: number) => void;
    toastHeading: string;
    setToastHeading: (heading: string) => void;
    toastMessage: string;
    setToastMessage: (message: string) => void;
    winScreenText: string;
    setWinScreenText: (text: string) => void;
    hints: string[];
    setHints: (hints: string[]) => void;
    guesses: string[];
    setGuesses: (guesses: string[]) => void;
    guessedWord: React.RefObject<string>;
    definition: [string, string];
    setDefinition: (definition: [string, string]) => void;
    toastVisible: boolean;
    setToastVisible: (open: boolean) => void;
    winScreenVisible: boolean;
    setWinScreenVisible: (visible: boolean) => void;
    endCause: END_CAUSES;
    setEndCause: (cause: END_CAUSES) => void;
    setHintsCallback: (newHints: string[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [inputClear, setInputClear] = useState<number>(0);
    const [toastHeading, setToastHeading] = useState<string>("");
    const [toastMessage, setToastMessage] = useState<string>("");
    const [winScreenText, setWinScreenText] = useState<string>("You've already completed today's word. Come back tomorrow.");
    const [hints, setHints] = useState<string[]>([]);
    const [guesses, setGuesses] = useState<string[]>([]);
    const guessedWord = useRef<string>("");
    const [definition, setDefinition] = useState<[string, string]>(["", ""]);
    const [toastVisible, setToastVisible] = useState(false);
    const [winScreenVisible, setWinScreenVisible] = useState(false);
    const [endCause, setEndCause] = useState(END_CAUSES.NONE);
    
    const setHintsCallback = useCallback(
        (newHints: string[]) => setHints(newHints),
        []
    );

    const value = {
        inputClear,
        setInputClear,
        toastHeading,
        setToastHeading,
        toastMessage,
        setToastMessage,
        winScreenText,
        setWinScreenText,
        hints,
        setHints,
        guesses,
        setGuesses,
        guessedWord,
        definition,
        setDefinition,
        toastVisible,
        setToastVisible,
        winScreenVisible,
        setWinScreenVisible,
        endCause,
        setEndCause,
        setHintsCallback,
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