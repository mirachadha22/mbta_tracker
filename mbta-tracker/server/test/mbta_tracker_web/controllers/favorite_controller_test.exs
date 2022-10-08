defmodule MbtaTrackerWeb.FavoriteControllerTest do
  use MbtaTrackerWeb.ConnCase

  alias MbtaTracker.Favorites
  alias MbtaTracker.Favorites.Favorite

  @create_attrs %{
    address: "some address",
    latitude: 120.5,
    longitude: 120.5
  }
  @update_attrs %{
    address: "some updated address",
    latitude: 456.7,
    longitude: 456.7
  }
  @invalid_attrs %{address: nil, latitude: nil, longitude: nil}

  def fixture(:favorite) do
    {:ok, favorite} = Favorites.create_favorite(@create_attrs)
    favorite
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all favorites", %{conn: conn} do
      conn = get(conn, Routes.favorite_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create favorite" do
    test "renders favorite when data is valid", %{conn: conn} do
      conn = post(conn, Routes.favorite_path(conn, :create), favorite: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.favorite_path(conn, :show, id))

      assert %{
               "id" => id,
               "address" => "some address",
               "latitude" => 120.5,
               "longitude" => 120.5
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.favorite_path(conn, :create), favorite: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update favorite" do
    setup [:create_favorite]

    test "renders favorite when data is valid", %{conn: conn, favorite: %Favorite{id: id} = favorite} do
      conn = put(conn, Routes.favorite_path(conn, :update, favorite), favorite: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.favorite_path(conn, :show, id))

      assert %{
               "id" => id,
               "address" => "some updated address",
               "latitude" => 456.7,
               "longitude" => 456.7
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, favorite: favorite} do
      conn = put(conn, Routes.favorite_path(conn, :update, favorite), favorite: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete favorite" do
    setup [:create_favorite]

    test "deletes chosen favorite", %{conn: conn, favorite: favorite} do
      conn = delete(conn, Routes.favorite_path(conn, :delete, favorite))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.favorite_path(conn, :show, favorite))
      end
    end
  end

  defp create_favorite(_) do
    favorite = fixture(:favorite)
    %{favorite: favorite}
  end
end
