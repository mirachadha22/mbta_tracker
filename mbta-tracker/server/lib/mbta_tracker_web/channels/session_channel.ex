defmodule MbtaTrackerWeb.SessionChannel do
  use MbtaTrackerWeb, :channel

  alias MbtaTracker.SessionServer

  @impl true
  def join("session:" <> email, payload, socket) do
    if authorized?(payload) do
      socket = assign(socket, :email, email)
      SessionServer.start(email)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("ready", _, socket) do
    IO.inspect("handle_in: ready")
    email = socket.assigns[:email]
    SessionServer.startTimer(email)
    {:reply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
