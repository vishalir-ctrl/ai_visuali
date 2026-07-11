import os
from PIL import Image

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

def save_image(file):

    filename = file.filename

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    image = Image.open(file.file)

    image.save(file_path)

    return file_path