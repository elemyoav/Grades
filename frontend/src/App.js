import './App.css';
import { useEffect, useState, useContext, createContext } from 'react';

const backendUrl = 'http://localhost:3001';
const GradesContext = createContext();

const calculateAvg = (grades) => {
  console.log(grades);
  let sum = 0;
  let weight = 0;
  grades.forEach(grade => {
    sum += grade.grade * grade.weight;
    weight += grade.weight;
  });
  return sum / weight;
}


function App() {
  // read the grades from the json file
  const [grades, setGrades] = useState([]);
  const [avg, setAvg] = useState(0);
  const [expand, setExpand] = useState(false);
  useEffect( () => {
    const fetchData = async () => {
    try {
      const response = await fetch(backendUrl);
      const data = (await response.json()).grades;
      console.log(data);
      setGrades(data);
      setAvg(avg);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    // Call the fetchData function
  fetchData();
  }, []);


  const onExpand = () => {setExpand(!expand)};

  return (
    < GradesContext.Provider value={{grades, setGrades}}>
    <div>
      <GradeTable expand={expand} onExpand={onExpand} />
      <Avg />
    </div>
    </GradesContext.Provider>
  );
}

function GradeTable({ expand, onExpand}){
  const {grades} = useContext(GradesContext);
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
        {grades.map(grade => <GradeRow key={grade.name} {...grade} />)}
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
function GradeRow({name, grade, weight}){
  const {grades, setGrades} = useContext(GradesContext);
  const onDelete = async () => {
    // await fetch(backendUrl+'/'+name, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    const new_grades = grades.filter(grade => grade.name !== name);
    setGrades(new_grades);
  };
  
  const onEdit = async () => {
    // await fetch(backendUrl+'/'+name, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({name: name,grade: Number(grade),weight: Number(weight)})
    // });
    const new_grades = [...grades, {name: name, grade: Number(grade), weight: Number(weight)}];
    setGrades(new_grades);
  };

  return (
    <tr>
      <td>{name}</td>
      <td>{grade}</td>
      <td>{weight}</td>
      <td> <button onClick={onEdit}>Edit</button></td>
      <td><button onClick={onDelete}>Delete</button></td>      
    </tr>
  );
}

function InputRow({onExpand}){
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [weight, setWeight] = useState('');
  const {grades, setGrades} = useContext(GradesContext);
  const onSubmit = async () => {
    // await fetch(backendUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },   
    //   body: JSON.stringify({name: name,grade: Number(grade),weight: Number(weight)})
    // });
    setName('');
    setGrade('');
    setWeight('');
    const new_grades = [...grades, {name: name, grade: Number(grade), weight: Number(weight)}];
    setGrades(new_grades);
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

function Avg(){
  const {grades} = useContext(GradesContext);
  const avg = calculateAvg(grades);
  return (<b> Average: {avg} </b>);
}

export default App;
