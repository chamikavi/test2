from pydantic import BaseModel
from typing import Optional

class OutletBase(BaseModel):
    name: str

class OutletCreate(OutletBase):
    pass

class Outlet(OutletBase):
    id: int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True


class PeriodBase(BaseModel):
    month: int
    year: int


class PeriodCreate(PeriodBase):
    pass


class Period(PeriodBase):
    id: int

    class Config:
        orm_mode = True


class KPIBase(BaseModel):
    name: str


class KPICreate(KPIBase):
    pass


class KPI(KPIBase):
    id: int

    class Config:
        orm_mode = True


class UpdateBase(BaseModel):
    outlet_id: int
    period_id: int
    kpi_id: int
    value: float
    note: Optional[str] = None


class UpdateCreate(UpdateBase):
    pass


class Update(UpdateBase):
    id: int

    class Config:
        orm_mode = True


class FeedbackBase(BaseModel):
    outlet_id: int
    period_id: int
    text: str


class FeedbackCreate(FeedbackBase):
    pass


class Feedback(FeedbackBase):
    id: int

    class Config:
        orm_mode = True


class FileBase(BaseModel):
    outlet_id: int
    period_id: int
    path: str


class FileCreate(FileBase):
    pass


class File(FileBase):
    id: int

    class Config:
        orm_mode = True
