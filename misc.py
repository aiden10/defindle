
import json

def list_to_dict(path: str, out_path: str):
    d = {}
    with open(path, "r") as f:
        word_list = json.load(f)
    d = {w: 0 for w in word_list}
    with open(out_path, "w") as out:
        json.dump(d, out)
        
list_to_dict("src/resources/words.json", "src/resources/words_keys.json")
