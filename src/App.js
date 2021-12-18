import logo from './logo.svg';
import './App.css';

function App() {

  // console.log("process:");
  // console.log(process);
  console.log("process.env:");
  console.log(process.env);
  console.log("process.env.REACT_APP_SERVER_URL:");
  console.log(process.env.REACT_APP_SERVER_URL);
  console.log("typeof(process.env.REACT_APP_SERVER_URL):");
  console.log(typeof(process.env.REACT_APP_SERVER_URL));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
