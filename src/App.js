import './App.scss';
import { AddingField } from './components/AddingField';
import { Queue } from './components/Queue';

function App() {
  return (
    <div className="App">
      <AddingField/>
      <br/><br/>
      <Queue/>
    </div>
  );
}

export default App;
