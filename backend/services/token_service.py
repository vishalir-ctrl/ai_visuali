from datetime import datetime, timedelta

from jose import jwt


SECRET_KEY = "AI_VISUALIZER_SECRET_KEY_2026"

ALGORITHM = "HS256"



def create_token(data:dict):

    payload = data.copy()


    expire = datetime.utcnow() + timedelta(days=1)


    payload.update({

        "exp": expire

    })


    token = jwt.encode(

        payload,

        SECRET_KEY,

        algorithm=ALGORITHM

    )


    return token