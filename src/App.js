import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CounselorWiseSummary from './dsr/CounselorWiseSummary';
import OverallSummary from './dsr/OverallSummary';
import OverAllUsingDataTable from './dsr/OverAllUsingDataTable';
import TltmInd from './dsr/TltmInd';
// import DataTableReact from './dsr/DataTableReact';
function App() {




  return (

    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route></Route>
            <Route exact path="/" element={<CounselorWiseSummary />} />
            <Route exact path="/overall" element={<OverallSummary />} />
            <Route exact path="/overall-Data-Table" element={<OverAllUsingDataTable />} />
            <Route exact path="/tltm" element={<TltmInd />} />

          </Routes>

        </BrowserRouter>

      </div>
    </>

  );
}

export default App;
