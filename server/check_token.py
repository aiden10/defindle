import jwt
import json
import os

JWT_SECRET = os.environ["JWT_SECRET"]
headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
}

def lambda_handler(event, context):
    if event["requestContext"]["http"]["method"] == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    auth = event["headers"].get("authorization", "")
    token = auth.replace("Bearer ", "")
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"valid": True, "user": decoded})
        }
    except jwt.ExpiredSignatureError:
        return {
            "statusCode": 401, 
            "headers": headers,
            "body": json.dumps({"valid": False, "error": "expired"})
        }
    except Exception:
        return {
            "statusCode": 401, 
            "headers": headers,
            "body": json.dumps({"valid": False})
        }
