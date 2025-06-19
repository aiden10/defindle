import json
import boto3
from datetime import date
import hashlib

s3 = boto3.client('s3')
BUCKET = 'defindle-bucket'

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
            return [cache["word"], cache["definition"]]
    except:
        pass

    allowed_words = s3_read_json("allowed.json")
    definitions = s3_read_json("definitions.json")

    hash_int = int(hashlib.md5(date_string.encode()).hexdigest(), 16)
    word = ""
    while word not in definitions:
        hash_int += 1
        word = allowed_words[hash_int % len(allowed_words)]
    definition = definitions[word]

    cache = {"day": date_string, "word": word, "definition": definition}
    s3_write_json("cache.json", cache)
    return [word, definition]

def lambda_handler(event, context):
    word_info = get_daily_word()
    http_method = event['requestContext']['http']['method']
    
    if http_method == "GET":
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://defindle.vercel.app",
            },
            "body": json.dumps(word_info)
        }

    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://defindle.vercel.app",
                "Access-Control-Allow-Methods": "OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": ""
        }

    return {
        "statusCode": 405,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://defindle.vercel.app",
        },
        "body": json.dumps({"error": "method not supported"})
    }
        