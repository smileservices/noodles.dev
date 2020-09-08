from django.db.backends.postgresql import base
import tsvector_field

class DatabaseWrapper(base.DatabaseWrapper):
    SchemaEditorClass = tsvector_field.DatabaseSchemaEditor