
import { MAX_GUESSES } from '../shared/constants';
import { useGame } from '../shared/GameContext';

function Mistakes() {
    const { guesses } = useGame();
    const mistakesLeft = MAX_GUESSES - guesses.length;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5vh'}}>
            <span id='mistake-text'>mistakes remaining:</span>
            {Array.from({ length: mistakesLeft }).map((_, i) => (
                <svg
                    key={i}
                    width="25"
                    height="25"
                    viewBox="0 0 20 20"
                    style={{ display: 'inline-block' }}
                >
                    <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="#c1c17d"
                        stroke="#a0a066ff"
                        strokeWidth="1"
                    />
                </svg>
            ))}
        </div>
    );
}

export default Mistakes;