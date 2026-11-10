export const AddingField = ({ students, labWorkNum, setLabWorkNum, changeQueue, setCurStudentID, isStudentAlreadyInQueue }) => {
  return(
  <form className="form" onSubmit={(e) => changeQueue(e)}>
    <label htmlFor="" className="form-el form-title">{isStudentAlreadyInQueue ? 'В очереди' : 'Встать в очередь'}</label>
    <select disabled={isStudentAlreadyInQueue} name="students" className="form-el form-students" onChange={(e) => setCurStudentID(e.target.value)}>
      <option value={null}>-- Выберите ваше имя --</option>
      {students.map((student) => {
        return <option className="form-students-el" key={student.id} value={student.id}>{student.fullName}</option>
      })}
    </select>
    <input disabled={isStudentAlreadyInQueue} className="form-el form-work-num" type="number" value={labWorkNum} min="0" onFocus={(e) => e.target.select()} onChange={(e) => setLabWorkNum(e.target.value)} placeholder="Номер сдаваемой лабораторной работы"/>
    <button className="form-el form-but">Отправить</button>
  </form>
  )
}