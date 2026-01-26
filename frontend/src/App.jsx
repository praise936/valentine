import DollsAnimation from "./pages/profileSetup"
import Admin from "./pages/admin"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<DollsAnimation/>}/>
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
    </Router>
  )
}
export default App