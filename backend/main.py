from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import Base, engine

from routes import auth
from routes import upload
from routes import tryon


# Create Database Tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI VISUALIZER API"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount(
    "/outputs",
    StaticFiles(directory="outputs"),
    name="outputs"
)

# Home Route
@app.get("/")
def home():
    return {
        "project": "AI VISUALIZER",
        "message": "Backend API Running Successfully"
    }


# Routers
app.include_router(auth.router)
app.include_router(upload.router)
app.include_router(tryon.router)