import datetime

import fastapi
import pytz
import sqlalchemy.exc
import sqlmodel

from src.database import manager as db_manager
from src.database import models as db_models

from . import models

router = fastapi.APIRouter(prefix="/api")


@router.post("/projects", response_model=models.ProjectResponse | models.APIResponse)
async def create_project(
    project: db_models.Project,
    db_session: db_manager.SessionDep,
) -> models.ProjectResponse | models.APIResponse:
    try:
        db_session.add(project)
        db_session.commit()
        db_session.refresh(project)
    except sqlalchemy.exc.IntegrityError:
        return models.APIResponse(
            success=False,
            error=models.ErrorDetail(
                code=401,
                message="Project already exists",
            ),
        )

    return models.ProjectResponse(
        success=True,
        data=models.ProjectResponseData(
            name=project.name,
            path=project.path,
        ),
    )


@router.get("/projects", response_model=models.FetchProjectsResponse)
async def fetch_projects(db_session: db_manager.SessionDep) -> models.FetchProjectsResponse:
    projects = db_session.exec(
        sqlmodel.select(db_models.Project).order_by(
            sqlmodel.col(db_models.Project.last_fetched).desc()
        )
    ).all()

    return models.FetchProjectsResponse(
        success=True,
        data=[
            models.ProjectResponseData(
                name=project.name,
                path=project.path,
            )
            for project in projects
        ],
    )


@router.get("/projects/{name}", response_model=models.ProjectResponse)
async def fetch_project(name: str, db_session: db_manager.SessionDep) -> models.ProjectResponse:
    project = db_session.exec(
        sqlmodel.select(db_models.Project).where(db_models.Project.name == name)
    ).first()

    if project is None:
        return models.ProjectResponse(
            success=False, error=models.ErrorDetail(code=404, message="Project not found")
        )

    project.last_fetched = datetime.datetime.now(tz=pytz.timezone("Europe/Warsaw"))
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)

    return models.ProjectResponse(
        success=True,
        data=models.ProjectResponseData(
            name=project.name,
            path=project.path,
        ),
    )
