# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     MbtaTracker.Repo.insert!(%MbtaTracker.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

# alias MbtaTracker.Repo
# alias MbtaTracker.Searches.Search

# lat = 42.3398
# lon = -71.0892

# api_key = System.get_env("API_KEY")
# url = "https://api-v3.mbta.com/predictions?api_key=" <> api_key <> 
#   "&filter[latitude]=" <> to_string(lat) <> "&filter[longitude]="
#   <> to_string(lon)

# resp = HTTPoison.get!(url)
# resp = Jason.decode!(resp.body)

# data = Enum.map(resp["data"], fn x -> 
# 	url = "https://api-v3.mbta.com/stops?api_key=" <> api_key <> 
# 		"&filter[id]=" <> x["relationships"]["stop"]["data"]["id"]
# 	stopInfo = HTTPoison.get!(url)
# 	stopInfo = Jason.decode!(stopInfo.body)
# 	stop = Enum.at(stopInfo["data"], 0)

# 	x = x 
# 	|> Map.put("name", stop["attributes"]["name"])
# 	|> Map.put("latitude", stop["attributes"]["latitude"])
# 	|> Map.put("longitude", stop["attributes"]["longitude"])
# 	|> Map.put("vehicle_type", stop["attributes"]["vehicle_type"])
# end)

# resp = Map.put(resp, "data", data)

# name = Enum.at(resp["data"], 1)["attributes"]["name"]

# Repo.insert!(%Search{latitude: lat, longitude: lon, response: resp}) 