
import json
import requests
import bs4
import re
import time

current_index = 0
target_index = 4999
meriam_url = "https://www.merriam-webster.com/dictionary/"
all_definitions = {}
words = []

with open("scraper/all_definitions.json", "r", encoding="utf-8") as f:
    all_definitions = json.load(f)
    
with open("scraper/progress.json", "r") as progress_file:
    progress = json.load(progress_file)
    current_index = progress["current_index"]

with open("scraper/wordlist.txt", "r", encoding="utf-8") as file:
    words = [line.strip() for line in file.readlines()]

for i in range(current_index, target_index):
    print(f"{i}/{target_index}")
    res = requests.get(f"{meriam_url}{words[i]}")
    if res.status_code != 200:
        print(f"failed to get entry for: {words[i]} (index: {i})")
        
    soup = bs4.BeautifulSoup(res.text, "html.parser")
    definitions = soup.find_all("span", {"class": "dtText"})
    if len(definitions) == 0:
        print(f"Failed to get definitions for: {words[i]}")
    definitions = [d.get_text()[2:].strip() for d in definitions if "sense" not in d.get_text().lower()][:6]
    escaped_word = re.escape(words[i])
    regex_pattern = rf"\b{escaped_word}(?:es|s)?\b"
    cleaned_definitions = []
    for definition in definitions:
        cleaned_definition = re.sub(regex_pattern, "<REDACTED>", definition, flags=re.IGNORECASE)
        cleaned_definitions.append(cleaned_definition)

    if len(cleaned_definitions) >= 6:
        all_definitions[words[i]] = cleaned_definitions
        # print(f"DEFNITIONS FOR: {words[i]}: {cleaned_definitions}")
    else:
        print(f"word: {words[i]} has fewer than 6 definitions, skipping")
    time.sleep(0.1)

with open("scraper/all_definitions.json", "w", encoding="utf-8") as f:
    json.dump(all_definitions, f)

with open("scraper/progress.json", "w") as f:
    json.dump({"current_index": target_index}, f)
