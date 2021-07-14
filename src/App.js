import './styles/App.css';
import Signup from './components/Signup'; 
import Login from './components/Login'; 
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Settings from './components/Settings'; 
import Profile from './components/Profile'; 
import { AuthProvider } from './contexts/AuthContexts';
import PrivateRoute from './components/PrivateRoute'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <AuthProvider>
            <Route exact path='/' component={LandingPage} />
            <Route path='/signup' component={Signup} />
            <Route path='/login' component={Login} />
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <PrivateRoute path='/profile' component={Profile} />
            <PrivateRoute path='/settings' component={Settings} />
          </AuthProvider>
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
