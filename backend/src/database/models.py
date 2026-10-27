import sqlmodel


class Project(sqlmodel.SQLModel, table=True):
    id: int | None = sqlmodel.Field(default=None, primary_key=True)
    name: str = sqlmodel.Field(sa_column=sqlmodel.Column("name", sqlmodel.String, unique=True))
    path: str


class Commands(sqlmodel.SQLModel, table=True):
    id: int | None = sqlmodel.Field(default=None, primary_key=True)
    project_id: int | None = sqlmodel.Field(default=None, foreign_key="project.id")
    label: str
    arguments: list[str] = sqlmodel.Field(sa_column=sqlmodel.Column(sqlmodel.JSON))

    class Config:
        arbitrary_types_allowed = True
