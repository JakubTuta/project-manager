import fastapi
import sqlalchemy.exc
import sqlmodel

from src.database import manager as db_manager
from src.database import models as db_models

from . import models

router = fastapi.APIRouter(prefix="/api")


@router.post("/projects", response_model=models.APIResponse)
async def create_project(
    project: db_models.Project,
    db_session: db_manager.SessionDep,
) -> models.APIResponse:
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

    return models.APIResponse(
        success=True,
        data=project,
    )


@router.get("/projects", response_model=models.FetchProjectsResponse)
async def fetch_projects(db_session: db_manager.SessionDep) -> models.FetchProjectsResponse:
    projects = db_session.exec(sqlmodel.select(db_models.Project)).all()

    return models.FetchProjectsResponse(success=True, data=projects)  # pyright: ignore[reportArgumentType]
