
import json

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
    
update_allowed_words()