from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class Outlet(Base):
    __tablename__ = "outlets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    manager_id = Column(Integer, ForeignKey("users.id"))
    manager = relationship("User", back_populates="outlets")
    updates = relationship("Update", back_populates="outlet")
    feedback = relationship("Feedback", back_populates="outlet")
    files = relationship("File", back_populates="outlet")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String, default="manager")
    outlets = relationship("Outlet", back_populates="manager")

class Period(Base):
    __tablename__ = "periods"
    __table_args__ = (UniqueConstraint("month", "year"),)
    id = Column(Integer, primary_key=True, index=True)
    month = Column(Integer)
    year = Column(Integer)
    updates = relationship("Update", back_populates="period")

class KPI(Base):
    __tablename__ = "kpis"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

class Update(Base):
    __tablename__ = "updates"
    id = Column(Integer, primary_key=True, index=True)
    outlet_id = Column(Integer, ForeignKey("outlets.id"))
    period_id = Column(Integer, ForeignKey("periods.id"))
    kpi_id = Column(Integer, ForeignKey("kpis.id"))
    value = Column(Float)
    note = Column(Text)

    outlet = relationship("Outlet", back_populates="updates")
    period = relationship("Period", back_populates="updates")
    kpi = relationship("KPI")

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    outlet_id = Column(Integer, ForeignKey("outlets.id"))
    period_id = Column(Integer, ForeignKey("periods.id"))
    text = Column(Text)

    outlet = relationship("Outlet", back_populates="feedback")
    period = relationship("Period")

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    outlet_id = Column(Integer, ForeignKey("outlets.id"))
    period_id = Column(Integer, ForeignKey("periods.id"))
    path = Column(String)

    outlet = relationship("Outlet", back_populates="files")
    period = relationship("Period")
