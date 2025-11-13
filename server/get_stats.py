import json
import os
import boto3
import jwt
from boto3.dynamodb.types import TypeDeserializer
from decimal import Decimal

headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

JWT_SECRET = os.environ["JWT_SECRET"]

def deserialize_dynamodb_item(item):
    deserializer = TypeDeserializer()
    return {k: deserializer.deserialize(v) if isinstance(v, dict) else v for k, v in item.items()}

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    else:
        return obj

def lambda_handler(event, context):
    if event["requestContext"]["http"]["method"] == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }
    
    try:
        body = json.loads(event["body"])
        token = body.get("token")

        if not token:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Missing token"})
            }

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")
            if not user_id:
                return {
                    "statusCode": 401,
                    "headers": headers,
                    "body": json.dumps({"error": "Invalid token: missing user_id"})
                }
        except jwt.ExpiredSignatureError:
            return {
                "statusCode": 401,
                "headers": headers,
                "body": json.dumps({"error": "Token has expired"})
            }
        except jwt.InvalidTokenError:
            return {
                "statusCode": 401,
                "headers": headers,
                "body": json.dumps({"error": "Invalid token"})
            }

        dynamo = boto3.resource("dynamodb")
        table = dynamo.Table("defindle-users")

        response = table.get_item(Key={"id": user_id})
        
        if "Item" not in response:
            return {
                "statusCode": 404,
                "headers": headers,
                "body": json.dumps({"error": "User not found"})
            }

        user_stats = response["Item"].get("stats", {})
        
        user_stats = convert_decimals(user_stats)

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "stats": user_stats
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }