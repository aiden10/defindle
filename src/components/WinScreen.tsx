import './WinScreen.css';
import '../shared/types';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { END_CAUSES } from '../shared/types';
import { useGame } from '../shared/GameContext';

export default function WinScreen(){
    const { winScreenVisible, endCause, word, winScreenText } = useGame();
    
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

    return winScreenVisible && 
    <div id='win-screen'>
        <h1>{winScreenText}</h1>
        {(endCause === END_CAUSES.ALREADY_DONE) && <h2>{word}</h2>}
    </div>
}