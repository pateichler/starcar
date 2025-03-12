from typing import Optional
from os import environ
from urllib.parse import urljoin
import json

import requests


class StarcarAPI:
    
    api_url = "https://api.star-car.net/"

    def __init__(self, api_key: Optional[str] = None, base_api_url: Optional[str] = None):
        self.api_key = api_key

        if api_key is None:
            self.api_key = environ.get("API_KEY")

            if self.api_key is None:
                raise Exception("API key is needed to communicate with Starcar backend")

        if base_api_url is not None:
            self.api_url = base_api_url
        elif "API_ROUTE" in environ:
            self.api_url = environ["API_ROUTE"]

    def fetch_api(self, route: str):
        url = urljoin(self.api_url, route)
        headers = {
            "Authorization": f'Bearer {self.api_key}'
        }

        return requests.get(url, headers=headers)

    def post_api_dict(self, route: str, data: dict):
        url = urljoin(self.api_url, route)
        headers = {
            "Authorization": f'Bearer {self.api_key}',
            'Content-type': 'application/json', 
            'Accept': 'text/plain'
        }

        return requests.post(url, data=json.dumps(data), headers=headers)

    def get_data(self, mission_id: int):
        r = self.fetch_api(f"/mission/{mission_id}/data")
        return r.json()

    def get_telemetry(self, mission_id: int):
        r = self.fetch_api(f"/mission/{mission_id}/telemetry")
        return r.json()

    def post_analysis_one(self, mission_id: int, data: dict):
        r = self.post_api_dict(f"/mission/{mission_id}/analysis-one/create", data)
        return r
