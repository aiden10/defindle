
import './Guesses.css';
import { useGame } from '../shared/GameContext.tsx';

export default function Guesses() {
    const { guesses } = useGame();
    return <div id="guesses-container">
        {guesses.map((guess, i) => {
          return <p key={i} className='guess'>{guess}</p>  
        })}
    </div>
}