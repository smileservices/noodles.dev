from tempfile import NamedTemporaryFile
from django.core.files import File


def save_file_to_field(field, file_name, raw_content):
    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(raw_content)
    field.save(
        file_name,
        File(img_temp)
    )
    img_temp.flush()
