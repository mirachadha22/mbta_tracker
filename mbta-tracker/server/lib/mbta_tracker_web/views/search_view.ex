defmodule MbtaTrackerWeb.SearchView do
  use MbtaTrackerWeb, :view
  alias MbtaTrackerWeb.SearchView
  alias MbtaTrackerWeb.UserView
  alias MbtaTracker.Repo

  def render("index.json", %{searches: searches}) do
    %{data: render_many(searches, SearchView, "search.json")}
  end

  def render("show.json", %{search: search}) do
    %{data: render_one(search, SearchView, "search.json")}
  end

  def render("search.json", %{search: search}) do
    
    search = Repo.preload(search, :user)

    user = if Ecto.assoc_loaded?(search.user) do
      render_one(search.user, UserView, "user.json")
    else
      nil
    end

    %{
      id: search.id,
      address: search.address,
      latitude: search.latitude,
      longitude: search.longitude,
      user: user
    }
  end
end
