defmodule MbtaTracker.Searches.Search do
  use Ecto.Schema
  import Ecto.Changeset

  schema "searches" do
    field :address, :string
    field :latitude, :float
    field :longitude, :float

    belongs_to :user, MbtaTracker.Users.User

    timestamps()
  end

  @doc false
  def changeset(search, attrs) do
    search
    |> cast(attrs, [:address, :latitude, :longitude, :user_id])
    |> validate_required([:address, :latitude, :longitude, :user_id])
  end
end
