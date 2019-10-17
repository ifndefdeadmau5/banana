import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
  Redirect,
} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import StoreProvider from './context';
import Login from './Login';
import './App.css';
import { storeContext } from './context';

// store.isAuthenticated 값에 따라 로그인 페이지, 혹은 인증이 필요한 페이지를 띄워준다.
function PrivateRoute({ children, ...rest }) {
  const store = React.useContext(storeContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        store.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

// https://material-ui.com/guides/composition/#button
const Link = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

export default function App() {
  return (
    <StoreProvider>
      <Router>
        <div>
          <Typography position="static">
            <AppBar position="static">
              <Toolbar>
                <Button component={Link} to="/">
                  Home
                </Button>
                <Button component={Link} to="/login">
                  Login
                </Button>
                <Button component={Link} to="/users">
                  Users
                </Button>
              </Toolbar>
            </AppBar>
          </Typography>
          <nav>
            <ul></ul>
          </nav>

          {/* 스위치는 라우트를 순서대로 훑다가 매칭되는 제일 첫번째 path에 해당되는 컴퍼넌트를 렌더링한다. */}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <PrivateRoute path="/users">
              <Users />
            </PrivateRoute>
            <PrivateRoute path="/">
              <Home />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </StoreProvider>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
