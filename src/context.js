import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import { createStore } from './store';

// Context Object 를 생성
// React Context 를 사용하기 위한 보일러플레이트 코드이다
export const storeContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
  // useLocalStore: 로컬 observable state 를 생성한다, 
  // 처음에 초기화 함수(createStore)를 실행해서 observable store 를 생성하고 해당 컴포넌트(StoreProvider)의 lifetime 동안 보존된다.

  // createStore 에서 생성된 객체의:
  // - 프로퍼티는 자동적으로 observable 상태가 되며,
  // - getter는 computed 프로퍼티
  // = method  action이 된다.
  const store = useLocalStore(createStore);

  return (
    // React Context Provider, 생성한 Context 를 하위 컴포넌트 트리에 전달해주는 역할을 한다
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export default StoreProvider;
