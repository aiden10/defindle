import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListSubheader } from '@mui/material';
import './Lists.css';
import React from 'react';

interface HintsProps{
    hints: String[];
}

function Hints({ hints }: HintsProps){
    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="list-subheader"
            subheader={
            <ListSubheader component="div" id="list-subheader">
                Clues
            </ListSubheader>
            }>
            {hints.map((hint, index: number) => (
                <ListItem key={index}>{hint}</ListItem>
            ))}
        </List>
    );
}

export default React.memo(Hints);