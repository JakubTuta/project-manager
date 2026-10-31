import fastapi
import sqlmodel

from src.database import manager as db_manager
from src.database import models as db_models

from . import models

router = fastapi.APIRouter(prefix="/api")


@router.post("/commands", response_model=models.APIResponse)
async def create_command(
    data: models.CommandRequest,
    db_session: db_manager.SessionDep,
) -> models.APIResponse:
    if (
        project := db_session.exec(
            sqlmodel.select(db_models.Project).where(db_models.Project.name == data.project_name)
        ).first()
    ) is None:
        return models.ProjectResponse(
            success=False,
            error=models.ErrorDetail(
                code=404,
                message="Project not found",
                details={"name": data.project_name},
            ),
        )

    db_command = db_models.Commands(project_id=project.id, **data.model_dump())
    db_session.add(db_command)
    db_session.commit()
    db_session.refresh(db_command)

    return models.CreateCommandResponse(
        success=True,
        data=models.CommandData(**data.model_dump()),
    )


@router.get("/commands/{project_name}", response_model=models.APIResponse)
async def fetch_commands(
    project_name: str,
    db_session: db_manager.SessionDep,
) -> models.APIResponse:
    if (
        project := db_session.exec(
            sqlmodel.select(db_models.Project).where(db_models.Project.name == project_name)
        ).first()
    ) is None:
        return models.ProjectResponse(
            success=False,
            error=models.ErrorDetail(
                code=404,
                message="Project not found",
                details={"name": project_name},
            ),
        )

    commands = db_session.exec(
        sqlmodel.select(db_models.Commands).where(db_models.Commands.project_id == project.id)
    ).all()

    return models.FetchCommandsResponse(
        success=True,
        data=[
            models.CommandData(
                project_name=project_name,
                **command.model_dump(),
            )
            for command in commands
        ],
    )


@router.delete("/commands/{id}", response_model=models.APIResponse)
async def delete_commend(id: int, db_session: db_manager.SessionDep) -> models.APIResponse:
    if (command := db_session.get(db_models.Commands, id)) is None:
        return models.APIResponse(
            success=False,
            error=models.ErrorDetail(
                code=404,
                message="Command not found",
                details={"id": id},
            ),
        )

    db_session.delete(command)
    db_session.commit()

    return models.APIResponse(success=True)
