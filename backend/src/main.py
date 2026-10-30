import contextlib
import pathlib
import uuid

import dotenv
import fastapi
import fastapi.middleware.cors
import fastapi.responses
import path
import uvicorn

from src.database import manager as db_manager

from . import routes

token: str | None = None


def save_token():
    current_dir = pathlib.Path(__file__).parent.resolve()
    dir_path = rf"{current_dir.parent.parent}\frontend"
    file_path = rf"{dir_path}\.env"

    path.Path(file_path).touch()

    global token

    if token := dotenv.get_key(file_path, "VITE_TOKEN"):
        return

    token = str(uuid.uuid4())
    dotenv.set_key(file_path, "VITE_TOKEN", token)


@contextlib.asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    db_manager.connect()
    db_manager.init_schema()
    save_token()

    yield


app = fastapi.FastAPI(
    title="Project Manager",
    version="0.0.1",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)


@app.middleware("http")
async def check_token_header(request: fastapi.Request, call_next):
    if (request_token := request.headers.get("X-APP-TOKEN")) is None or request_token != token:
        error_response = routes.models.APIResponse(
            success=False,
            error=routes.models.ErrorDetail(
                code=401,
                message="X-APP-TOKEN header is missing or is incorrect",
            ),
        )
        return fastapi.responses.JSONResponse(
            status_code=401,
            content=error_response.model_dump(mode="json"),
        )

    return await call_next(request)


app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.projects_router)
app.include_router(routes.commands_router)


def server_dev():
    uvicorn.run("src.main:app", reload=True)


def server_prod():
    uvicorn.run("src.main:app")
