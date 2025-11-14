import './WinScreen.css';
import '../shared/types';
import confetti from 'canvas-confetti';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { END_CAUSES } from '../shared/types';
import { useGame } from '../shared/GameContext';
import { useUpdateStats } from '../shared/hooks';
import Login from './Login';
import Stats from './Stats';

export default function WinScreen(){
    const { 
        winScreenVisible,
        endCause, 
        word, 
        winScreenText, 
        guesses, 
        auth,
        setModalOpen,
        restartGame,
        currentStreak,
        completedGames,
        giveUpCount,
        incorrectGuesses,
        correctGuesses,
        daysPlayed,
    } = useGame();

    const { updateStats } = useUpdateStats({
        currentStreak,
        completedGames,
        giveUpCount,
        incorrectGuesses,
        correctGuesses,
        daysPlayed
    });

    useEffect(() => {
        if (!winScreenVisible || endCause !== END_CAUSES.CORRECT) return;

        const duration = 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 10,
                startVelocity: 50,
                spread: 120,
                angle: 60,
                origin: {
                    x: 0,
                    y: 0
                }
            });
            confetti({
                particleCount: 10,
                startVelocity: 50,
                spread: 120,
                angle: 120,
                origin: {
                    x: 1,
                    y: 0
                }
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }, [winScreenVisible, endCause]);

    useEffect(() => {
    if (endCause !== END_CAUSES.NONE && endCause !== END_CAUSES.ALREADY_DONE) updateStats();
  }, [endCause]);

    return winScreenVisible && 
    <div id='win-screen'>
        { auth.user && <Stats top={true}/> }
        { auth.user && <Stats top={false}/> }
        <h1>{winScreenText}</h1>
        <div id='your-guesses'>
            {guesses.map((guess, index) => {
                const isCorrect = guess.toLowerCase() === word.toLowerCase();
                return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p className={isCorrect && endCause !== END_CAUSES.CORRECT ? 'correct-guess' : ''}>{guess}</p>
                        {index !== guesses.length - 1 && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </div>
                );
            })}
        </div>
        {(endCause === END_CAUSES.ALREADY_DONE) && <h2 className='hidden-word'>{word}</h2>}
        {(endCause === END_CAUSES.CORRECT) && <h2 id="guess-string">solved in {guesses.length + 1}</h2>}
        <div style={{display: 'flex', flexDirection: 'row', padding: '15px'}}>
            <Button variant="outlined"
            style={{padding: '5px'}}
            onClick={() => setModalOpen(true)}>custom game</Button>
            <Button variant="outlined" 
            style={{padding: '5px'}}
            onClick={restartGame}>play again</Button>
        </div>
        { !auth.user && !auth.loading && <Login/> }
        { 
          auth.user && <Button variant='outlined' 
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.reload();
          }}>sign out</Button> 
        }
    </div>
}