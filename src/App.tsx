import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/profile' Component={() => <Profile />} />
        <Route path='/register' Component={() => <Register />} />
        <Route path='/login' Component={() => <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
