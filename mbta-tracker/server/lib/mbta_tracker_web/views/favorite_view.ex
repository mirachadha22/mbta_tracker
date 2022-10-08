defmodule MbtaTrackerWeb.FavoriteView do
  use MbtaTrackerWeb, :view
  alias MbtaTrackerWeb.FavoriteView
  alias MbtaTrackerWeb.UserView
  alias MbtaTracker.Repo

  def render("index.json", %{favorites: favorites}) do
    %{data: render_many(favorites, FavoriteView, "favorite.json")}
  end

  def render("show.json", %{favorite: favorite}) do
    %{data: render_one(favorite, FavoriteView, "favorite.json")}
  end

  def render("favorite.json", %{favorite: favorite}) do
    
    favorite = Repo.preload(favorite, :user)
    user = if Ecto.assoc_loaded?(favorite.user) do
      render_one(favorite.user, UserView, "user.json")
    else
      nil
    end

    %{
      id: favorite.id,
      address: favorite.address,
      latitude: favorite.latitude,
      longitude: favorite.longitude,
      user: user
    }
  end
end
