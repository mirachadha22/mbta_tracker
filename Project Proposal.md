# Project Proposal

## Team Members and Project Idea
	Our team consists of Zialynn Anderson (4th year in Electrical and 
	Computer Engineering), Kate Rupar (4th year in Computer Science), 
	Sanjana Dutt (2nd year in Computer Science), and Mira Chadha (2nd 
	year in Computer Science). 

	We have decided to make an app similar to the Example Project Idea 
	"MBTA Next Bus Tracker". However, instead of notifying users about 
	local bus locations and arrivals, the app that we plan to develop 
	is going to focus on the expected arrival times, schedules, and 
	locations for the trains on and around Northeastern campus: 
	specifically, we plan to focus our attention on the Green Line and 
	the Orange line. If these two trains lines are easy to implement, 
	the app may also be expanded further to include other train lines 
	throughout Boston, as well as perhaps bus stops close to 
	Northeastern's campus. For this app, we will be using the MBTA API 
	in order to obtain information about the specific (aforementioned) 
	trains (and maybe buses) and to display their information to the 
	user in a list form on the app. The real-time behavior of the app 
	will revolve around pushing live information updates about the 
	trains (and maybe buses) to the user's front page. One particular 
	persistent state that will be stored in a Postgres DB, in addition 
	to user profiles, will be the user's default station that they can 
	select and other saved stations. Depending on the difficulty of 
	implementation and the amount of time we have, we might also decide 
	to store the user's favorite stops along the Green Line and the 
	Orange Line. Something "neat" that the app is going to do is use 
	the HTML Geolocation API to obtain the given user's current 
	position, so that it can show the trains (and maybe buses) closest 
	to the user at that time. We may also include a feature that allows 
	the user to type in a location, and the app would show info on the 
	trains (and maybe buses) close to that specific area. This would be 
	useful in cases where the user denies the app the requested ability 
	to pull location information, or if the user wants to research a 
	specific area that is not their current location. To fulfill the 
	requirements in the project directions, the features in our app 
	will only be accessible if the user is logged into their own 
	account.

## Project Specifics ##
### User Interface ###
	The home page will enable the user to either log in or encourage 
	them to create an account/log in. As specified in the project, our 
	app will have local password authentication implemented securely. 
	Upon logging in, the user will be presented with a list of their 
	favorite stations that they can select. There will also be 
	information about the departures/arrivals of the user's default 
	station if they have set it. On this screen, there will be a search 
	bar, that allows the user to input a location, or select their 
	current location. We may also choose to enable filtering by vehicle 
	type (ie Bus, Train, Rail Color etc.). After the user submits these 
	fields, the page will update to show the expected arrival times, 
	schedules, and locations of the trains closest to that location, 
	ordered by proximity and then by soonest departure time (since 
	there are sometimes multiple lines at a station). For performance 
	improvements, we are also considering using a caching system to 
	cache the results of API calls for a period of time.

### Testing Plan ###
	We will test our project by traveling to different locations around 
	Boston at different times throughout the day to ensure that our app 
	is providing users with correct data. The MBTA API allows us to 
	specify a radius for returning stations "nearby" to a location, so 
	we will have to modify this value to provide the most accurate 
	results since Boston is a fairly condensed city. This will also 
	require us to determine how far the average person is willing to 
	walk to a station. 

## Experiment 1: MBTA API
	For this experiment, we tested the MBTA API (https://www.mbta.com/
	developers/v3-api) in order to see how much real-time data we could 
	access using the API. The most important data that we wanted to 
	obtain was the first expected arrival/departure time for a train or 
	bus closest to a specific location. Therefore, the information that 
	we decided we wanted to access using the MBTA API was the various 
	train station locations (specifically, longitude and latitude 
	coordinates) and the trains' current positions/time away from their 
	specified destination station. Our source code for this experiment 
	can be found in both the server and web-ui folders of the 
	mbta_tracker. We hard coded the longitude and latitude coordinates 
	for Northeastern University for this test. 
	
### How We Learned ###
	The MBTA API provides a multitude of information about the various 
	routes and vehicles that are a part of the MBTA. For this 
	experiment, we extensively read through the documentation and API 
	developer forums to learn how to filter data and make requests to 
	the various endpoints. The API requires creating an account in 
	order to procure an API key. Aside from the API documentation, we 
	also utilized Postman to structure our requests. The API 
	categorizes vehicle types in the MBTA as a number, so we also spent 
	time identifying which types we were interested in. The MBTA API 
	offers both scheduled times and predicted times, but since we are 
	hoping to provide users with real time info, we focused on the 
	/predictions endpoint.

### Results From Experiment 1 ###
	In our experiment, the browser displays a table of all MBTA public 
	transportation options within a 0.5 mile radius to Northeastern. We 
	have included the stop (or station) name, transportation ID 
	(specific to each line on the train or bus), vehicle type (we will 
	be interested in 0/1 for trains, and 3 for buses), expected arrival 
	and departure times in the ISO 8601 format.

