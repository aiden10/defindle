
import { useState, useCallback, useRef } from 'react';
import WordInput from './components/WordInput.tsx';
import DefinitionContainer from './components/Definition.tsx';
import Hints from './components/Hints.tsx';
import GuessButton from './components/GuessButton.tsx';
import GiveupButton from './components/GiveupButton.tsx';
import Guesses from './components/Guesses.tsx';
import WordModal from './components/WordModal.tsx';
import './App.css';

var definitions: {[key: string]: string} = require("./definitions.json");
var words: [string] = require("./words.json");

function getRandomWord(): string {
  return words[Math.floor(Math.random() * words.length - 1)];
}

function getRandomDefinition(): [string, string] {
  var randomWord: string = getRandomWord();
  return [randomWord, definitions[randomWord]];
}

export default function MyApp() {
  const [inputClear, setInputClear] = useState<number>(0);
  const [modalHeading, setModalHeading] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [hints, setHints] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const guessedWord = useRef<string>("");
  const [gameCount, setGameCount] = useState<number>(0);
  const [definition, setDefinition] = useState<[string, string]>(getRandomDefinition());
  const [open, setOpen] = useState(false);

  const setHintsCallback = useCallback(
    (newHints: string[]) => setHints(newHints),
    []
  );
  const resetGame = useCallback(() => {
    setHints([]);
    setGuesses([]);
    guessedWord.current = "";
    setDefinition(getRandomDefinition);
    setGameCount(gameCount => gameCount + 1);
  }, []);

  return (
    <div key={gameCount}>
      <h2 id='instruction'><b>defindle</b>: guess the word by its definition</h2>
      <div id='row-container'>
        <DefinitionContainer 
          word={definition[0]}
          definition={definition[1]}/>
        <Hints 
          hints={hints}/>
        <Guesses 
          guesses={guesses}/>
      </div>
      <WordModal
        heading={modalHeading}
        message={modalMessage}
        open={open}
        setOpen={setOpen}/>
      <div id='inputs'>
        <WordInput
          clearInput={inputClear}
          setGuessedWord={(word: string) => {guessedWord.current = word; setGuesses([...guesses])}}/>
        <GuessButton 
          guessedWord={guessedWord.current}
          actualWord={definition[0]}
          setGuesses={setGuesses}
          hints={hints}
          guesses={guesses}
          setHints={setHintsCallback}
          setOpen={setOpen}
          setHeading={setModalHeading}
          setMessage={setModalMessage}
          clearInput={setInputClear}
          resetGame={resetGame}/>
        <GiveupButton 
          actualWord={definition[0]}
          resetGame={resetGame}
          setOpen={setOpen}
          setHeading={setModalHeading}
          setMessage={setModalMessage}/>
      </div>
    </div>
  );
}
