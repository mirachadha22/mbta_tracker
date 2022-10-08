import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } 
	from 'react-google-places-autocomplete';
import { create_favorite } from '../api';
import { useHistory } from 'react-router-dom';

function NewFavorite({session}) {

  const history = useHistory();
	const [searchValue, setSearchValue] = useState("");
  const [position, setPosition] = useState({});
	const [img_url, setImgUrl] = useState("");

  function onSearch(ev) {
    ev.preventDefault();
    geocodeByAddress(searchValue.label)
      .then(results => getLatLng(results[0]))
      .then(({lat, lng}) => {
        let newPos = {address: searchValue.label, latitude: lat, longitude: lng};
        setPosition(newPos);
        let latlon = newPos.latitude + "," + newPos.longitude;
        let imgUrl = "https://www.google.com/maps/embed/v1/place?key=" + 
        process.env.REACT_APP_GOOGLE_API_KEY + "&q=" + latlon;
        setImgUrl(imgUrl);
      }
    );
  }

	function onSubmit(ev) {
		ev.preventDefault();
		create_favorite(session.user_id, position).then(() => {
      history.push("/favorites");
      history.go(0);
    });
	}

	if (session === null) {
		return (
      <Row>
        <Col>
          <h2>Please register or sign in to search an address.</h2>
        </Col>
      </Row>
    );
	} else if (img_url === "") {
		return (
			<Row>
				<Col>
					<Form onSubmit={onSearch}>
						Address: 
						<GooglePlacesAutocomplete
									 apiKey={process.env.REACT_APP_GOOGLE_API_KEY} 
									 selectProps={{
									 	searchValue,
									 	onChange: setSearchValue
									 }} />
						<br />
						<Button type="submit">Search</Button>
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
							<Button type="submit">Save!</Button>
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
			</div>
		);
	}
}

export default connect(({session}) => 
	({session}))(NewFavorite);
