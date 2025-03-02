import functools
import json
import datetime as dt
from datetime import timezone

from sqlalchemy import exc
from flask_socketio import emit, disconnect

from starcar import socketio, db
from starcar.models import (
    Mission, StrainGauge, Acceleration, SensorData, TelemetryData
)
from starcar.utils import get_telem_dist, get_date_string
from starcar.routes import is_authorized


def datetime_now():
    return dt.datetime.now(dt.UTC)


def add_sensor_data(mission, data):
    for d in data:
        accel = Acceleration(x=d["accelX"], y=d["accelY"], z=d["accelZ"])
        gauge = StrainGauge(gauge_1=d["gauge1"], gauge_2=d["gauge2"])
        
        sensor = SensorData(
            time=d["timeStamp"], acceleration=accel, strain_gauge=gauge
        )
        mission.data.sensor.append(sensor)


def add_telemetry_data(mission, data):
    last_telem = (
        mission.data.telemetry[-1] if len(mission.data.telemetry) > 0 else None
    )

    for d in data:
        dist = 0
        
        if last_telem is not None:
            dist = get_telem_dist(
                last_telem.latt, last_telem.lng, d["latt"], d["lng"]
            )

        telemetry = TelemetryData(
            time=d["timeStamp"], latt=d["latt"], lng=d["lng"], dist=dist
        )
        print(f'Distance traveled: {dist}km')

        mission.data.telemetry.append(telemetry)
        last_telem = telemetry


def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not is_authorized():
            disconnect()
        else:
            return f(*args, **kwargs)
    return wrapped


@socketio.on('connect')
@authenticated_only
def connect_handler():
    print("Connected!")


@socketio.on("stream-data")
@authenticated_only
def stream_data(json_data):
    data = json.loads(str(json_data))

    try:
        mission = db.session.get(Mission, data["missionID"])
    except exc.SQLAlchemyError:
        emit("error", f'Mission {data["missionID"]} does not exist!')
        return

    if mission.is_pending is False:
        emit(
            "error", 
            f'Mission {data["missionID"]} has already finished recording!'
        )
        return

    print(f'Received data for mission: {data["missionID"]}')

    add_sensor_data(mission, data["sensorData"])
    add_telemetry_data(mission, data["telemetryData"])

    db.session.commit()

    return "OK"


@socketio.on("stop-stream")
@authenticated_only
def stop_stream(json_data):
    data = json.loads(str(json_data))

    try:
        mission = db.session.get(Mission, data["missionID"])
    except exc.SQLAlchemyError:
        emit("error", f'Mission {data["missionID"]} does not exist!')
        return

    mission.is_pending = False
    mission.date_end = datetime_now()
    mission.name = get_date_string(mission.date_start)

    # duration = dt.timedelta(
    #     (mission.date_end - mission.date_start.replace(tzinfo=timezone.utc))
    #     .total_seconds()
    # )

    # TODO: Start analysis here
    db.session.commit()

    # return "OK", duration.hours, duration.minutes
    return "OK"
