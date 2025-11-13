
import { useGame } from "../shared/GameContext";
import './Stats.css';

export default function Stats(onTop: {top: boolean}) {
    const {
        currentStreak,
        completedGames,
        giveUpCount,
        incorrectGuesses,
        correctGuesses,
        daysPlayed,
    } = useGame();

    return (
    <div
        id="stats-container"
        className={onTop.top ? "scroll-left": "scroll-right"}
        style={onTop.top ? { top: 0, bottom: "auto" } : { top: "auto", bottom: 0 }}
    >
        {/* duplicate needed for seamless scroll */}
        <p>incorrect guesses: {incorrectGuesses}</p>
        <p>correct guesses: {correctGuesses}</p>
        <p>current streak: {currentStreak}</p>
        <p>completed games: {completedGames}</p>
        <p>times given up: {giveUpCount}</p>
        <p>days played: {daysPlayed}</p>
        <p>incorrect guesses: {incorrectGuesses}</p>
        <p>correct guesses: {correctGuesses}</p>
        <p>current streak: {currentStreak}</p>
        <p>completed games: {completedGames}</p>
        <p>times given up: {giveUpCount}</p>
        <p>days played: {daysPlayed}</p>
        <p>incorrect guesses: {incorrectGuesses}</p>
        <p>correct guesses: {correctGuesses}</p>
        <p>current streak: {currentStreak}</p>
        <p>completed games: {completedGames}</p>
        <p>times given up: {giveUpCount}</p>
        <p>days played: {daysPlayed}</p>
    </div>
    );
}