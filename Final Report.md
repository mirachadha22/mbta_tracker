# Final Report

# Meta
## Who was on your team?
* Zialynn Anderson (4th year in Electrical and Computer Engineering)
* Kate Rupar (4th year in Computer Science)
* Mira Chadha (2nd year in Computer Science)
* Sanjana Dutt (2nd year in Computer Science)

## What's the URL of your deployed app?
http://mbta.zialynnanderson.site

## What's the URL of your GitHub repository with the code the app?
https://github.com/Zialyn-Anderson/cs4550-project.git

## Is your app deployed and working?
	Yes!

## For each team member, what work did that person do on the project?
* Everyone:
	- Contributed to the Project Proposal (e.g., making it more 
	  detailed to reach the minimum word requirement)
	- Discussed UI design decisions and "neat" features (e.g., 
	  searching an address)
	- Contributed to the Final Report document
* Zia: 
	- Hosted Zoom meetings
	- Screen shared and coded 
	- Developed UI / UX and debugged
* Kate:
	- Researched and explained MBTA API documentation
	- Documented project app details
* Sanjana:
	- Researched MBTA API documentation 
	- Documented project app details
* Mira:
	- Developed common workflow and contributed to target user research
	- Documented project app details
	- Researched and explained several reverse geocoding methods

# App
## What does your project app do?
Our project app is a Boston-specific public transport tracker. Users 
are initially given the option to create an account or log in, which 
will enable access to the features. To use the Home tab, users will 
be asked to allow permission for the app to access their current 
location. The app will then display a map of the user's current 
location and the surrounding area.

When the user chooses to register an account with their name, email 
and password, they will be able to access a list of real-time 
information about the public transport in their vicinity, along with 
each transit option's station information and estimated arrival/
departure time. This information will be refreshed automatically by 
the page every sixty seconds, but can also be refreshed by the user 
if they choose to do so. This is useful in cases where the user is 
walking/moving while accessing the page, as well as because it will 
provide the most accurate transport information.

Users also have access to a "search" tab, which will provide a 
history of previous searches that the user performed. These 
addresses can be selected in order to view transit information about 
the area around said address. 

The user can also create a new search, within which they can type an 
address into an auto-suggestion search bar. When an address is 
searched, the page will display a map of the searched location along 
with information about any transit within a half-mile radius of the 
address. This address will also be added to the search history.

## How has your app concept changed since the proposal?
* We initially had plans to display the address of any given 
transportation listed in the various pages of our app, but had 
significant trouble with using reverse geocoding to obtain the 
address from the latitude and longitude coordinates without 
exceeding our API request quota. We also realized that transport 
addresses were not necessary to provide, because the names of 
transport (i.e. buses, trains) already described the address or 
place at which the transport would stop. In addition, there is an 
interactive map that has markers at various stations. 

## How do users interact with your app? What can they accomplish?
* Without an account, the user will not be allowed to access anything
* The user can register and make an account with a name, email, and 
	password
* Once logged in, the user can: 
	- See a map of their current location (if access allowed)
	- Save any "favorite" addresses
	- Search an address to see prediction information about trains and 
		buses within a 0.5 mi 
	- Searches will be saved automatically and are visible in "Search 
		History"

## For each project requirement, how does your app meet it? 
* App is two separate components: Elixir/Phoenix back-end + SPA 
	React front-end
	- In the GitHub repo, you will find one folder with two separate 
		apps: 
			+ Phoenix app created with mix phx.new (located in a folder 
				called "server")
			+ React app created with create-react-app (located in a folder 
				called "web-ui")
* Back-end includes a significant amount of application logic
	- The server app handles 
			+ User registration
			+ User log in requests
			+ Communicating with the MBTA API for predictions
	- The web-ui only handles
			+ Getting user current location (coordinates)
			+ Displaying predictions to user
			+ Displaying forms for the user to send info to the server
* Front-end communicates with back-end using JSON API and JSON Web 
	Tokens
	- Requests are sent with the data "stringified" to conform to JSON 
		format
	- Requests sent to the server are required to have an "x-auth" 
		header, containing the user's session token
* Front-end is deployed as a static site
	- The nginx config file specifies the address to the web-ui app's 
		index.html file
