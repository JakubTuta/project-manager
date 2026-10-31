import datetime

import fastapi
import path
import pytz
import sqlalchemy.exc
import sqlmodel

from src.database import manager as db_manager
from src.database import models as db_models

from . import models

router = fastapi.APIRouter(prefix="/api")


@router.post("/projects", response_model=models.APIResponse)
async def create_project(
    project: models.ProjectData,
    db_session: db_manager.SessionDep,
) -> models.APIResponse:
    if not path.Path(project.path).exists():
        return models.APIResponse(
            success=False,
            error=models.ErrorDetail(
                code=400,
                message="Project directory path doesn't exist",
                details={"path": project.path},
            ),
        )
    if not path.Path(project.path).is_dir():
        return models.APIResponse(
            success=False,
            error=models.ErrorDetail(
                code=400,
                message="Provide path to the directory",
                details={"path": project.path},
            ),
        )

    try:
        db_project = db_models.Project(**project.model_dump())
        db_session.add(db_project)
        db_session.commit()
        db_session.refresh(db_project)
    except sqlalchemy.exc.IntegrityError:
        return models.APIResponse(
            success=False,
            error=models.ErrorDetail(
                code=401,
                message="Project with that name already exists",
                details={"name": project.name},
            ),
        )

    return models.ProjectResponse(
        success=True,
        data=models.ProjectData(
            id=db_project.id,
            name=project.name,
            path=project.path,
        ),
    )


@router.get("/projects", response_model=models.APIResponse)
async def fetch_projects(db_session: db_manager.SessionDep) -> models.APIResponse:
    projects = db_session.exec(
        sqlmodel.select(db_models.Project).order_by(
            sqlmodel.col(db_models.Project.last_fetched).desc()
        )
    ).all()

    return models.FetchProjectsResponse(
        success=True,
        data=[
            models.ProjectData(
                id=project.id,
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
            success=False,
            error=models.ErrorDetail(
                code=404,
                message="Project not found",
                details={"name": name},
            ),
        )

    project.last_fetched = datetime.datetime.now(tz=pytz.timezone("Europe/Warsaw"))
    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)

    return models.ProjectResponse(
        success=True,
        data=models.ProjectData(
            id=project.id,
            name=project.name,
            path=project.path,
        ),
    )


@router.delete("/projects/{id}", response_model=models.APIResponse)
async def delete_project(id: int, db_session: db_manager.SessionDep) -> models.APIResponse:
    if (project := db_session.get(db_models.Project, id)) is None:
        return models.APIResponse(
            success=False,
            error=models.ErrorDetail(
                code=404,
                message="Project not found",
                details={"id": id},
            ),
        )

    commands = db_session.exec(
        sqlmodel.select(db_models.Commands).where(db_models.Commands.project_id == project.id)
    ).all()

    db_session.delete_all(commands)
    db_session.delete(project)
    db_session.commit()

    return models.APIResponse(success=True)
