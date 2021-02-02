from huey import RedisHuey
from redis import ConnectionPool

from rest_framework.test import APITestCase


class HueyTestCase(APITestCase):

    def test(self) -> None:
        pool = ConnectionPool(host='127.0.0.1', port=6379, max_connections=20)
        c = pool._available_connections[0]
        c.connect()
        HUEY = RedisHuey('my-app', connection_pool=pool)
