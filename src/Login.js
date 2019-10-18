import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import GoogleLogin from 'react-google-login';
import { gql } from 'apollo-boost';
import { useObserver } from 'mobx-react-lite';
import { useQuery } from '@apollo/react-hooks';
import { storeContext } from './context';

// styled-components 로 스타일링한 리액트 컴포넌트
const Wrapper = styled(Paper)`
  width: 450px;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  padding: 16px;
`;

const GET_LIST = gql`
  query GetUrl {
    getList
  }
`;

export default () => {
  // 제어 컴포넌트(Controlled Component)를 사용하기 위한 state 를 정의하고 있다.
  // (https://ko.reactjs.org/docs/forms.html)
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, data } = useQuery(GET_LIST, { fetchPolicy: 'network-only' });
  // useContext 는 가장 가까운 상위의 Provider의 value를 참조해서, 그 값을 사용한다
  const store = React.useContext(storeContext);

  const handleClick = () => {
    console.log(id);
    console.log(password);
  };

  const responseGoogle = ({ profileObj: { email } }) => {
    // MobX Action 호출
    store.setAuth(email);
  };

  // useObserver 로 감싼 부분은 스토어에서 일어난 변경을 감지해서 필요할 때 리렌더링해준다.
  return useObserver(() => {
    if (store.isAuthenticated)
      return (
        <div>
          <p>You've already signned in with: </p>
          <p>{store.email}</p>
        </div>
      );
    return (
      <div>
        <Wrapper>
          <TextField
            name="id"
            label="아이디"
            value={id}
            onChange={e => {
              setId(e.target.value);
            }}
          />
          <TextField
            label="비밀번호"
            type="password"
            name="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
          <Button onClick={handleClick}>전송</Button>
          <GoogleLogin
            clientId="133508043602-pmqleqsi4fegdvlb58b4vnaj2tbdatvj.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </Wrapper>
      </div>
    );
  });
};
