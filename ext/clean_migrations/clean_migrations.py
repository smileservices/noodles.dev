import os
import psycopg2

config = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "postgres"
}

database = 'noodlesdb'
owner = 'noodles'
pswd = '123'

# delete migrations folders
for app in os.listdir():
    try:
        for folder in os.listdir(app):
            if folder == 'migrations':
                for migration_file in os.listdir(os.path.join(app, folder)):
                    if migration_file == '__init__.py':
                        continue
                    try:
                        os.remove(os.path.join(app, folder, migration_file))
                    except IsADirectoryError:
                        pass
                    except Exception as e:
                        print(e)
                print(f'Cleaned migrations for {app} app')
    except NotADirectoryError:
        pass

# drop db and recreate
'''sql
UPDATE pg_database SET datallowconn = 'false' WHERE datname = 'noodlesdb';
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'noodlesdb';
DROP DATABASE noodlesdb;
'''

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

# rendered_script_file = Template(open(
#     os.path.join(os.path.dirname(__file__), 'manage_db.sh')
# ).read()).render(config)
# os.system(rendered_script_file)