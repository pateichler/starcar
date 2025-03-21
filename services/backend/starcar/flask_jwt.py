import jwt


class FlaskJWT:
    """Helper class for generating JWT tokens with the flask SECRET_KEY config
    """
    
    def __init__(self, app, algorithm="HS256"):
        self.config = app.config
        self.algorithm = algorithm

    def encode(self, payload):
        return jwt.encode(
            payload, self.config['SECRET_KEY'], algorithm=self.algorithm
        )

    def decode(self, payload):
        return jwt.decode(
            payload, self.config['SECRET_KEY'], algorithms=[self.algorithm]
        )
