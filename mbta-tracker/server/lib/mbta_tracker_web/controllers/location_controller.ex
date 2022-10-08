defmodule MbtaTrackerWeb.CurrentLocationController do
	use MbtaTrackerWeb, :controller

	alias MbtaTrackerWeb.Plugs
	plug Plugs.RequireAuth when action in [:create]

	def create(conn, %{"latitude" => lat, "longitude" => lon}) do
		
		api_keys = System.get_env("API_KEY")
		|> String.split(",")

		url = "https://api-v3.mbta.com/predictions?api_key=" <> Enum.random(api_keys) <> 
		  "&filter[latitude]=" <> to_string(lat) <> "&filter[longitude]="
		  <> to_string(lon) <> "&filter[radius]=0.007" <> "&sort=time" <> 
		  "&filter[route_type]=0,1,3"

		resp = HTTPoison.get!(url)
		resp = Jason.decode!(resp.body)

		resp = Enum.reject(resp["data"], fn x ->
			x["attributes"]["arrival_time"] == nil && 
				x["attributes"]["departure_time"] == nil
		end)

		data = Enum.map(resp, fn x -> 
			url = "https://api-v3.mbta.com/stops?api_key=" <> Enum.random(api_keys) <> 
				"&filter[id]=" <> x["relationships"]["stop"]["data"]["id"]
			stopInfo = HTTPoison.get!(url)
			stopInfo = Jason.decode!(stopInfo.body)

			stop = Enum.at(stopInfo["data"], 0)
			
			x = x 
			|> Map.put("name", stop["attributes"]["name"])
			|> Map.put("latitude", stop["attributes"]["latitude"])
			|> Map.put("longitude", stop["attributes"]["longitude"])
			|> Map.put("vehicle_type", stop["attributes"]["vehicle_type"])
		end)

		trains = Enum.filter(data, fn x -> 
			x["vehicle_type"] == 0 || x["vehicle_type"] == 1
		end)

		buses = Enum.filter(data, fn x ->
			x["vehicle_type"] == 3
		end)

		conn
		|> put_resp_header("content-type", "application/json; charset=UTF-8")
		|> send_resp(:created, Jason.encode!(%{
			trainInfo: trains, 
			busInfo: buses, 
			allInfo: data})
			)
	end
end