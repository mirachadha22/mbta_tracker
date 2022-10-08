import '../App.scss';
import { useState } from 'react';
import { updatePredictionInfo } from '../api';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import TrainInfo from './Train';
import BusInfo from './Bus';
import store from '../store';

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    default:
      alert("An unknown error occurred.");
      break;
  }
}

function HomeNav({homeTab}) {

	function onClick(newTab) {
		let action = {
			type: 'homeTab/set',
			data: newTab
		}
		store.dispatch(action);
	}

	return(
		<Row>
			<div className="col" align="right"> 
				<Button variant={homeTab === 0 ? "primary" : "link"}
								onClick={() => onClick(0)}>
					All
				</Button>
        &emsp;
				<Button variant={homeTab === 1 ? "primary" : "link"}
								onClick={() => onClick(1)}>
					Trains
				</Button>
        &emsp;
				<Button variant={homeTab === 2 ? "primary" : "link"}
								onClick={() => onClick(2)}>
					Buses
				</Button>
			</div>
		</Row>
	);
}

function Home({loadingStatus, currentLocation, session, homeTab, doUpdate}) {

	let tempPos = JSON.parse(localStorage.getItem("position"));
	let tempUrl = localStorage.getItem("img_url");
	if (tempPos == null) {
		tempPos = {};
	}
	if (tempUrl == null) {
		tempUrl = "";
	}

  const [position, setPosition] = useState(tempPos);
  const [img_url, setImgUrl] = useState(tempUrl);

  if (doUpdate) {
    if (session !== null) {
      navigator.geolocation.getCurrentPosition(showPosition, showError, 
      {enableHighAccuracy: true});
      
      let action = {
        type: 'update/set',
        data: false
      };
      store.dispatch(action);
      refresh();
    }
  }

  function showPosition(pos) {
    let newPos = {"latitude": pos.coords.latitude, "longitude": pos.coords.longitude};
    localStorage.setItem("position", JSON.stringify(newPos));
    let latlon = pos.coords.latitude + "," + pos.coords.longitude;
    let imgUrl = "https://www.google.com/maps/embed/v1/place?key=" + 
  	process.env.REACT_APP_GOOGLE_API_KEY + "&q=" + latlon;
  	setImgUrl(imgUrl);
  	localStorage.setItem("img_url", imgUrl);
  }

  function refresh() {
  	if (JSON.stringify(position).length > 2) {
    	updatePredictionInfo(position)
  	}
  }

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

  function Predictions() {

  	if (loadingStatus === true) {
  		return (
    		<Row>
          <Col>
            <h2>Loading...</h2>
          </Col>
        </Row>
      );
  	} else if (currentLocation.length === 0) {
      return (
        <Row>
          <Col>
            <h2>Please wait while we get your current location.</h2>
          </Col>
        </Row>
      );
    } else {    	
      return (
      	<div>
      		<HomeNav homeTab={homeTab}/>
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
	                {currentLocation.allInfo.map(p => {

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

  if (session === null) {
    return (
      <Row>
        <Col>
          <h2>Please register or sign in to see train and bus info.</h2>
        </Col>
      </Row>
    );
  } else {
    if (homeTab === 0) {
  	  return (
  	    <div>
  	      <Row>
  	        <Col>
  	          <b>Latitude:</b> {position.latitude} <br />
  	          <b>Longitude:</b> {position.longitude} <br />
  	          <br />
  	        </Col>
  	        <div className="col" align="right">
  	          <Button variant="link" onClick={refresh}>
  	            Refresh
  	          </Button>
  	        </div>
  	      </Row>
  	      <Predictions />
  	    </div>
  	  );
    } else if (homeTab === 1) {
    	return(<TrainInfo />);
    } else if (homeTab === 2) {
    	return(<BusInfo />);
    }
  }
}

export default connect(({loadingStatus, currentLocation, session, homeTab, doUpdate}) => 
  ({loadingStatus, currentLocation, session, homeTab, doUpdate}))(Home);
