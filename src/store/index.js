import { createStore } from 'vuex'

export default createStore({
  state: {
    Authorization:localStorage.getItem('Authorization')
     ? localStorage.getItem('Authorization') : '',
     userName:localStorage.getItem('userName')
     ? localStorage.getItem('userName') : '',
  },
  mutations: {
    //第一个是state参数，第二个是usr自定义参数，或称为载荷（payload），也就是我在登录的时候传入的数据
    setLogin(state,user){
      state.Authorization = user.Authorization;
      state.userName = user.userName;
      localStorage.setItem('Authorization', user.Authorization);
      localStorage.setItem('userName', user.userName);
    },

  },
  actions: {
  },
  modules: {
  }
})
