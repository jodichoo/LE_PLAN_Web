import './App.css';
import Signup from './components/Signup'; 
import Login from './components/Login'; 
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
          <Route path='/dashboard' component={Dashboard} />
        </Switch>
      </Router>
      {/* <LandingPage />  */}
      {/* <Signup />
      <Login /> */}
      {/* <Dashboard />  */}
    </div>
  );
}

export default App;
