import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListSubheader } from '@mui/material';
import React from 'react';
import './Lists.css';
import { useGame } from '../shared/GameContext';

function Guesses(){
    const { guesses } = useGame();
    
    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', 'margin-top': 10 }}
            component="nav"
            aria-labelledby="list-subheader"
            subheader={
            <ListSubheader component="div" id="list-subheader">
                Guesses ({4 - guesses.length} left)
            </ListSubheader>
            }>
            {guesses.map((guess, index: number) => (
                <ListItem key={index}>{guess}</ListItem>
            ))}
        </List>
    );
}

export default React.memo(Guesses);