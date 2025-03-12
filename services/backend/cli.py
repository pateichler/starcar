import secrets

from flask.cli import FlaskGroup

from starcar import app, db
from starcar.models import SitePassword

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


if __name__ == "__main__":
    cli()
