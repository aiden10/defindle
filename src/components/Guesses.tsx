import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListSubheader } from '@mui/material';
import React from 'react';
import './Lists.css';

interface guessesProps{
    guesses: String[];
}

function Guesses({ guesses }: guessesProps){
    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="list-subheader"
            subheader={
            <ListSubheader component="div" id="list-subheader">
                Guesses
            </ListSubheader>
            }>
            {guesses.map((guess, index: number) => (
                <ListItem key={index}>{guess}</ListItem>
            ))}
        </List>
    );
}

export default React.memo(Guesses);