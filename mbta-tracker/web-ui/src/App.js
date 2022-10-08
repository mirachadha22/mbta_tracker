import "./App.scss";
import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';
import { useEffect } from 'react';
import store from './store';
import * as ch from './socket';

import Nav from './Nav';
import NewUser from './Users/New';
import ViewUser from './Users/View';
import EditUser from './Users/Edit';
import Home from './Predictions/Home';
import ViewSearches from './Searches/List';
import NewSearch from './Searches/New';
import ViewSearch from './Searches/View';
import ViewFavorites from './Favorites/List';
import NewFavorite from './Favorites/New';
import ViewFavorite from './Favorites/View';

function SetTitle({text}) {
  
  useEffect(() => {

    let orig = document.title;
    document.title = text;

    return () => {
      document.title = orig;
    };
  });

  return <div />
}

// function doUpdate() {
//   let action = {
//     type: 'update/set',
//     data: true
//   }
//   store.dispatch(action);
// }

function App() {

  let state = store.getState();
  let email = state?.session?.email;
  
  useEffect(() => {
    if (email !== null) {
      ch.ch_join(email, (st) => {
        let action = {
          type: 'update/set',
          data: st.doUpdate
        }
        store.dispatch(action);
      });
    }
  });

  // useEffect(() => {
  //   setInterval(doUpdate, 60000);
  // });  

  return (
    <Container>
      <SetTitle text="MBTA Tracker" />
      <Nav />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/searches" exact>
          <ViewSearches />
        </Route>
        <Route path="/searches/new" exact>
          <NewSearch />
        </Route>
        <Route path="/searches/view">
          <ViewSearch />
        </Route>
        <Route path="/favorites" exact>
          <ViewFavorites />
        </Route>
        <Route path="/favorites/new" exact>
          <NewFavorite />
        </Route>
        <Route path="/favorites/view">
          <ViewFavorite />
        </Route>
        <Route path="/register" exact>
          <NewUser />
        </Route>
        <Route path="/user/view" exact>
          <ViewUser />
        </Route>
        <Route path="/user/edit" exact>
          <EditUser />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;