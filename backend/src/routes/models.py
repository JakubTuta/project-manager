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


class ProjectResponseData(pydantic.BaseModel):
    name: str
    path: str


class FetchProjectsResponse(APIResponse):
    data: list[ProjectResponseData] = []


class ProjectResponse(APIResponse):
    data: ProjectResponseData | None = None
