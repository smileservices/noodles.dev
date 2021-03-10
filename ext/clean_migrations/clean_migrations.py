import os

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