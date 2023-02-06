import { Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { List } from './components/List'
import './App.css';

function App() {
  const { listID } = useSelector((state) => state.babyList);
  const url = `/${listID}`;
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact>
            <Redirect to={url} /> 
          </Route>
          <Route
            exact
            path="/:list_id" 
            children={<List />}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