### What We Learned ###
	From this experiment, we learned how to use the MBTA API in order 
	to get the specific information and how to display that information 
	on the front end to the web UI using Javascript and HTML. We also 
	learned how to effectively parse and display JSON. The train lines 
	themselves do not have GPS information, so we have to use individual
	stops instead. All individual stops for trains, however, have 
	latitude and longitude data that can be used to filter stops and 
	predictions. The MBTA API allows filters on requests, so we learned 
	how to use these filters to find train and bus stops nearby any 
	given set of coordinates. Luckily for us, the API provides a 
	"nearby" call which returns a list of stops close to the specified 
	location within a certain radius. We can then filter this data to 
	specify features such as line (Green-E, Orange, etc.), vehicle type 
	(light-rail, heavy-rail, bus, ferry) and more. Because filtering by 
	location did not provide the name of the stop, only the stop id, we 
	combined the results with another call to the /stop endpoint with 
	the stop id. The default radius for "nearby" is 0.5 mile. Because 
	our app is focused specifically around the Northeastern campus 
	(which has quite a few stops in a 0.5 mile radius around it), it is 
	likely that we will have to shrink this radius. In addition, it also
	appears that the closest stops are returned first. This makes it 
	easier to return stops in the proximity-based order that we want. 
	The predictions' GET request also returns all types of MBTA 
	transportation, so it looks promising that we will be able to 
	include buses, in addition to trains. 

	Some of the vehicle's expected arrival and/or departure time is 
	blank. We will look further into this, but we believe this is 
	probably because not all the lines are running due to COVID-19 or 
	are inactive on certain days (for example, weekends). Something that
	we also had to consider during this experiment was avoiding 
	publishing our API Key to Github. Our solution was to store the API 
	Key as an environment variable (similar to our deploy scripts with 
	Phoenix) and access the key in our Elixir code using 
	System.get_env() on the server-side.

## Experiment 2: HTML Geolocation API
	For this experiment, we tested the HTML Geolocation API's ability to
	obtain the user's current location (according to the browser) from 
	JavaScript. Our source code for this experiment can be found in the 
	web-ui folder of the mbta_tracker.
	
### How We Learned ###
	We learned how to use this API by going through the tutorial at 
	https://www.tutorialspoint.com/html5/html5_geolocation.htm. We found
	that this functionality was fairly easy to implement. Each member of
	our group tested the API at different locations to ensure we 
	understood how it worked.

### Results From Experiment 2 ###
	Right now, the user's current latitude and longitude coordinates are
	simply displayed at the top of the browser. The user must allow 
	access to their location via a pop-up. For the project, as Professor
	Tuck showed in class on March 16, 2021, we expect to pass these 
	longitude and latitude values to the Phoenix server using the fetch 
	method with the 'POST' option. This functionality will be helpful 
	when trying to use the "current location" feature described above.

### What We Learned ###
	From this experiment, we learned that the device's current location 
	is displayed after the user consents to letting the site take this 
	data. There is a slight delay in obtaining the initial position of 
	the device, but it seems to be less than 5 seconds. We will 
	probably have to have a "loading" screen until the first longitude 
	and latitude values are obtained. We have also learned, since the UI
	is operating separately from the server, it is probably most 
	feasible to use a fetch call with the 'POST' option. Based on our 
	observations, we estimated the GPS location is accurate within a few
	hundred feet (e.g., it said we were one house to the east from where
	we actually were). 

## Target Users
	We mainly expect Northeastern students to be able to use this app, 
	since the MBTA trains and buses are very accessible on campus, and 
	not many students have cars on campus due to the high costs 
	associated with it. In addition, nearly all Northeastern students 
	will eventually have a co-op, and a lot of co-ops are located in 
	downtown Boston. These students will want an app that can tell them 
	the real-time status of a train or a bus, so that they can prepare 
	in the morning and be on time for their jobs, as well as plan their 
	return route accordingly. Despite our focus being on Northeastern 
	students, the target users could also be expanded to include anyone 
	who chooses to use public transportation to travel to work or any 
	given destination. 

## Common Workflow / User Story
	The following is a common user story for a Northeastern Student: As 
	a Northeastern student who is on a co-op in the Boston area while 
	living on or around campus, I want to be able to use public 
	transportation in the most efficient way possible so that I can both
	reach my co-op on time, as well as return home safely. Given that I 
	can use the MBTA train tracker app when I am trying to travel 
	through Boston, then I will be able to arrive at my co-op with 
	minimal hassle. 

	For a general public transportation commuter: When I wake up, I can 
	check the expected arrival times for the trains or buses closest to 
	me that I used to get to work. I can plan my breakfast and other 
	morning tasks accordingly and will arrive at work early or on time. 
	At the end of my work day, before I decide to leave, I check the 
	expected arrival times for the trains or buses I use to get home. 
	Then, I plan when to leave work accordingly. 

	If someone wants to look up public transportation arrival times for 
	a different location from their current location, it is likely they 
	are doing so because they do not allow location services, they are 
	trying to get an idea for the train or bus schedule in a different 
	area, or they are simply looking up the information for a friend, 
	acquaintance, co-worker, etc.
