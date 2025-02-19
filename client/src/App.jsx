
import { useContext } from 'react';
import { AppContext } from './context/AppContext.jsx';
import LoginForm from './components/shops/login.jsx';
import './index.css'

// Usage
const App = () => {
  const { name,user,isAuth } = useContext(AppContext);
  
  return <>
  <h1 className='text-3xl'>{ user?.fullName}</h1>
  <LoginForm/>
  
  </>;
};

export default App;
