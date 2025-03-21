import datetime as dt

from flask import jsonify, request
from marshmallow import Schema, fields, validate, ValidationError
from jwt.exceptions import InvalidTokenError
from sqlalchemy import and_

from starcar import app, db, flask_jwt
from starcar.models import (
    Mission, RawData, APIKey, SitePassword, SensorData, TelemetryData, 
    AnalysisOne
)

PUBLIC_ROUTES = ["index", "login"]


def datetime_now():
    return dt.datetime.now(dt.UTC)


@app.route('/')
def index():
    return (
        """
        <p>API for Starcar. See documentation for full list of API usage.</p>
        """, 200
    )


@app.route('/mission/create', methods=['POST'])
def new_mission():
    mission = Mission(
        name="Pending mission", date_start=datetime_now(), data=RawData()
    )
    db.session.add(mission)
    db.session.commit()

    return ({"missionID": mission.id}, 200)


@app.route('/get-missions', methods=['GET'])
def get_missions():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    missions_page = db.paginate(
        db.select(Mission).order_by(Mission.date_start), 
        page=page, per_page=per_page
    )

    result = {
        'items': [item.to_dict() for item in missions_page.items],
        'total_items': missions_page.total,
        'total_pages': missions_page.pages,
        'current_page': missions_page.page,
        'has_next': missions_page.has_next,
        'has_prev': missions_page.has_prev
    }

    return jsonify(result)


@app.route('/mission/<int:mission_id>', methods=['GET'])
def get_mission(mission_id):
    mission = db.get_or_404(Mission, mission_id)

    return jsonify(mission.to_dict())


@app.route('/mission/<int:mission_id>/delete', methods=['POST'])
def delete_mission(mission_id):
    mission = db.get_or_404(Mission, mission_id)

    db.session.delete(mission)
    db.session.commit()

    return "", 200


class RenameSchema(Schema):
    name = fields.String(required=True)


@app.route('/mission/<int:mission_id>/rename', methods=['POST'])
def rename_mission(mission_id):
    mission = db.get_or_404(Mission, mission_id)

    try:
        data = RenameSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    mission.name = data["name"]
    db.session.commit()

    return "", 200


@app.route('/mission/<int:mission_id>/data', methods=['GET'])
def get_mission_data(mission_id):
    mission = db.get_or_404(Mission, mission_id)

    sensor = db.session.execute(
        db.select(SensorData)
        .filter_by(data_id=mission.data.id)
        .order_by(SensorData.time)
    ).scalars()

    return jsonify([s.to_dict() for s in sensor])


@app.route('/mission/<int:mission_id>/telemetry', methods=['GET'])
def get_mission_telemetry(mission_id):
    mission = db.get_or_404(Mission, mission_id)

    telem = db.session.execute(
        db.select(TelemetryData)
        .filter_by(data_id=mission.data.id)
        .order_by(TelemetryData.time)
    ).scalars()

    return jsonify([t.to_dict() for t in telem])


@app.route('/mission/<int:mission_id>/data-reduced', methods=['GET'])
def get_mission_data_reduced(mission_id):
    mission = db.get_or_404(Mission, mission_id)
    max_sensor_arg = request.args.get('max_sensor', 1500, type=int)
    min_time_arg = request.args.get('min_time', 0, type=int)
    max_time_arg = request.args.get('max_time', 2**31-1, type=int)

    total_sensor = db.session.scalars(
        db.select(SensorData)
        .filter(and_(
            SensorData.data_id == mission.data.id, 
            SensorData.time >= min_time_arg, 
            SensorData.time <= max_time_arg
        ))
        .order_by(SensorData.time)
    ).all()

    max_sensor_size = min(len(total_sensor), max_sensor_arg)
    if len(total_sensor) <= max_sensor_size:
        return jsonify([s.to_dict() for s in total_sensor])

    sensor = []
    
    for i in range(max_sensor_size):
        sensor.append(
            total_sensor[
                int(i * len(total_sensor) / max_sensor_size)
            ].to_dict()
        )

    return jsonify(sensor)


@app.route('/mission/<int:mission_id>/telemetry-reduced', methods=['GET'])
def get_mission_telemetry_reduced(mission_id):
    mission = db.get_or_404(Mission, mission_id)
    max_telemetry_arg = request.args.get('max_telemetry', 2500, type=int)

    total_telem = db.session.scalars(
        db.select(TelemetryData)
        .filter_by(data_id=mission.data.id)
        .order_by(TelemetryData.time)
    ).all()

    max_telemetry_size = min(len(total_telem), max_telemetry_arg)
    if len(total_telem) <= max_telemetry_size:
        return jsonify([t.to_dict() for t in total_telem])

    telemetry = []
    for i in range(max_telemetry_size):
        telemetry.append(
            total_telem[
                int(i * len(total_telem) / max_telemetry_size)
            ].to_dict()
        )

    return jsonify(telemetry)


@app.route('/get-all-missions', methods=['GET'])
def get_all_missions():
    missions = db.session.scalars(
        db.select(Mission).order_by(Mission.date_start)
    ).all()

    return jsonify([m.to_dict() for m in missions])


@app.route('/mission/<int:mission_id>/analysis-one/create', methods=['POST'])
def post_analysis_one_data(mission_id):
    mission = db.get_or_404(Mission, mission_id)

    raw_data = request.get_json()
    # TODO: Validate json

    analysis = AnalysisOne(
        gauge_1_average=raw_data["gauge_1_average"],
        gauge_2_average=raw_data["gauge_2_average"],
        name="Analysis 1",
        date_start=datetime_now(),
        date_end=datetime_now(),
        health_status=1,
        is_pending=False,
    )

    mission.analysis.append(analysis)
    db.session.commit()

    return "", 200


@app.route('/mission/<int:mission_id>/analysis-one', methods=['GET'])
def get_analysis_one_data(mission_id):
    mission = db.get_or_404(Mission, mission_id)

    if len(mission.analysis) == 0:
        return "", 404

    # Hard-coded assumed analysis one is first, todo change
    a = mission.analysis[0]

    return jsonify({
        "gauge_1_average": a.gauge_1_average,
        "gauge_2_average": a.gauge_2_average
    })


class APIKeySchema(Schema):
    id = fields.Int()
    name = fields.String()
    is_expired = fields.Function(lambda obj: obj.is_expired())
    date_expire = fields.DateTime(format="iso")
    description = fields.String()


@app.route('/api-key/list')
def get_all_api_keys():
    schema = APIKeySchema()

    api_keys = db.session.scalars(
        db.select(APIKey).filter_by(hidden=False)
        .order_by(APIKey.date_created)
    ).all()

    return jsonify([schema.dump(t) for t in api_keys])


class GenerateAPIKeySchema(Schema):
    key_name = fields.String(
        required=True, validate=validate.Length(min=2, max=60)
    )
    exp_days = fields.Int()
    description = fields.String(validate=validate.Length(max=600))


@app.route('/api-key/new', methods=['POST'])
def generate_api_key():
    raw_data = request.get_json()
    schema = GenerateAPIKeySchema()

    try:
        data = schema.load(raw_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    exp_days = data.get("exp_days")
    if exp_days == -1:
        exp_days = None

    api_key, key_val = APIKey.generate(
        data["key_name"], exp_days, data.get("description")
    )
    db.session.commit()

    return jsonify({"key": key_val})


@app.route('/api-key/<int:api_id>/delete', methods=['POST'])
def delete_api_key(api_id):
    api_key = db.get_or_404(APIKey, api_id)

    db.session.delete(api_key)
    db.session.commit()


class PasswordSchema(Schema):
    password = fields.String(required=True)


def get_scheme_data(schema_class):
    schema = schema_class()

    return schema.load(request.get_json())


def encode_jwt(site_password):
    return {"token": f'__{flask_jwt.encode({"key": site_password.key})}'}


@app.route('/site/password', methods=['POST'])
def change_site_password():
    try:
        data = PasswordSchema().load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    site_pass = db.session.scalars(db.select(SitePassword)).first()

    site_pass.set_password(data["password"])
    db.session.commit()

    return jsonify(encode_jwt(site_pass))


@app.route('/login', methods=['POST'])
def login():
    raw_data = request.get_json()
    schema = PasswordSchema()

    try:
        data = schema.load(raw_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    site_pass = db.session.scalars(db.select(SitePassword)).first()
    if site_pass is None:
        return "Site password is not set.", 500

    if site_pass.validate(data["password"]):
        return jsonify(encode_jwt(site_pass))

    return "Incorrect credentials.", 401


def verify_api_token(token):
    try:
        token_id, token_val = token.split("_")
        token_id = int(token_id)
    except ValueError:
        return None

    token_obj = db.session.get(APIKey, token_id)

    return (
        token_obj if token_obj is not None and token_obj.validate(token_val) 
        else None
    )


def verify_pass_token(token):
    site_pass = db.session.scalars(db.select(SitePassword)).first()
    if site_pass is None:
        return "Site password is not set.", 500

    try:
        k = flask_jwt.decode(token[2:])
        return site_pass if k["key"] == site_pass.key else None
    except (InvalidTokenError, KeyError):
        return None


def verify_token(token):
    if token.startswith("__"):
        return verify_pass_token(token)

    return verify_api_token(token)


def is_authorized():
    auth = request.authorization
    
    if auth is None or auth.type != "bearer":
        return False

    # TODO: Support global current token variable in future for token 
    # permissions
    return verify_token(auth.token) is not None


@app.before_request
def before_request():
    """ Flask method that gets called before every HTTP request """
    if request.endpoint in PUBLIC_ROUTES:
        return

    if is_authorized():
        return

    return "Unauthorized Access!", 401
