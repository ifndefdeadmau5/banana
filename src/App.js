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
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import StoreProvider from './context';
import Login from './Login';
import File from './File';
import './App.css';
import { storeContext } from './context';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

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
const Link = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

export default function App() {
  return (
    <ApolloProvider client={client}>
      <StoreProvider>
        <Router>
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

          {/* 스위치는 라우트를 순서대로 훑다가 매칭되는 제일 첫번째 path에 해당되는 컴퍼넌트를 렌더링한다. */}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/users">
              <File />
            </Route>
            <PrivateRoute path="/">
              <Home />
            </PrivateRoute>
          </Switch>
        </Router>
      </StoreProvider>
    </ApolloProvider>
  );
}

function Home() {
  return <h2>Home</h2>;
}
