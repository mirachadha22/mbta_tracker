defmodule MbtaTracker.Searches do
  @moduledoc """
  The Searches context.
  """

  import Ecto.Query, warn: false
  alias MbtaTracker.Repo

  alias MbtaTracker.Searches.Search

  @doc """
  Returns the list of searches.

  ## Examples

      iex> list_searches()
      [%Search{}, ...]

  """
  def list_searches do
    Repo.all(Search)
    |> Repo.preload(:user)
  end

  @doc """
  Gets a single search.

  Raises `Ecto.NoResultsError` if the Search does not exist.

  ## Examples

      iex> get_search!(123)
      %Search{}

      iex> get_search!(456)
      ** (Ecto.NoResultsError)

  """
  def get_search!(id) do 
    Repo.get!(Search, id)
    |> Repo.preload(:user)
  end

  @doc """
  Creates a search.

  ## Examples

      iex> create_search(%{field: value})
      {:ok, %Search{}}

      iex> create_search(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_search(attrs \\ %{}) do
    %Search{}
    |> Search.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a search.

  ## Examples

      iex> update_search(search, %{field: new_value})
      {:ok, %Search{}}

      iex> update_search(search, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_search(%Search{} = search, attrs) do
    search
    |> Search.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a search.

  ## Examples

      iex> delete_search(search)
      {:ok, %Search{}}

      iex> delete_search(search)
      {:error, %Ecto.Changeset{}}

  """
  def delete_search(%Search{} = search) do
    Repo.delete(search)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking search changes.

  ## Examples

      iex> change_search(search)
      %Ecto.Changeset{data: %Search{}}

  """
  def change_search(%Search{} = search, attrs \\ %{}) do
    Search.changeset(search, attrs)
  end
end
