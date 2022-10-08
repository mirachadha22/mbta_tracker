defmodule MbtaTracker.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :email, :string
    field :password_hash, :string

    has_many :searches, MbtaTracker.Searches.Search

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do

    attrs = if attrs["password"] != "" do 
      Map.put(attrs, "password_hash", Argon2.hash_pwd_salt(attrs["password"]))
    else 
      Map.put(attrs, "password_hash", user.password_hash)
    end

    user
    |> cast(attrs, [:name, :email, :password_hash])
    |> validate_required([:name, :email, :password_hash])
  end
end
