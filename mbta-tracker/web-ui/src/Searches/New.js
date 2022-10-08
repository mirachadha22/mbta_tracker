import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } 
	from 'react-google-places-autocomplete';
import { create_search } from '../api';
import store from '../store';

function parseDateTime(timeStr) {

  if (timeStr == null) {
    return "";
  }

  let timeArr = timeStr.split('T');
  let date = timeArr[0].split('-');
  let timeAndZone = timeArr[1].split('-');
  let time = timeAndZone[0].split(':');

  let dateObj = new Date(
      parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2]),
      parseInt(time[0]), parseInt(time[1]), parseInt(time[2])
  );
  let opts = {year: 'numeric', month: 'short', day: 'numeric', 
    hour: 'numeric', minute: 'numeric', timeZone: 'America/New_York'};
  let dateTimeStr = new Intl.DateTimeFormat('en-US', opts).format(dateObj);
  return dateTimeStr;
}

function convertVehicleType(vehicle_type) {
  if (vehicle_type === 0 || vehicle_type === 1) {
    return ("Train");
  } else if (vehicle_type === 3) {
    return ("Bus");
  } else {
    return ("Unsupported vehicle type.");
  }
} 

function NewSearch({loadingStatus, session, search}) {

	const [searchValue, setSearchValue] = useState("");
	const [img_url, setImgUrl] = useState("");

	function onSubmit(ev) {
		ev.preventDefault();

    let action = {
      type: 'loadingStatus/set',
      data: true
    }
    store.dispatch(action);
    
		geocodeByAddress(searchValue.label)
			.then(results => getLatLng(results[0]))
			.then(({lat, lng}) => {
				let position = {address: searchValue.label, latitude: lat, longitude: lng};
				let latlon = position.latitude + "," + position.longitude;
				let imgUrl = "https://www.google.com/maps/embed/v1/place?key=" + 
  			process.env.REACT_APP_GOOGLE_API_KEY + "&q=" + latlon;
  			setImgUrl(imgUrl);
				create_search(session.user_id, position);
			});
	}

	let loading = null;
	if (loadingStatus === true) {
		loading = ("Please wait while we fetch results...");
	}

	if (session === null) {
		return (
      <Row>
        <Col>
          <h2>Please register or sign in to search an address.</h2>
        </Col>
      </Row>
    );
	} else if (img_url === "" || loadingStatus === true) {
		return (
			<Row>
				<Col>
					<Form onSubmit={onSubmit}>
						Address: 
						<GooglePlacesAutocomplete
									 apiKey={process.env.REACT_APP_GOOGLE_API_KEY} 
									 selectProps={{
									 	searchValue,
									 	onChange: setSearchValue
									 }} />
						<br />
						<Button type="submit">Search!</Button>&emsp;{loading}
					</Form>
				</Col>
			</Row>
		);
	} else {
		return (
			<div>
				<Row>
					<Col>
						<Form onSubmit={onSubmit}>
							Address: 
							<GooglePlacesAutocomplete
										 apiKey={process.env.REACT_APP_GOOGLE_API_KEY} 
										 selectProps={{
										 	searchValue,
										 	onChange: setSearchValue
										 }} />
							<br />
							<Button type="submit">Search!</Button>
						</Form>
					</Col>
				</Row>
				<br />
				<Row>
    			<div className="col" align="center">
    				<iframe title="Google Maps Current Location Home Tab"
    					width="1000"
    					height="400"
    					style={{border:1}}
    					loading="lazy"
    					allowFullScreen
    					src={img_url}>
  					</iframe>
    			</div>
  			</Row>
    		<br />
        <Row>
          <Col>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Vehicle Type</th>
                  <th>Expected Arrival</th>
                  <th>Expected Departure</th>
                </tr>
              </thead>
               <tbody>
                {search.allInfo.map(p => {
                    return (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{convertVehicleType(p.vehicle_type)}</td>
                        <td>{parseDateTime(p.attributes.arrival_time)}</td>
                        <td>{parseDateTime(p.attributes.departure_time)}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </Col>
      	</Row>
			</div>
		);
	}
}

export default connect(({loadingStatus, session, search}) => 
	({loadingStatus, session, search}))(NewSearch);
