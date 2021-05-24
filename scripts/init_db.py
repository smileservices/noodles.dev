import sys
import environ
import psycopg2

env = environ.Env()
environ.Env.read_env("../.env")

config = {
    "host": env('DB_HOST'),
    "database": sys.argv[1],
    "user": sys.argv[2],
    "password": sys.argv[3]
}

database = env('DB_NAME')
owner = env('DB_USER')
pswd = env('DB_PASSWORD')

# drop db and recreate
with psycopg2.connect(**config) as conn:
    with conn.cursor() as cur:
        conn.set_isolation_level(0)
        cur.execute(f"CREATE USER {owner} WITH PASSWORD '{pswd}'")
        cur.execute(f"ALTER USER {owner} CREATEDB")
        cur.execute(f"CREATE DATABASE {database} OWNER {owner}")
