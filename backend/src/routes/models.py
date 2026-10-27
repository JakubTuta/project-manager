import typing

import pydantic

from src.database import models as db_models


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


class FetchProjectsResponse(APIResponse):
    data: list[db_models.Project] = []
