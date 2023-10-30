import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CounselorWiseSummary from './dsr/CounselorWiseSummary';
function App() {




  return (

    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route></Route>
            <Route exact path="/" element={<CounselorWiseSummary />} />
            {/* <Route exact path="/question" element={<AddQuestionForm />} />
        <Route exact path="/Addquestion" element={<AddQuestionPage />} />
        <Route exact path="/allbets" element={<AllBets />} />
        <Route exact path="/allmatches" element={<AllMatch />} />
        <Route exact path="/allmatches/:id" element={<AllMatchesById />} /> */}
          </Routes>

        </BrowserRouter>

      </div>
    </>

  );
}

export default App;
