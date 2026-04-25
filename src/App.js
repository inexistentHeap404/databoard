import './App.css';
import Table from './Table';
import Upload from './Upload';
import { useState } from 'react';
export default function App() {
  const [showUpload, setShowUpload] = useState(false);
  return (
    <div>
      {/* databoard */}
      <div className="nav">
        DATABOARD
      </div>
      <div className="bigcardholder">
        <div onClick={()=>{setShowUpload(true)}} className="bigcard uploadcard">Upload New Dataset Link</div>
      </div>
      {showUpload && <Upload onClose={()=>{setShowUpload(false)}} />}
      <Table />
    </div>
  );
}
