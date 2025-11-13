import json
import jwt
from google.auth.transport import requests as grequests
from google.oauth2 import id_token
import os
import time
import boto3

JWT_SECRET = os.environ["JWT_SECRET"]
GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

def lambda_handler(event, context):
    if event["requestContext"]["http"]["method"] == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }
    
    body = json.loads(event["body"])
    token = body.get("token")

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            grequests.Request(),
            GOOGLE_CLIENT_ID
        )

        user_id = idinfo["sub"]
        email = idinfo.get("email")

        payload = {
            "sub": user_id,
            "email": email,
            "iat": int(time.time()),
        }
        app_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

        dynamo = boto3.resource("dynamodb")
        table = dynamo.Table("defindle-users")
        
        response = table.get_item(Key={"id": user_id})
        
        if "Item" in response:
            table.update_item(
                Key={"id": user_id},
                UpdateExpression="SET #t = :token",
                ExpressionAttributeNames={"#t": "token"},
                ExpressionAttributeValues={":token": app_token}
            )
        else:
            table.put_item(
                Item={
                    "id": user_id,
                    "email": email,
                    "token": app_token,
                    "stats": {
                        "current_streak": 0,
                        "completed_games": 0,
                        "give_up_count": 0,
                        "incorrect_guesses": 0,
                        "correct_guesses": 0,
                        "days_played": 0
                    }
                }
            )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"token": app_token})
        }

    except Exception as e:
        return {
            "statusCode": 401,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }