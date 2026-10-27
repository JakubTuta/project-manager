import contextlib

import fastapi
import fastapi.middleware.cors
import uvicorn

from src.database import manager as db_manager

from . import routes


@contextlib.asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    db_manager.connect()
    db_manager.init_schema()

    yield


app = fastapi.FastAPI(
    title="Project Manager",
    version="0.0.1",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.projects_router)


def server_dev():
    uvicorn.run("src.main:app", reload=True)


def server_prod():
    uvicorn.run("src.main:app")
