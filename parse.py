import csv
words = {}
with open("dict.csv", "r", encoding='utf-8') as file:
    reader = csv.reader(file, delimiter=',')
    for row in reader:
        words.update({row[0]: row[1]})

import json
with open("definitions.json", "w", encoding='utf-8') as out:
    json.dump(words, out)