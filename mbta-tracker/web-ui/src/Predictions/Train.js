import '../App.scss';
import { updatePredictionInfo } from '../api';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import store from '../store';

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

function TrainInfo({loadingStatus, currentLocation, session, homeTab}) {

  let position = JSON.parse(localStorage.getItem("position"));
  let img_url = localStorage.getItem("img_url");

  function refresh() {
    if (JSON.stringify(position).length > 2) {
      updatePredictionInfo(position);
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
          <HomeNav homeTab={homeTab} />
          <br />
          <Row>
            <div className="col" align="center">
              <iframe title="Google Maps Current Location Train Tab"
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
                    <th>Expected Arrival</th>
                    <th>Expected Departure</th>
                  </tr>
                </thead>
                 <tbody>
                  {currentLocation.trainInfo.map(p => {

                      return (
                        <tr key={p.id}>
                          <td>{p.name}</td>
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
}

export default connect(({loadingStatus, currentLocation, session, homeTab, doUpdate}) => 
  ({loadingStatus, currentLocation, session, homeTab, doUpdate}))(TrainInfo);
