import {BrowserRouter, Routes, Route} from 'react-router-dom'

// pages & components  
import AnnotationPage from './pages/AnnotationPage';
import WelcomePage from './pages/WelcomePage';
import TrainingPage from './pages/TrainingPage';
import SubmissionPage from './pages/SubmissionPage';
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
        <div>
          <Routes>
            <Route
              path="/examples"
              element={<AnnotationPage/>}
            />
            <Route
              path='/'
              element={<WelcomePage/>}
            />
            <Route
              path='/training'
              element={<TrainingPage/>}
            />
            <Route
              path='/submission'
              element={<SubmissionPage/>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
