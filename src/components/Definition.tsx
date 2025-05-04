
import './Definition.css'

interface DefinitionContainerProps {
    word: string
    definition: string
}

export default function DefinitionContainer({definition, word}: DefinitionContainerProps){
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
    const parsedDefinition = definition.replace(regex, "<REDACTED>");
    return (
        <div>
            <h1>{parsedDefinition}</h1>
        </div>
    );
}