from app.repositories.ticket_repository import TicketRepository
import uvicorn
import pyrebase
from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request

import firebase_admin
from firebase_admin import credentials, auth
from .models import LoginSchema, SignUpSchema, User

app = FastAPI(
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

if not firebase_admin._apps:
    cred = credentials.Certificate("data/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

firebaseConfig = {
    "apiKey": "AIzaSyBs03mz0xyJp96CPxmb4b2Qz7OdqFU7uIQ",
    "authDomain": "awsomeqa-auth.firebaseapp.com",
    "projectId": "awsomeqa-auth",
    "storageBucket": "awsomeqa-auth.appspot.com",
    "messagingSenderId": "599376439441",
    "appId": "1:599376439441:web:0a6169d4d12d9dbff1b730",
    "databaseURL": ""
}

firebase = pyrebase.initialize_app(firebaseConfig)

TICKET_FILEPATH = "data/awesome_tickets.json"
ticket_repository = TicketRepository(filepath=TICKET_FILEPATH)


@app.post("/signup")
async def create_an_account(user_data: SignUpSchema):
    email = user_data.email
    password = user_data.password

    try:
        # TODO: Add verification to accept only emails with awsomeQa domain name
        #  ( or add role system authentication )
        user = auth.create_user(
            email=email,
            password=password,
        )

        return JSONResponse(content={"message": f"User account created successfully for user {user.uid}"},
                            status_code=201
                            )
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=400,
            detail=f"Account already created for the email {email}"
        )


@app.post("/login")
async def create_access_token(user_data: LoginSchema):
    email = user_data.email
    password = user_data.password

    try:
        user = firebase.auth().sign_in_with_email_and_password(
            email=email,
            password=password
        )

        token = user['idToken']

        return JSONResponse(
            content={"token": token},
            status_code=200
        )

    except:
        raise HTTPException(
            status_code=400,
            detail="Invalid Credentials"
        )


@app.post('/ping')
async def validate_token(request: Request):
    headers = request.headers
    jwt = headers.get('authorization')

    user = auth.verify_id_token(jwt)

    return user


@app.get("/tickets")
async def get_tickets(
        user: User = Depends(validate_token),
        ticket_repository: TicketRepository = Depends(lambda: ticket_repository),
):
    try:
        tickets = ticket_repository.get_tickets()
        return JSONResponse(tickets, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unauthorized")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
