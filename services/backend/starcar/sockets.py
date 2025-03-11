import functools
import json
import datetime as dt
from datetime import timezone
import zoneinfo as zi

from sqlalchemy import exc
from flask_socketio import emit, disconnect, send

from starcar import socketio, db
from starcar.models import (
    Mission, SensorData, TelemetryData, RawData
)
from starcar.utils import get_telem_dist, get_date_string
from starcar.routes import is_authorized


def datetime_now():
    return dt.datetime.now(dt.UTC)


def add_sensor_data(mission, data):
    for d in data:
        mission.data.sensor.append(SensorData(
            time=d["timeStamp"], acceleration_x=d["accelX"], 
            acceleration_y=d["accelY"], acceleration_z=d["accelZ"], 
            gauge_1=d["gauge1"], gauge_2=d["gauge2"]
        ))


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


def create_new_mission() -> Mission:
    mission = Mission(
        name="Pending mission", date_start=datetime_now(), data=RawData()
    )
    db.session.add(mission)
    db.session.commit()

    return mission


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
    pass


@socketio.on("create-mission")
@authenticated_only
def crreate_mission():
    mission = create_new_mission()
    return mission.id


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

    if data is None or data.get("missionID") is None:
        emit("error", 'Unable to get mission ID')
        return

    try:
        mission = db.session.get(Mission, data["missionID"])
    except exc.SQLAlchemyError:
        emit("error", f'Mission {data["missionID"]} does not exist!')
        return

    mission.is_pending = False
    mission.date_end = datetime_now()

    # TEMP fix: Assuming client is in the central time zone, in future get time
    # zone from client
    start_local_time = mission.date_start.replace(
        tzinfo=timezone.utc
    ).astimezone(zi.ZoneInfo("US/Central"))
    mission.name = get_date_string(start_local_time)

    # duration = dt.timedelta(
    #     (mission.date_end - mission.date_start.replace(tzinfo=timezone.utc))
    #     .total_seconds()
    # )

    # TODO: Start analysis here
    db.session.commit()

    # return "OK", duration.hours, duration.minutes
    return "OK"
