
import json
import re

def list_to_dict(path: str, out_path: str):
    d = {}
    with open(path, "r") as f:
        word_list = json.load(f)
    d = {w: 0 for w in word_list}
    with open(out_path, "w") as out:
        json.dump(d, out)

def update_allowed_words():
    d = {}
    with open("scraper/wordlist.txt", "r") as f:
        words = [l.strip() for l in f.readlines()]
        d = {w: 0 for w in words}
    with open("src/resources/words.json", "w") as out:
        json.dump(d, out)
    
def censor_words():
    with open("scraper/all_definitions1.json", "r") as f:
        all_definitions = json.load(f)
        for word, definitions in all_definitions.items():
            cleaned_definitions = []
            for definition in definitions:
                words_in_def = definition.split()
                cleaned_words = []
                for d_word in words_in_def:
                    word_lower = ''.join(c for c in d_word if c.isalpha()).lower()
                    if word.lower() in word_lower:
                        cleaned_words.append("<REDACTED>")
                    else:
                        cleaned_words.append(d_word)
                cleaned_definition = ' '.join(cleaned_words)
                cleaned_definitions.append(cleaned_definition)
            all_definitions[word] = cleaned_definitions
    
    with open("scraper/all_definitions.json", "w") as f:
        json.dump(all_definitions, f)

censor_words()