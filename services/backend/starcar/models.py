from typing import List, Optional
import secrets
import datetime as dt
from datetime import timedelta, timezone

from sqlalchemy import ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.hybrid import hybrid_property
# from flask_login import UserMixin

from starcar import db, bcrypt


def datetime_now():
    return dt.datetime.now(dt.UTC)


class SensorData(db.Model):
    __tablename__ = "sensor_data"

    data_id: Mapped[int] = mapped_column(ForeignKey("raw_data.id"), primary_key=True)

    time: Mapped[int] = mapped_column(primary_key=True)

    acceleration_x: Mapped[float] = mapped_column()
    acceleration_y: Mapped[float] = mapped_column()
    acceleration_z: Mapped[float] = mapped_column()

    gauge_1: Mapped[int] = mapped_column()
    gauge_2: Mapped[int] = mapped_column()

    def to_dict(self):
        return {
            "time": self.time, "acceleration": {
                "x": self.acceleration_x,
                "y": self.acceleration_y,
                "z": self.acceleration_z
            },
            "gauge": {
                "gauge_1": self.gauge_1,
                "gauge_2": self.gauge_2
            }
        }


class TelemetryData(db.Model):
    data_id: Mapped[int] = mapped_column(ForeignKey("raw_data.id"), primary_key=True)

    time: Mapped[int] = mapped_column(primary_key=True)
    latt: Mapped[float] = mapped_column()
    lng: Mapped[float] = mapped_column()

    dist: Mapped[float] = mapped_column()

    def to_dict(self):
        d = {"time": self.time, "latt": self.latt, "lng": self.lng}
        if self.dist is not None:
            d["distance"] = self.dist
        
        return d


class RawData(db.Model):
    __tablename__ = "raw_data"
    id: Mapped[int] = mapped_column(primary_key=True)

    mission_id: Mapped[int] = mapped_column(ForeignKey("mission.id"))
    mission: Mapped["Mission"] = relationship(back_populates="data")

    sensor: Mapped[List["SensorData"]] = relationship(cascade="all, delete")
    telemetry: Mapped[List["TelemetryData"]] = relationship(
        cascade="all, delete"
    )

    @hybrid_property
    def total_dist(self):
        return sum(telem.dist for telem in self.telemetry)

    @total_dist.expression
    def total_dist(cls):
        return (
            db.select([func.sum(TelemetryData.dist)]).
            where(TelemetryData.data_id == cls.id).
            label('total_dist')
        )


class Analysis(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    mission_id: Mapped[int] = mapped_column(ForeignKey("mission.id"))
    mission: Mapped["Mission"] = relationship(back_populates="analysis")
    
    name: Mapped[str] = mapped_column(String(200))
    date_start: Mapped[dt.datetime] = mapped_column()
    date_end: Mapped[Optional[dt.datetime]] = mapped_column()
    health_status: Mapped[float] = mapped_column()
    is_pending: Mapped[bool] = mapped_column(default=True)

    def to_dict(self):
        return {
            "name": self.name,
            "health_status": self.health_status,
            "is_pending": self.is_pending
        }

    __mapper_args__ = {
        "polymorphic_identity": "Analysis",
        "polymorphic_on": "name",
    }


# This is a test analysis table
class AnalysisOne(Analysis):
    id: Mapped[int] = mapped_column(ForeignKey("analysis.id"), primary_key=True)

    gauge_1_average: Mapped[float] = mapped_column()
    gauge_2_average: Mapped[float] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": "Analysis 1",
    }


# Currently not used Table
class AnomalyAnalysis(Analysis):
    id: Mapped[int] = mapped_column(ForeignKey("analysis.id"), primary_key=True)

    num_anomalies: Mapped[int] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": "Analysis Anomaly",
    }


# Currently not used Table
class StressAnalysis(Analysis):
    id: Mapped[int] = mapped_column(ForeignKey("analysis.id"), primary_key=True)

    coefficent: Mapped[float] = mapped_column()

    __mapper_args__ = {
        "polymorphic_identity": "Analysis Stress",
    }


class Mission(db.Model):
    __tablename__ = "mission"
    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[Optional[str]] = mapped_column(String(200))
    date_start: Mapped[dt.datetime] = mapped_column()
    date_end: Mapped[Optional[dt.datetime]] = mapped_column()

    data: Mapped["RawData"] = relationship(
        back_populates="mission", cascade="all, delete"
    )
    analysis: Mapped[List["Analysis"]] = relationship(
        back_populates="mission", cascade="all, delete"
    )

    is_pending: Mapped[bool] = mapped_column(default=True)

    def to_dict(self):
        dict_vars = [
            ("id", self.id), ("name", self.name), 
            ("date_start", self.date_start.replace(tzinfo=timezone.utc).isoformat()), 
            ("is_pending", self.is_pending),
            ("total_dist", self.data.total_dist)
        ]

        d = {k: v for k, v in dict_vars if v is not None}
        d["analysis"] = [a.to_dict() for a in self.analysis]
        if self.date_end is not None:
            d["date_end"] = self.date_end.replace(tzinfo=timezone.utc).isoformat()

        return d


class SitePassword(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    password: Mapped[str] = mapped_column()
    key: Mapped[str] = mapped_column(String(66))

    def __init__(self, password, **kw):
        self.set_password(password)
        super().__init__(**kw)

    def set_password(self, password):
        self.key = secrets.token_hex(8)
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def validate(self, password):
        return bcrypt.check_password_hash(self.password, password)


class APIKey(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column()
    enc_value: Mapped[str] = mapped_column(String(64))
    description: Mapped[Optional[str]] = mapped_column()

    date_created: Mapped[dt.datetime] = mapped_column()
    date_expire: Mapped[Optional[dt.datetime]] = mapped_column()

    hidden: Mapped[bool] = mapped_column()

    def is_expired(self):
        return (
            datetime_now() > self.date_expire.replace(tzinfo=timezone.utc) 
            if self.date_expire else False
        )

    def validate(self, value):
        return (
            self.is_expired() is False and 
            bcrypt.check_password_hash(self.enc_value, value)
        )

    def exprire_key(self):
        self.date_expire = datetime_now()

    def regenerate_key(self, exp_days=None):
        pass

    @staticmethod
    def generate(name, exp_days=None, description=None, hidden=False):
        key_val = secrets.token_hex(32)
        key_hash = bcrypt.generate_password_hash(key_val).decode('utf-8')
        now = datetime_now()
        exp_date = (
            now + timedelta(days=exp_days) if exp_days is not None else None
        )
        
        api_key = APIKey(
            name=name, enc_value=key_hash, description=description,
            date_created=now, date_expire=exp_date, hidden=hidden
        )

        db.session.add(api_key)
        db.session.flush()

        key_val = f'{str(api_key.id)}_{key_val}'

        return api_key, key_val
