from fastapi import APIRouter, UploadFile, File

from services.image_service import save_image

router = APIRouter(
    prefix="/upload",
    tags=["Image Upload"]
)

@router.post("/image")
def upload_image(
    file: UploadFile = File(...)
):

    path = save_image(file)

    return {
        "message": "Image uploaded successfully",
        "path": path
    }