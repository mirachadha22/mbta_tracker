defmodule MbtaTracker.Repo.Migrations.CreateSearches do
  use Ecto.Migration

  def change do
    create table(:searches) do
    	add :address, :string, null: false
      add :latitude, :float, null: false
      add :longitude, :float, null: false

      add :user_id, references(:users), null: false

      timestamps()
    end

  end
end
