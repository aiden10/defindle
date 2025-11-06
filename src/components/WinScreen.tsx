
import './WinScreen.css';
import '../shared/types';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { END_CAUSES } from '../shared/types';

interface winScreenProps{
    visible: boolean;
    endCause: END_CAUSES;
    word: string;
    text: string;
}

export default function WinScreen({endCause, visible, word, text}: winScreenProps){
    useEffect(() => {
        if (!visible && endCause !== END_CAUSES.GIVE_UP) return;

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
    }, [visible, endCause]);

    return visible && 
    <div id='win-screen'>
        <h1>{text}</h1>
        {endCause === END_CAUSES.ALREADY_DONE && <h2>{word}</h2>}
    </div>
}