* User accounts and password authentication
	- User passwords are required to be 10 characters in length
	- No password changes are required
	- The password is stored in the Postgres DB using Argon2 password 
		hash + salt
* Users stored in Postgres DB
	- The Users resource was created using mix phx.gen.json
* Some other persistent data stored in Postgres DB
	- The Searches resource was create using mix phx.gen.json and 
		proper Ecto relations were set up with the Users resource
		+ This equates to a "search history" for a user
	- Favorites were made similar to Searches
* Server uses external API
	- The server requests prediction information about specific Boston 
		train and bus routes within a certain radius using the MBTA API 
		and an assigned secret api key
* Something neat not explictly covered by requirements
	- Use HTML Geolocation API to obtain user's exact current location 
		to get the predictions for trains and buses within a 0.5 mi 
		radius
	- Search feature, where the user can enter an address and will 
		receive MBTA train and bus predictions for a 0.5 mi radius 
		around the area. The address is converted to latitude and 
		longitude coordinates before being sent in an API post request 
		to the server. 
* Test the app 
	- Zia: Zia extensively tested the search feature. Using a map of 
		the MBTA system (https://www.mbta.com/maps), she entered in 
		various addresses at the extremes of the coverage (excluding 
		Commuter Rail), in addition to addresses located at the heart of 
		Boston.
	- Kate: Kate went to a high density transportation area in Boston 
		to test the app - Downtown Crossing. In particular, she tested 
		current location updating and that the first suggested station 
		was the closest (for example, Arlington is the first suggested 
		train station until you are closer to Boylston).
	- Mira: Mira tested the application in both the Greater Boston 
		Area and around different parts of Massachusetts. She made sure 
		that the app was only displaying train and bus information 
		rather than shuttle information and commuter rail information in 
		towns like Natick and Framingham. She also went to areas where 
		there is less dense train/bus stops, such as Newton and areas of 
		Cambridge.
	- Sanjana: Sanjana also went to a high density transportation area 
		in Boston to the app around Mass Ave and Fenway area. She tested 
		that her current location was updating correctly and quickly. 
		She also was testing to make sure it was accurately portraying 
		the closest stops to her current location. 
	
## What interesting stuff does your app include beyond requirements?
* Use HTML Geolocation API to get location-specific train and bus 
	predictions (aforementioned)
* Address search feature (aforementioned)
	- Uses Google's Geocoding, Maps Embed, Maps JavaScript, and Places 
		APIs

## What's the complex part of the app? How did you design it and why?
* The most complex part of the app is the Search feature. The input 
field has an autocomplete feature, utilizing Google's Places APIs. 
After the user submits an address, it is then converted using 
Google's Geocoding API to latitude and longitude coordinates. The 
server uses the latitude and longitude coordinates to find the train 
and bus predictions within 0.5 mi of the address. The results are 
displayed on the same page when received.
* It was expected the user would know an address, rather than 
latitude and longitude coordinates (which the server needs to 
complete the request).

## What was the most significant challenge and how did you solve it?
* Using the HTML Geolocation API, we were not sure how to provide 
	real-time updates to the prediction information without having the 
	user refresh the page to send the updated current location. In 
	addition, we could only use this API if the site was secure. Using 
	Prof's suggestion, we made the site secure using 
	https://letsencrypt.org.
* We have a manual refresh button, but we also have a mechanism 
	handled by the server which pushes an "update" request. When the 
	browser receives this, the current location is updated and new 
	results are fetched. This happens about every minute to try and 
	avoid going over our API request quota.
* The MBTA v3 API has a request quota of 1000 requests per minute 
	per key. Because we wanted to provide users with the full list of 
	bus and train options, we were requesting stop details including 
	name and location for every stop in a .5 mile radius. Therefore, 
	we were averaging close to 1000 requests per search, especially in 
	areas with a high density of train and bus stops. You can request 
	to increase your API request limit, but since we were on a time 
	crunch, something we did to allow users to quickly search again 
	was to have each member of our group request a key and then 
	randomly select a key to use when submitting a request. This is a 
	temporary, yet effective, solution - as previously stated a better 
	long term choice would be to request to increase the number of 
	requests to around 4000 per minute.