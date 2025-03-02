from flask import g
from flask import has_request_context
from werkzeug.local import LocalProxy

from datetime import datetime

current_user = LocalProxy(lambda: _get_user())


def _get_user():
    print("get user")
    if has_request_context():

        if "_login_user" not in g:
            g._login_user = datetime.now()
            # current_app.login_manager._load_user()

        return g._login_user

    return None
