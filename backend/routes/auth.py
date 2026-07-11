from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session


from database import get_db

from models import User

from schemas import UserCreate, UserLogin

from services.auth_service import (
    hash_password,
    verify_password
)

from services.token_service import create_token



router = APIRouter(

    prefix="/auth",

    tags=["Authentication"]

)



@router.post("/register")
def register(

    user:UserCreate,

    db:Session = Depends(get_db)

):


    existing_user = db.query(User).filter(

        User.email == user.email

    ).first()



    if existing_user:

        raise HTTPException(

            status_code=400,

            detail="Email already registered"

        )



    new_user = User(

        username=user.username,

        email=user.email,

        password=hash_password(user.password)

    )


    db.add(new_user)

    db.commit()

    db.refresh(new_user)



    return {

        "message":"User registered successfully",

        "user_id":new_user.id

    }





@router.post("/login")
def login(

    user:UserLogin,

    db:Session = Depends(get_db)

):


    existing_user = db.query(User).filter(

        User.email == user.email

    ).first()



    if not existing_user:

        raise HTTPException(

            status_code=404,

            detail="User not found"

        )



    if not verify_password(

        user.password,

        existing_user.password

    ):

        raise HTTPException(

            status_code=401,

            detail="Invalid password"

        )



    token=create_token({

        "user_id":existing_user.id,

        "email":existing_user.email

    })



    return {

        "access_token":token,

        "token_type":"bearer"

    }