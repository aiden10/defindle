import './Definition.css'
import { useGame } from '../shared/GameContext';

export default function DefinitionContainer(){
    const {definition, guesses} = useGame();
    const numToShow = Math.min(2 + guesses.length * 2, definition.length);

    return (
        <div id='definition-container'>
            {definition.map((d, i) => {
                const isBlurred = i >= numToShow;
                return (
                    <h1 
                        key={i} 
                        className={isBlurred ? 'blurred' : ''}
                    >
                        <mark>{d}</mark>
                    </h1>
                );
            })}
        </div>
    );
}