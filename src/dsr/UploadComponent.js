import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const UploadComponent = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const onDropExcel = (acceptedFiles) => {
    setExcelFile(acceptedFiles[0]);
  };

  const onDropUpload = (acceptedFiles) => {
    setUploadFile(acceptedFiles[0]);
  };

  const { getRootProps: getRootPropsExcel, getInputProps: getInputPropsExcel } = useDropzone({
    onDrop: onDropExcel,
    accept: '.xlsx', // Adjust to the accepted file type
    maxFiles: 1, // Allow only one file to be uploaded
  });

  const { getRootProps: getRootPropsUpload, getInputProps: getInputPropsUpload } = useDropzone({
    onDrop: onDropUpload,
    accept: '.xlsx',
    maxFiles: 1,
  });

  const handleExcelUpload = async () => {
    if (!excelFile) {
      alert('Please select an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', excelFile);

    try {
      await axios.post('http://localhost:7000/summary/upload', formData);
      alert('Excel file uploaded successfully!');
    } catch (error) {
      console.error('Error uploading Excel file:', error.message);
      alert('Error uploading Excel file.');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', uploadFile);

    try {
      await axios.post('http://localhost:7000/upload', formData);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error.message);
      alert('Error uploading file.');
    }
  };

//   const handleDeleteAllRecords = async () => {
//     try {
//       await axios.delete('http://localhost:7000/data_Delete/deleteAllRecords');
//       alert('All records deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting records:', error.message);
//       alert('Error deleting records.');
//     }
//   };

const handleDeleteAllRecords = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete all records?');
  
    if (isConfirmed) {
      try {
        await axios.delete('http://localhost:7000/data_Delete/deleteAllRecords');
        alert('All records deleted successfully!');
      } catch (error) {
        console.error('Error deleting records:', error.message);
        alert('Error deleting records.');
      }
    } else {
      alert('Deletion canceled.');
    }
  };
  
  return (
    <div>
      <h2>Excel File With Student Data & LeadID</h2>
      <div {...getRootPropsExcel()} style={dropzoneStyle}>
        <input {...getInputPropsExcel()} />
        <p class="btn btn-secondary">Drag and drop or click to select</p>
      </div>
      {excelFile && (
        <div>
          <p>Selected File: {excelFile.name}</p>
          <button className='btn btn-primary' onClick={handleExcelUpload}>Upload File</button>
        </div>
      )}

      <hr />

      <h2>Excel File With Counselor Data With Target</h2>
      <div {...getRootPropsUpload()} style={dropzoneStyle}>
        <input {...getInputPropsUpload()} />
        <p class="btn btn-secondary">Drag and drop or click to select</p>
      </div>
      {uploadFile && (
        <div>
          <p>Selected File: {uploadFile.name}</p>
          <button className='btn btn-primary' onClick={handleUpload}>Upload File</button>
        </div>
      )}

      <hr />

      <h2>Delete All Records</h2>
      <button className='btn btn-danger' onClick={handleDeleteAllRecords}>Delete All Records</button>
    </div>
  );
};

const dropzoneStyle = {
  width: '60%',
  height: '100px',
  border: '2px dashed blue',
  borderRadius: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  margin: '20px auto',
};

export default UploadComponent;


// Pratik Kadam2:40 PM
// https://mitsde-staging-api.edmingle.com/nuSource/api/v1/
// Pratik Kadam2:42 PM
// newerp@mitsde.com
// Pratik Kadam2:45 PM
// {
//   "username": "newerp@mitsde.com",
//   "password": "test",
//   "persistent_login": true
// }
// Pratik Kadam2:49 PM
// e8a5827a38ba5546650bcb7ca256d799
// https://mitsde-staging-api.edmingle.com
// avz-gaet-nwt


// {
//     "code": 200,
//     "message": "Login successful",
//     "user": {
//         "username": "NewPrepStaging8674477",
//         "apikey": "34c376e9a999a96f29b86989d9f4513e",
//         "role": 2,
//         "user_id": 19793,
//         "name": "NewPrepStaging",
//         "contact_number": "8798789878",
//         "email": "newerp@mitsde.com",
//         "is_sign_up": 0,
//         "server_key": "aeca6e9038201f07add1e4d35ebe8d29"
//     }
// }