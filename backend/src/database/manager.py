import typing

import fastapi
import sqlalchemy
import sqlmodel

FILENAME = "database.db"
DATABASE_URL = f"sqlite:///{FILENAME}"

engine: sqlalchemy.Engine | None = None


def connect():
    global engine
    engine = sqlmodel.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def init_schema():
    if engine is None:
        connect()

    from . import models  # noqa: F401

    sqlmodel.SQLModel.metadata.create_all(engine)  # pyright: ignore[reportArgumentType]


def get_session():
    if engine is None:
        connect()

    with sqlmodel.Session(engine) as session:
        yield session


SessionDep = typing.Annotated[sqlmodel.Session, fastapi.Depends(get_session)]
