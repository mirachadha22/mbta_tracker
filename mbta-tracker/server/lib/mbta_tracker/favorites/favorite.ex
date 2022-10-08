defmodule MbtaTracker.Favorites.Favorite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "favorites" do
    field :address, :string
    field :latitude, :float
    field :longitude, :float
    
    belongs_to :user, MbtaTracker.Users.User

    timestamps()
  end

  @doc false
  def changeset(favorite, attrs) do
    favorite
    |> cast(attrs, [:address, :latitude, :longitude, :user_id])
    |> validate_required([:address, :latitude, :longitude, :user_id])
  end
end
