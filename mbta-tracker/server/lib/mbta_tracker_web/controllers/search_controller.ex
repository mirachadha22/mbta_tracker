defmodule MbtaTrackerWeb.SearchController do
  use MbtaTrackerWeb, :controller

  alias MbtaTracker.Searches
  alias MbtaTracker.Searches.Search
  alias MbtaTrackerWeb.CurrentLocationController

  alias MbtaTrackerWeb.Plugs
  plug Plugs.RequireAuth when action in [:create]

  action_fallback MbtaTrackerWeb.FallbackController

  def index(conn, _params) do
    searches = Searches.list_searches()
    render(conn, "index.json", searches: searches)
  end

  def create(conn, %{"search" => search_params}) do

    user = conn.assigns[:current_user]
    search_params = Map.put(search_params, "user_id", user.id)

    IO.inspect(search_params)

    with {:ok, %Search{} = search} <- Searches.create_search(search_params) do
      CurrentLocationController.create(conn, 
        %{"latitude" => search_params["latitude"], 
        "longitude" => search_params["longitude"]})
    end
  end

  def show(conn, %{"id" => id}) do
    search = Searches.get_search!(id)
    render(conn, "show.json", search: search)
  end

  def update(conn, %{"id" => id, "search" => search_params}) do
    search = Searches.get_search!(id)

    with {:ok, %Search{} = search} <- Searches.update_search(search, search_params) do
      render(conn, "show.json", search: search)
    end
  end

  def delete(conn, %{"id" => id}) do
    search = Searches.get_search!(id)

    with {:ok, %Search{}} <- Searches.delete_search(search) do
      send_resp(conn, :no_content, "")
    end
  end
end
