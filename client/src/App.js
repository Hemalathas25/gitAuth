import logo from './logo.png';
import './App.css';
import Login from "./component/login";

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <Login />
      </header>
    </div>
  );
}

export default App;
