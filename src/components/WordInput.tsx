import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { FilterOptionsState } from '@mui/material';
import './WordInput.css';
var wordOptions = require("../words.json");

interface inputProps {
    clearInput: number
    setGuessedWord: Function
}

const baseFilter = createFilterOptions<string>({
    ignoreCase: true,
    matchFrom: "start",
    limit: 100,
});
const filterOptions = (options: string[], state: FilterOptionsState<string>) => {
    if (state.inputValue === "") return [];
    return baseFilter(options, state);
}

  export default function WordInput({clearInput, setGuessedWord}: inputProps){
    return (
        <Autocomplete
            key={clearInput}
            disablePortal
            noOptionsText="No matching words found"
            filterOptions={filterOptions}
            options={wordOptions}
            renderInput={(params) => <TextField {...params} label="word"/>}
            onChange={(event, value) => {setGuessedWord(value)}}
        />
    );
}