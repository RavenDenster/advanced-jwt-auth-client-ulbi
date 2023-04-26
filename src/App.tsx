
import { observer } from 'mobx-react-lite';
import { storeAnnotation } from 'mobx/dist/internal';
import React, {FC, useContext, useEffect, useState} from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
  
  const {store} = useContext(Context)
  //@ts-ignore
  const [users, setUsers] = useState<IUser>([])

  useEffect(() => {
    if(localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      //@ts-ignore
      setUsers(response.data)
    } catch(e) {
        console.log(e)
    }
  }

  if(store.isLoading) {
    return <div>Загрузка...</div>
  }

  if(!store.isAuth) {
    return (
      <LoginForm/>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'Авторивуйся'}</h1>
      <h1>{store.user.isActivated ? 'Аккаунт подтвержден по почте' : 'Подтвердите аккаунт!!!'}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {/* @ts-ignore */}
      {users.map(user =>
          <div key={user.email}>{user.email}</div>
        )}
    </div>
  );
}

export default observer(App);
