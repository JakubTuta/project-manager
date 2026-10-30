import typing

import pydantic


class ErrorDetail(pydantic.BaseModel):
    code: int
    message: str
    details: dict[str, typing.Any] = pydantic.Field(default_factory=dict)


class APIResponse(pydantic.BaseModel):
    success: bool
    data: typing.Any | None = None
    error: ErrorDetail | None = None

    model_config = pydantic.ConfigDict(
        json_schema_extra={"example": {"success": True, "data": {"key": "value"}, "error": None}}
    )


# PROJECTS


class ProjectData(pydantic.BaseModel):
    id: int
    name: str
    path: str


class FetchProjectsResponse(APIResponse):
    data: list[ProjectData] = []


class ProjectResponse(APIResponse):
    data: ProjectData | None = None


# COMMANDS

command_labels = typing.Literal["build", "run", "stop"]


class CommandRequest(pydantic.BaseModel):
    project_name: str
    label: command_labels
    command: str


class CommandData(pydantic.BaseModel):
    id: int
    project_name: str
    label: command_labels
    command: str


class CreateCommandResponse(APIResponse):
    data: CommandData | None = None


class FetchCommandsResponse(APIResponse):
    data: list[CommandData] = []
