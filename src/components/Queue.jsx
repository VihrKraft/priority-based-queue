export const Queue = ({ queue, students, curStudentID, deleteStudentFromQueue, activeStudent }) => {
  if (!queue || !students) return null
  return (
    <>
      <ul className="queue-list">
        {queue
          .map((queueItem, id) => {
            const studentInfo = students.find(s => s.id === queueItem.student_id)
            return (
              <li key={id} className="queue-list-item">
                {`${queueItem.student_id === curStudentID ? 'Вы:' : ''} ${studentInfo ? studentInfo.fullName : '----'} Лаб. №${queueItem.labWorkNum}`}
                {curStudentID === queueItem.student_id ?
                    <button className="queue-list-exit_button" onClick={(e) => deleteStudentFromQueue(e)}>Выйти</button>
                  :
                    null
                }
              </li>
            )
          })
        }
      </ul>
      <button className="queue-list-pass_button" disabled={activeStudent?.student_id === curStudentID ? false : true} onClick={(e) => deleteStudentFromQueue(e)}>{'Сдал(а) работу'}</button>
    </>
  )
}

