import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Dashbord from './components/Dashbord';
import './css/style.css';

const Application = () => {
  return (
    <>
      <div className="maincontainer">
        <Dashbord />
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Application />} />
      </Routes>
    </Router>
  );
}
