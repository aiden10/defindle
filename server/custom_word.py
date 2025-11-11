import json
import boto3
import base64

s3 = boto3.client('s3')
BUCKET = 'defindle-bucket'

def s3_read_json(key):
    response = s3.get_object(Bucket=BUCKET, Key=key)
    return json.loads(response['Body'].read().decode())

def get_word(word):
    try:
        definitions = s3_read_json("all_definitions.json")
        decoded_bytes = base64.b64decode(word)
        decoded_word = decoded_bytes.decode('utf-8')
        if decoded_word not in definitions:
            raise KeyError(f"Word '{decoded_word}' not found in definitions")
            
        definition = definitions[decoded_word]
        return {"word": decoded_word, "definition": definition}
    except base64.binascii.Error as e:
        raise ValueError(f"Invalid base64 encoding: {str(e)}")
    except KeyError as e:
        raise KeyError(str(e))
    except Exception as e:
        raise Exception(f"Error in get_word: {str(e)}")

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
        base64_word = event.get("queryStringParameters", {}).get("word")
        if not base64_word:
            raise ValueError("Missing 'word' query parameter")
        word_info = get_word(base64_word)
        return {
            "headers": headers,
            "statusCode": 200,
            "body": json.dumps(word_info)
        }
    except Exception as e:
        return {
            "headers": headers,
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }