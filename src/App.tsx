
import { useState, useCallback, useRef, useEffect } from 'react';
import WordInput from './components/WordInput.tsx';
import DefinitionContainer from './components/Definition.tsx';
import Hints from './components/Hints.tsx';
import GuessButton from './components/GuessButton.tsx';
import GiveupButton from './components/GiveupButton.tsx';
import Guesses from './components/Guesses.tsx';
import WordModal from './components/WordModal.tsx';
import WinScreen from './components/WinScreen.tsx';
import './shared/types.ts';
import './App.css';
import { END_CAUSES } from './shared/types.ts';

export default function MyApp() {

  const [inputClear, setInputClear] = useState<number>(0);
  const [modalHeading, setModalHeading] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [winScreenText, setWinScreenText] = useState<string>("You've already completed today's word. Come back tomorrow.");
  const [hints, setHints] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const guessedWord = useRef<string>("");
  const [definition, setDefinition] = useState<[string, string]>(["", ""]);
  const [open, setOpen] = useState(false);
  const [winScreenVisible, setWinScreenVisible] = useState(false);
  const setHintsCallback = useCallback(
    (newHints: string[]) => setHints(newHints),
    []
  );
  
  // fetch daily word, and definition, and check local storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://ii3urx3sga.execute-api.us-east-2.amazonaws.com/default/defindle");
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setDefinition(json.definition);
        let savedResult: string = localStorage.getItem('word') || "n/a";
        console.log(json.definition)
        if (json.definition[0] === savedResult){
          setWinScreenVisible(true);
        }
      }
      catch (error) {
        setModalHeading("Error loading word");
        if (error instanceof Error) {
          console.error(error.message);
          setModalMessage(error.message);
        } 
        else {
          console.error('An unknown error occurred:', error);
          setModalMessage('An unknown error occurred');
        }
        setOpen(true);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <WinScreen
        word={definition[0]}
        text={winScreenText}
        endCause={END_CAUSES.NONE}
        visible={winScreenVisible}>
      </WinScreen>
      <h2 id='instruction'><b>defindle</b>: guess the word by its definition</h2>
      <div id='row-container'>
        <DefinitionContainer 
          word={definition[0]}
          definition={definition[1]}/>
          <div id='lists-container'>
            <Hints 
              hints={hints}/>
            <Guesses 
              guesses={guesses}/>
          </div>
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
          setWinScreen={setWinScreenVisible}
          setWinScreenText={setWinScreenText}
          />
        <GiveupButton 
          word={definition[0]}
          setWinScreen={setWinScreenVisible}
          setWinScreenText={setWinScreenText}          
          />
      </div>
      <a href="https://github.com/aiden10/defindle/" target='_blank' rel="noreferrer">
        <svg
          id='github' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
    </div>
  );
}
