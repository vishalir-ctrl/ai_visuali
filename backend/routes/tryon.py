import os
import uuid

from fastapi import APIRouter, UploadFile, File

from services.catvton_service import generate_tryon

router = APIRouter(
    prefix="/tryon",
    tags=["Virtual Try-On"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/")
async def virtual_tryon(
    person: UploadFile = File(...),
    cloth: UploadFile = File(...)
):

    person_path = os.path.join(
        UPLOAD_FOLDER,
        f"{uuid.uuid4().hex}_{person.filename}"
    )

    cloth_path = os.path.join(
        UPLOAD_FOLDER,
        f"{uuid.uuid4().hex}_{cloth.filename}"
    )

    with open(person_path, "wb") as f:
        f.write(await person.read())

    with open(cloth_path, "wb") as f:
        f.write(await cloth.read())

    output_path = generate_tryon(
        person_path,
        cloth_path
    )

    return {
        "success": True,
        "output": output_path
    }