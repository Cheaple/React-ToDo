import { useState, useEffect  } from "react";
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
  const [showAdd, setShowAdd] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8080/tasks')
    const data = await res.json()
    return data
  }

   // Fetch a task
   const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:8080/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    const data = await res.json()
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // console.log("add task: ", [...tasks, newTask])
    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:8080/tasks/${id}`, {method: 'DELETE'})
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Task
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}
    const res = await fetch(`http://localhost:8080/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json( )
    setTasks(
      tasks.map((task) => (
        task.id === id ? {...task, reminder: data.reminder} : task
      ))
    )
  }

  return (
    <Router>
      <div className="container">
        <Header title='Todo Tracker' onAdd={() => {setShowAdd(!showAdd)}} showAdd={showAdd}/>
        <Routes>
          <Route 
            path="/"
            element={<>
              {showAdd && <AddTask onAdd={addTask}/>}
              { tasks.length > 0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>) : "No Todos"}
            </>}
          />
          <Route path='/about' element={<About/>}/>
        </Routes>
        <Footer/> 
      </div>
    </Router>

  );
}

export default App;
