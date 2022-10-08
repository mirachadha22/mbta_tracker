import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

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

function ViewSearch({loadingStatus, session, view}) {

	let loading = null;
	if (loadingStatus === true) {
		loading = ("Please wait while we fetch results...");
	} 

	if (session === null) {
		return (
      <Row>
        <Col>
          <h2>Please register or sign in to view a searched address.</h2>
        </Col>
      </Row>
    );
	} else if (loadingStatus === true) {
		return (
			<Row>
				<Col>
					{loading}
				</Col>
			</Row>
		);
	} else {

    let latlon = view.latitude + "," + view.longitude;
    let img_url = "https://www.google.com/maps/embed/v1/place?key=" + 
    process.env.REACT_APP_GOOGLE_API_KEY + "&q=" + latlon;

		return (
			<div>
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
                {view.allInfo.map(p => {
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

export default connect(({loadingStatus, session, view}) => 
	({loadingStatus, session, view}))(ViewSearch);
