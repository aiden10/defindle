import json
words = []
with open("src/definitions.json", "r", encoding='utf-8') as file:
    definitions = json.load(file)
    for word in definitions:
        words.append(word)
            
with open("words.json", "w", encoding='utf-8') as out:
    json.dump(words, out)