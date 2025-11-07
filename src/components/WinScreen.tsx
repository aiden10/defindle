import './WinScreen.css';
import '../shared/types';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { END_CAUSES } from '../shared/types';
import { useGame } from '../shared/GameContext';

export default function WinScreen(){
    const { winScreenVisible, endCause, definition, winScreenText } = useGame();
    
    useEffect(() => {
        if (!winScreenVisible || endCause !== END_CAUSES.CORRECT) return;

        const duration = 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                startVelocity: 15,
                spread: 180,
                origin: {
                    x: 0.5 + (Math.random() - 0.5) * 0.2,
                    y: 0.35 + (Math.random() - 0.5) * 0.2
                }
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }, [winScreenVisible, endCause]);

    return winScreenVisible && 
    <div id='win-screen'>
        <h1>{winScreenText}</h1>
        {(endCause === END_CAUSES.ALREADY_DONE) && <h2>{definition[0]}</h2>}
    </div>
}