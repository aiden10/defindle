
import json
import re

SUFFIXES = [
    "ing", "er", "ed", "es", "s", "ly", "ment", "ness", "ful", "less", "able", "ible",
    "al", "ial", "ous", "eous", "ious", "en", "ize", "ise", "ify", "tion", "ation", "ition",
    "ive", "ative", "itive", "ic", "y", "ty", "ity", "ant", "ent", "ism", "ist", "ship", "ate"
]

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
        all_definitions[word] = [censor_definition(word, definition) for definition in definitions]
    
    with open("scraper/all_definitions.json", "w") as f:
        json.dump(all_definitions, f)

def censor_definition(word: str, definition: str) -> str:
    words_in_def = definition.split()
    cleaned_words = [censor_word_if_needed(word, d_word) for d_word in words_in_def]
    return ' '.join(cleaned_words)

def censor_word_if_needed(original_word: str, d_word: str) -> str:
    word_lower = ''.join(c for c in d_word if c.isalpha()).lower()
    original_lower = original_word.lower()
    
    if word_lower == original_lower:
        return "<REDACTED>"
    
    if word_lower in original_lower and len(word_lower) > 2:
        return "<REDACTED>"

    for suffix in SUFFIXES:
        if word_lower.endswith(suffix):
            trimmed = word_lower[:-len(suffix)]
            if trimmed == original_lower or (trimmed in original_lower and len(trimmed) > 2):
                return "<REDACTED>"
    
    return d_word

def remove_duplicate_definitions():
    all_definitions = {}
    new_definitions = {}
    removed_count = 0
    with open("scraper/all_definitions.json", "r") as f:
        all_definitions = json.load(f)
    
    for key in all_definitions:
        if len(set(all_definitions[key])) < 6:
            print(f"removing: {key}")
            removed_count += 1
        else:
            new_definitions[key] = all_definitions[key]
    with open("scraper/all_definitions2.json", "w") as out:
        json.dump(new_definitions, out)
    print(f'removed: {removed_count}')
    print(f'{len(new_definitions)} new definitions')
    print(f'{len(all_definitions)} old definitions')

remove_duplicate_definitions()