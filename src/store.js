// Mobx 스토어를 생성해주는 함수
// 스토어 자체는 일반 자바스크립트 객체이며
// 사용할 필드(변수, 함수 등)을 여기서 정의한다
// 여기서 정의된 필드들은 MobX 의 유틸리티들에 의해 '관칠 가능'하다
export const createStore = () => {
  const store = {
    email: 'default',
    isAuthenticated: localStorage.getItem('isAuthenticated'),
    // 로그인 성공 후 인증 정보를 저장해주는 함수
    setAuth(email) {
      this.email = email;
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', true);
    },
  };

  return store;
};
