from os import environ

from starcar import StarcarAPI

api = StarcarAPI()

try:
    mission_id = int(environ.get("MISSION_ID", ""))
except ValueError:
    print("Unable to get mission ID")
    raise 

data = api.get_data(mission_id)

print(data[:100])

# Do stuff with data
