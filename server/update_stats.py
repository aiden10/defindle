import json
import os
import boto3
import jwt
from decimal import Decimal

headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

JWT_SECRET = os.environ["JWT_SECRET"]

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
        stats = body.get("stats")

        if not token:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Missing token"})
            }

        if not stats:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Missing stats"})
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

        required_fields = ["current_streak", "completed_games", "give_up_count", 
                          "incorrect_guesses", "correct_guesses", "days_played"]
        if not all(field in stats for field in required_fields):
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Invalid stats format"})
            }

        dynamo = boto3.resource("dynamodb")
        table = dynamo.Table("defindle-users")

        response = table.update_item(
            Key={"id": user_id},
            UpdateExpression="SET stats = :stats",
            ExpressionAttributeValues={":stats": stats},
            ReturnValues="UPDATED_NEW"
        )

        updated_stats = convert_decimals(response["Attributes"]["stats"])

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "message": "Stats updated successfully",
                "updated_stats": updated_stats
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }