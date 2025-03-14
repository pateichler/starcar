import secrets

from flask.cli import FlaskGroup
import click

from starcar import app, db
from starcar.models import SitePassword, TelemetryData
from starcar.utils import get_telem_dist

cli = FlaskGroup(app)


@cli.command("init")
def init():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command("create_all")
def create_all():
    db.create_all()
    db.session.commit()


@cli.command("seed")
def seed():
    # token, token_val = APIToken.generate("root")
    temp_pass = secrets.token_hex(12)
    s = SitePassword(temp_pass)
    db.session.add(s)
    db.session.commit()

    print(f'Generated temporary password: {temp_pass}')


@cli.command("recalc-dist")
@click.argument("mission_id")
def recalculate_mission_dist(mission_id: int):
    total_telem = db.session.scalars(
        db.select(TelemetryData)
        .filter_by(data_id=mission_id)
        .order_by(TelemetryData.time)
    ).all()

    last_telem = None
    total_dist = 0
    for t in total_telem:
        dist = 0
        
        if last_telem is not None:
            dist = get_telem_dist(
                last_telem.latt, last_telem.lng, t.latt, t.lng
            )

        t.dist = dist
        total_dist += dist
        last_telem = t

    db.session.commit()
    print(f'Recalculated distances for mission {mission_id}\nTotal distance: {total_dist:.3f}km')


if __name__ == "__main__":
    cli()
