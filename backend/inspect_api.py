import sys
try:
    from gradio_client import Client
    print("gradio_client is installed")
except ImportError:
    print("gradio_client is not installed")
    sys.exit(1)

try:
    client = Client("zhengchong/CatVTON")
    print("Successfully connected to zhengchong/CatVTON")
    client.view_api()
except Exception as e:
    print(f"Error: {e}")
