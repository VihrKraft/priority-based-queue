import './App.scss'
import { AddingField } from './components/AddingField'
import { Queue } from './components/Queue'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useMemo } from 'react'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [students, setStudents] = useState([])
  const [queue, setQueue] = useState([])
  const [labWorkNum, setLabWorkNum] = useState(0)
  const [curStudentID, setCurStudentID] = useState(() => {
    return localStorage.getItem('my_student_id') || ''
  })

  const activeStudent = queue[0] ?? null;

  const fetchQueue = async () => {
    try {
      const { data: queueData, error: queueError } = await supabase
        .from('queue')
        .select('*')

      if (queueError) throw queueError

      const curQueueData = queueData.sort((a, b) => {
        const labDiff = a.labWorkNum - b.labWorkNum
        if (labDiff !== 0) return labDiff
        return new Date(a.created_at) - new Date(b.created_at)
      }) || []

      setQueue(curQueueData)

    } catch (err) {
      alert(`Ошибка при загрузке очереди: ${err.message}`)
    }
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data: searchData, error: searchError } = await supabase
          .from('students')
          .select('*')
        
        if (searchError) throw searchError

        const curStudent = searchData.sort((a, b) => a.fullName.localeCompare(b.fullName));
        setStudents(curStudent)

      } catch (err) {
        alert(`Ошибка при загрузке студентов: ${err.message}`)
      }
    }
    fetchQueue()
    fetchStudents()
    
    const queueChannel = supabase
      .channel('public:queue')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'queue' },
        (payload) => {
          fetchQueue()
          
          if (payload.eventType === 'DELETE') {
            const savedID = localStorage.getItem('my_student_id')
            if (savedID && payload.old.student_id === savedID) {
              localStorage.removeItem('my_student_id')
              setCurStudentID('') 
            }
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(queueChannel)
    }
  }, [])

  const changeQueue = async (event) => {
    event.preventDefault()

    if (!curStudentID) {
      alert('Ошибка: студент не выбран')
      return
    }

    if (!queue.some(queuer => queuer.student_id === curStudentID)) {
      try {
        if (labWorkNum <= 0) throw new Error('номер лабораторной не выбран')

        const { data: queueData, error: queueError } = await supabase
          .from('queue')
          .insert([{
            passed: false,
            labWorkNum: labWorkNum,
            student_id: curStudentID
          }])
          .select()

        if (queueError) throw queueError

        setQueue(prev => [...prev, ...queueData])
        localStorage.setItem('my_student_id', curStudentID);

      } catch (err) {
        alert(`Ошибка при добавлении в очередь: ${err.message}`)
      }
    }
  }

  const deleteStudentFromQueue = async (e) => {
    try {
      const { error: queueError } = await supabase
        .from('queue')
        .delete()
        .eq('student_id', curStudentID) 

      if (queueError) throw queueError

      setQueue(prev => prev.filter(queuer => queuer.student_id !== curStudentID))
      localStorage.removeItem('my_student_id');
      setCurStudentID('')

    } catch (err) {
      alert(`Ошибка при удалении: ${err.message}`)
    } 
  }

  const availableStudents = useMemo(() => {
    const savedID = localStorage.getItem('my_student_id')
    return students.filter(student => 
      !queue.some(queueItem => queueItem.student_id === student.id) || student.id === savedID
    )
  }, [students, queue])

  const isStudentAlreadyInQueue = !!localStorage.getItem('my_student_id') && queue.some(queuer => queuer.student_id === curStudentID);

  return (
    <div className="App">
      <AddingField 
        students={availableStudents}
        labWorkNum={labWorkNum}
        setLabWorkNum={setLabWorkNum} 
        changeQueue={changeQueue}
        setCurStudentID={setCurStudentID}
        isStudentAlreadyInQueue={isStudentAlreadyInQueue}
      />
      <br/><br/>
      <Queue 
        queue={queue} 
        students={students}
        curStudentID={curStudentID}
        deleteStudentFromQueue={deleteStudentFromQueue}
        activeStudent={activeStudent}
      /> 
    </div>
  )
}

export default App;
