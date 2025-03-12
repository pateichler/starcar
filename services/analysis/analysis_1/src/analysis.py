# Example analysis script, this doesn't do much

from os import environ

from starcar import StarcarAPI

api = StarcarAPI()

try:
    mission_id = int(environ.get("MISSION_ID", ""))
except ValueError:
    print("Unable to get mission ID")
    raise 

data = api.get_data(mission_id)

c = len(data)
a_1 = 0
a_2 = 0
for i in range(c):
    a_1 += data["gauge"]["gauge_1"] / c
    a_2 += data["gauge"]["gauge_2"] / c

api.post_analysis_one({
    "gauge_1_average": a_1,
    "gauge_2_average": a_2
})

print("Finished analysis")
