export const AddingField = () => {
  return(
  <form className="form">
    <label htmlFor="" className="form-el form-title">Встать в очередь</label>
    <select name="students" className="form-el form-students">
      <option value="" className="form-students-el">Нефедов</option>
      <option value="" className="form-students-el">Нефедов</option>
      <option value="" className="form-students-el">Нефедов</option>
      <option value="" className="form-students-el">Нефедов</option>
    </select>
    <input className="form-el form-work-num" type="number" placeholder="Номер сдаваемой лабораторной работы"/>
    <button className="form-el form-but">Отправить</button>
  </form>
  )
}