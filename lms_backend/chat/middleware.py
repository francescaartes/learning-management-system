from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token_list = query_params.get("token")
        if token_list:
            try:
                access_token = AccessToken(token_list[0])
                user_id = access_token["user_id"]
                user = await database_sync_to_async(User.objects.get)(id=user_id)
                scope["user"] = user
            except Exception as e:
                print("[JWTAuthMiddleware] Invalid token:", e)
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
