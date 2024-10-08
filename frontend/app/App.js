import axios from "axios";
import { useState, useContext, createContext } from 'react';
require("dotenv").config();

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL = "http://localhost:3001";
const GRADES_URL = BACKEND_URL + "/grades";
const GradesContext = createContext();

const calculateAvg = (grades) => {
  let sum = 0;
  let weight = 0;
  grades.forEach(grade => {
    sum += grade.grade * grade.weight;
    weight += grade.weight;
  });
  return sum / weight;
}

const totalWeight = (grades) => {
  let weights = 0
  grades.forEach(grade => {
    weights += grade.weight
  });
  return weights;
}

function App({initGrades, user_id}) {

  const [grades, setGrades] = useState(initGrades);
  const [expand, setExpand] = useState(false);
  const [editRows, setEditRows] = useState(Array(initGrades.length).fill(false))

  const onExpand = () => {setExpand(!expand)};

  return (
    < GradesContext.Provider value={{grades, setGrades, editRows, setEditRows, user_id}}>
    <div>
      <GradeTable expand={expand} onExpand={onExpand} />
      <Avg />
      <Weight />
    </div>
    </GradesContext.Provider>
  );
}

function GradeTable({ expand, onExpand}){
  const {grades, editRows} = useContext(GradesContext);
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Grade</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        {grades.map((grade, i) => editRows[i]?<EditRow key={grade._id} grade={grade}/>:<GradeRow key={grade._id} grade={grade} />)}
        {expand && <InputRow  onExpand={onExpand}/>}
        <tr>
          <td colSpan="3">
            <button onClick={onExpand}>{expand ? 'Cancel' : 'Add Record'}</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
function GradeRow({grade}){
  const {grades, setGrades, editRows, setEditRows} = useContext(GradesContext);

  const onDelete = async () => {
    await axios.delete(GRADES_URL + "/" + grade._id)
    const new_grades = grades.filter(g => g._id !== grade._id);
    setGrades(new_grades);
  };
  
  const onEdit = async () => {
    const new_edit_rows = editRows.slice();
    const idx = grades.findIndex(g=> g._id === grade._id);
    new_edit_rows[idx] = true;
    setEditRows(new_edit_rows);
  };

  return (
    <tr>
      <td>{grade.name}</td>
      <td>{grade.grade}</td>
      <td>{grade.weight}</td>
      <td> <button onClick={onEdit}>Edit</button></td>
      <td><button onClick={onDelete}>Delete</button></td>      
    </tr>
  );
}

function InputRow({onExpand}){
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [weight, setWeight] = useState('');
  const {grades, setGrades, editRows, setEditRows, user_id} = useContext(GradesContext);
  const onSubmit = async () => {
    const new_grade = await axios.post(GRADES_URL, {
      name: name,
      grade: grade,
      weight: weight,
      user_id: user_id,
    })

    const new_grades = [...grades, new_grade.data];
    const new_edit_rows = [...editRows, false];
    setName('');
    setGrade('');
    setWeight('');
    setGrades(new_grades);
    setEditRows(new_edit_rows);
    onExpand();
  };
  return (
    <tr>
      <td><input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} /></td>
      <td><input type="text" placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} /></td>
      <td><input type="text" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} /></td>
      <td><button onClick={onSubmit}>Submit</button></td>
    </tr>
  );
}

function EditRow({grade}){
  const [name, setName] = useState(grade.name);
  const [grade_, setGrade] = useState(grade.grade);
  const [weight, setWeight] = useState(grade.weight);
  const {grades, setGrades, editRows, setEditRows} = useContext(GradesContext);

  const handlePut = async () => {
    const updated_grade = {
      name: name,
      grade: grade_,
      weight: weight
    };

    const res = await axios.put(GRADES_URL + "/" + grade._id, updated_grade);
    
    const updated_grades = grades.slice();
    const updated_edit_rows = editRows.slice()
    const idx = updated_grades.findIndex(g => g._id === grade._id);
    updated_grades[idx] = res.data;
    updated_edit_rows[idx] = false;

    setGrades(updated_grades);
    setEditRows(updated_edit_rows);
  }

    return (
      <tr>
        <td><input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} /></td>
        <td><input type="text" placeholder="Grade" value={grade_} onChange={e => setGrade(e.target.value)} /></td>
        <td><input type="text" placeholder="Weight" value={weight} onChange={e => setWeight(e.target.value)} /></td>
        <td><button onClick={handlePut}>Submit</button></td>
      </tr>
    );
  }



function Avg(){
  const {grades} = useContext(GradesContext);
  const avg = calculateAvg(grades);
  return (<b> Average: {avg} </b>);
}

function Weight(){
  const {grades} = useContext(GradesContext);
  const weights = totalWeight(grades);
  return (<b>Weight: {weights} </b>)
}
export default App;
