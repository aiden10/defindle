import json
import boto3
from datetime import date
import hashlib

s3 = boto3.client('s3')
BUCKET = 'defindle-test-bucket'

def s3_read_json(key):
    response = s3.get_object(Bucket=BUCKET, Key=key)
    return json.loads(response['Body'].read().decode())

def s3_write_json(key, data):
    s3.put_object(Bucket=BUCKET, Key=key, Body=json.dumps(data))

def get_daily_word():
    date_string = date.today().strftime("%Y-%m-%d")
    try:
        cache = s3_read_json("cache.json")
        if cache["day"] == date_string:
            return {"word": cache["word"], "definition": cache["definition"]}
    except:
        pass

    definitions = s3_read_json("all_definitions.json")
    allowed_words = list(definitions.keys())

    hash_int = int(hashlib.md5(date_string.encode()).hexdigest(), 16)
    word = ""
    while word not in definitions:
        hash_int += 1
        word = allowed_words[hash_int % len(allowed_words)]
    definition = definitions[word]

    cache = {"day": date_string, "word": word, "definition": definition}
    s3_write_json("cache.json", cache)
    return {"word": word, "definition": definition}

def lambda_handler(event, context):
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    }
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    try:
        word_info = get_daily_word()
    except Exception as e:
        return {
            "headers": headers,
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
        
    return {
        "headers": headers,
        "statusCode": 200,
        "body": json.dumps(word_info)
    }

        