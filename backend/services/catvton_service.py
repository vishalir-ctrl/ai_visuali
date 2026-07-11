import os
import uuid
import httpx

from PIL import Image
from gradio_client import Client, handle_file


OUTPUT_DIR = "outputs"
UPLOAD_DIR = "uploads"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)


client = Client(
    "zhengchong/CatVTON",
    httpx_kwargs={
        "timeout": httpx.Timeout(
            connect=60,
            read=900,
            write=900,
            pool=60
        )
    }
)


print("CatVTON Loaded")



def convert_image(path):

    img = Image.open(path)

    print("Original mode:", img.mode)

    img = img.convert("RGB")

    new_path = (
        UPLOAD_DIR
        + "/"
        + str(uuid.uuid4())
        + ".png"
    )

    img.save(new_path)

    print("Converted:", new_path)

    return new_path





def create_editor_data(person_result, mask_path=None):

    layers_list = []
    if mask_path:
        layers_list.append({
            "path": mask_path,
            "url": None,
            "size": None,
            "orig_name": "mask.png",
            "mime_type": "image/png",
            "is_stream": False,
            "meta": {
                "_type": "gradio.FileData"
            }
        })

    editor = {

        "background": {
            "path": person_result["background"],
            "url": None,
            "size": None,
            "orig_name": "person.png",
            "mime_type": "image/png",
            "is_stream": False,
            "meta": {
                "_type": "gradio.FileData"
            }
        },


        "layers": layers_list,


        "composite": {
            "path": person_result["composite"],
            "url": None,
            "size": None,
            "orig_name": "person.png",
            "mime_type": "image/png",
            "is_stream": False,
            "meta": {
                "_type": "gradio.FileData"
            }
        },


        "id": None
    }


    print(editor)

    return editor





def generate_tryon(person_path, cloth_path):


    person_path = convert_image(person_path)

    cloth_path = convert_image(cloth_path)



    print("Sending to CatVTON")



    # STEP 1 PERSON IMAGE

    person_result = client.predict(

        image_path=handle_file(person_path),

        api_name="/person_example_fn"

    )


    print("PERSON RESULT")

    print(person_result)


    # Create dummy black mask for auto-masking to bypass HuggingFace Space IndexError
    mask_path = None
    try:
        img = Image.open(person_path)
        black_mask = Image.new("L", img.size, 0)
        mask_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_mask.png")
        black_mask.save(mask_path)
        print(f"Created black mask layer at {mask_path}")
    except Exception as mask_err:
        print(f"Failed to create black mask layer: {mask_err}")

    editor_data = create_editor_data(
        person_result,
        mask_path=mask_path
    )


    print("EDITOR READY")




    # STEP 2 TRYON

    print("Sending editor...")
    print(editor_data)

    print("Sending cloth...")
    print(cloth_path)
    
    result_path = None
    try:
        result = client.predict(

            person_image=editor_data,

            cloth_image=handle_file(cloth_path),

            cloth_type="upper",

            num_inference_steps=30,

            guidance_scale=2.5,

            seed=42,

            show_type="result only",

            api_name="/submit_function"

        )



        print("RESULT")

        print(result)

        if isinstance(result, dict):
            result_path = result.get("path")
        else:
            result_path = result

    finally:
        # Clean up mask path
        if mask_path and os.path.exists(mask_path):
            try:
                os.remove(mask_path)
                print(f"Removed temp mask layer {mask_path}")
            except Exception as e:
                print(f"Failed to remove temp mask layer: {e}")

    if not result_path:
        raise Exception("Virtual try-on prediction failed or returned empty result path.")

    output = (

        OUTPUT_DIR
        + "/"
        + str(uuid.uuid4())
        + ".png"

    )


    img = Image.open(result_path)

    img.convert("RGB").save(output)



    print("FINAL:",output)


    return output