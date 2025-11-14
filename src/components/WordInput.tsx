import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FilterOptionsState } from '@mui/material';
import './WordInput.css';
import { useGame } from '../shared/GameContext';
import { useEffect, useRef } from 'react';
var wordKeys = require("../resources/words_keys.json");
var customGameKeys = require("../resources/custom_game_keys.json");

const baseFilter = createFilterOptions<string>({
    ignoreCase: true,
    matchFrom: "start",
    limit: 100,
});

const filterOptions = (options: string[], state: FilterOptionsState<string>) => {
    if (state.inputValue === "") return [];
    return baseFilter(options, state);
}

interface WordInputProps {
    customValue?: string;
    onCustomChange?: (value: string) => void;
    label?: string;
    customGames?: boolean;
}

export default function WordInput({ customValue, onCustomChange, label = "word", customGames = false}: WordInputProps = {}) {
    const textFieldRef = useRef<HTMLInputElement>(null);
    const { inputClear, guessedWord } = useGame();
    
    const isCustomMode = customValue !== undefined && onCustomChange !== undefined;
    
    useEffect(() => {
        if (!isCustomMode && textFieldRef.current && inputClear > 0) {
            textFieldRef.current.focus();
        }
    }, [inputClear, isCustomMode]);

    return (
        <Autocomplete
            key={isCustomMode ? undefined : inputClear}
            disablePortal
            freeSolo
            noOptionsText="No matching words found"
            filterOptions={filterOptions}
            options={customGames? Object.keys(customGameKeys) : Object.keys(wordKeys)}
            value={isCustomMode ? customValue : undefined}
            renderInput={(params) => 
                <TextField
                    {...params} 
                    label={label}
                    inputRef={textFieldRef}
                />
            }
            onChange={(event, value) => {
                if (isCustomMode) {
                    onCustomChange(value || "");
                } else {
                    guessedWord.current = value || "";
                }
            }}
            onInputChange={(event, value) => {
                if (isCustomMode) {
                    onCustomChange(value || "");
                } else {
                    guessedWord.current = value || "";
                }
            }}
        />
    );
}