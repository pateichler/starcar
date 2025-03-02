import datetime as dt

from geographiclib.geodesic import Geodesic


def get_telem_dist(latt_1: float, lng_1: float, latt_2: float, lng_2: float):
    return Geodesic.WGS84.Inverse(
        latt_1, lng_1, latt_2, lng_2, Geodesic.DISTANCE
    )['s12']/1000


def get_time_of_day_string(date: dt.datetime):
    # Could possibly make this method take in account the sunset and sunrise
    # at the time and location
    if date.hour <= 2 or date.hour >= 20:
        return "night"
    if date.hour <= 11:
        return "morning"
    if date.hour <= 16:
        return "afternoon"
    return "evening"


def get_date_string(date: dt.datetime, postfix="drive"):
    return f'{date.strftime("%A")} {get_time_of_day_string(date)} drive'
