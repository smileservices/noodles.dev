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
        try:
            cur.execute(f"UPDATE pg_database SET datallowconn = 'false' WHERE datname = '{database}';")
            cur.execute(f"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{database}';")
            cur.execute(f"DROP DATABASE {database}")
        except psycopg2.errors.InvalidCatalogName:
            pass
        cur.execute(f"CREATE DATABASE {database} OWNER {owner}")

with psycopg2.connect(host=config['host'], database=database, user=config['user'], password=config['password']) as conn:
    with conn.cursor() as cur:
        cur.execute(f'CREATE EXTENSION IF NOT EXISTS pg_trgm;')
        cur.execute(f'CREATE EXTENSION IF NOT EXISTS unaccent;')