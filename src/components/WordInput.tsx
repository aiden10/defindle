import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FilterOptionsState } from '@mui/material';
import './WordInput.css';
import { useGame } from '../shared/GameContext';
var wordKeys = require("../resources/words_keys.json");

const baseFilter = createFilterOptions<string>({
    ignoreCase: true,
    matchFrom: "start",
    limit: 100,
});

const filterOptions = (options: string[], state: FilterOptionsState<string>) => {
    if (state.inputValue === "") return [];
    return baseFilter(options, state);
}

export default function WordInput(){
    const { inputClear, guessedWord } = useGame();
    
    return (
        <Autocomplete
            key={inputClear}
            disablePortal
            freeSolo
            noOptionsText="No matching words found"
            filterOptions={filterOptions}
            options={Object.keys(wordKeys)}
            renderInput={(params) => <TextField {...params} label="word"/>}
            onChange={(event, value) => {guessedWord.current = value || ""}}
            onInputChange={(event, value) => {guessedWord.current = value || ""}}
        />
    );
}