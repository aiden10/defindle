
import './WinScreen.css';

interface winScreenProps{
    visible: boolean;
    word: string;
    text: string;
}

export default function WinScreen({visible, word, text}: winScreenProps){
    return visible && 
    <div id='win-screen'>
        <h1>{text}</h1>
        <h2>{word}</h2>
    </div>
}

