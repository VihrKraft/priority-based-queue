import './App.scss';
import { AddingField } from './components/AddingField';
import { Queue } from './components/Queue';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


function App() {

  const [students, setStudents] = useState([])

  const [labWorkNum, setLabWorkNum] = useState(0)

  console.log(labWorkNum)
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const {data: searchData, error: searchError} = await supabase
          .from('students')
          .select('*')

        if (searchError) throw searchError

        setStudents(searchData.map(item => item.fullName).sort())

      } catch (err) {
        alert(`Ошибка: ${err}`)
      }
    }
    fetchStudents()
    
  }, [])

  return (
    <div className="App">
      <AddingField students={students} labWorkNum={labWorkNum} setLabWorkNum={setLabWorkNum}/>
      <br/><br/>
      <Queue/>
    </div>
  );
}

export default App;
