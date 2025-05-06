
import './Definition.css'

interface DefinitionContainerProps {
    word: string
    definition: string
}

export default function DefinitionContainer({definition, word}: DefinitionContainerProps){
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}(es|s)?\\b`, "gi");
    const parsedDefinition = definition.replace(regex, "<REDACTED>");
    return (
        <div id='definition-container'>
            <h1>{parsedDefinition}</h1>
        </div>
    );
}