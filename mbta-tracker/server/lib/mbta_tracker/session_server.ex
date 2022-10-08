defmodule MbtaTracker.SessionServer do
	use GenServer

	alias MbtaTracker.BackupAgent

	def init(session) do
		{:ok, session}
	end

	def reg(email) do
		{:via, Registry, {MbtaTracker.SessionReg, email}}
	end

	def start(email) do
		spec = %{
			id: __MODULE__,
			start: {__MODULE__, :start_link, [email]},
			restart: :permanent,
			type: :worker
		}
		MbtaTracker.SessionSup.start_child(spec)
	end

	def start_link(email) do
		session = BackupAgent.get(email) || MbtaTracker.Session.new
		GenServer.start_link(
			__MODULE__,
			session,
			name: reg(email)
		)
	end

	def startTimer(email) do
		GenServer.call(reg(email), {:startTimer, email})
	end
	
	def handle_call({:startTimer, email}, _from, session) do
    timer_ref = Process.send_after(self(), {:doUpdate, email}, 30_000)
    BackupAgent.put(email <> "_timer_ref", timer_ref)
    {:reply, session, session}
  end

  def handle_call({:stopTimer, email}, _from, session) do
    timer_ref = BackupAgent.get(email <> "_timer_ref")
    Process.cancel_timer(timer_ref)
    {:reply, session, session}
  end

  def handle_info({:doUpdate, email}, session) do
  	BackupAgent.put(email, session)
  	MbtaTrackerWeb.Endpoint.broadcast!(
  		"session:" <> email,
  		"view",
  		%{
  			doUpdate: true
  		}
		)
		{:noreply, session}
  end
end

defmodule MbtaTracker.Session do
	def new do
		%{
			doUpdate: false
		}
	end
end