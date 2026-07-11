import os
import sys
from services.catvton_service import generate_tryon

person = "uploads/trisha.jpeg"
cloth = "uploads/trisha.jpeg"

if not os.path.exists(person):
    uploads = [f for f in os.listdir("uploads") if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if uploads:
        person = os.path.join("uploads", uploads[0])
        cloth = os.path.join("uploads", uploads[0])
    else:
        print("No images found in uploads.")
        sys.exit(1)

print(f"Testing generate_tryon with person={person}, cloth={cloth}")
try:
    res = generate_tryon(person, cloth)
    print(f"Success! Output saved to: {res}")
except Exception as e:
    print(f"Failed with exception: {e}")
    import traceback
    traceback.print_exc()
