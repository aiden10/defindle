
import json
import requests
import time

base_url = "https://api.dictionaryapi.dev/api/v2/entries/en/"

def get_definition(word: str) -> str:
    all_definitions = []
    response = requests.get(base_url + word)
    if response.status_code != 200:
        print(f"no definition found for: {word}")
        return
    
    data = json.loads(response.text)
    if "meanings" in data[0]:
        meanings = data[0]["meanings"]
        for meaning in meanings:
            definitions = meaning["definitions"]
            for definition_entry in definitions:
                all_definitions.append(definition_entry["definition"])
    else:
        print(f"failed to find definition for: {word}")
        return ""
    
    return '\n'.join(all_definitions) 
    
def main() -> None:
    definitions = {}
    with open("allowed.txt", "r", encoding='utf-8') as file:
        word_list = file.read().split("\n")
        for word in word_list:
            if len(word) <= 1:
                continue
            
            definitions.update({word: get_definition(word)})
            time.sleep(0.5)
            
    with open("new_definitions.json", "w", encoding='utf-8') as out:
        json.dump(definitions, out)
    
with open("server/definitions.json", "r") as allowed:
    new_definitions = {}
    definitions = json.load(allowed)
    print(len(definitions))