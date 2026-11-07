export const AddingField = ({ students, labWorkNum, setLabWorkNum }) => {
  return(
  <form className="form">
    <label htmlFor="" className="form-el form-title">Встать в очередь</label>
    <select name="students" className="form-el form-students">
      {students.map((student, id) => (
        <option className="form-students-el" key={id}>{student}</option>
      ))}
    </select>
    <input className="form-el form-work-num" type="number" value={labWorkNum} min="0" onFocus={(e) => e.target.select()} onChange={(e) => setLabWorkNum(e.target.value)} placeholder="Номер сдаваемой лабораторной работы"/>
    <button className="form-el form-but">Отправить</button>
  </form>
  )
}