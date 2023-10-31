import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table-6';
import axios from 'axios';
import 'react-table-6/react-table.css';
import * as XLSX from 'xlsx';

function CounselorWiseSummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7000/dsr_report/counselor-metrics');
        setData(response.data);
        const numberOfDataItems = response.data.length;
        console.log('Number of data items:', numberOfDataItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const calculateAchievement = (row) => {
    const admissions = row.Admissions;
    const target = row.Target;
    const percentage = ((admissions / target) * 100).toFixed(2);

    return percentage;
  };

  // Define a function to calculate the Conversion%
  const calculateConversion = (row) => {
    const admissions = row.Admissions;
    const totalLead = row.TotalLead;
    if (totalLead === 0) {
      return 'N/A';
    } else {
      const percentage = ((admissions / totalLead) * 100).toFixed(2);
      return `${percentage}%`;
    }
  };
  const columns = [
    {
      Header: 'Counselor',
      accessor: 'Counselor',
      width: 120,
      fixed: 'left',
    },
    {
      Header: 'Team Leaders',
      accessor: 'TeamLeaders',
      width: 120,
    },
    {
      Header: 'Team Manager',
      accessor: 'TeamManager',
      width: 120,
    },
    {
      Header: 'S Manager',
      accessor: 'SalesManager',
      Cell: ({ value }) => value === 'Jayjeet Deshmukh' ? 'JD' : value,
      width: 50,
    },

    // {
    //   Header: 'Role',
    //   accessor: 'Role',
    //   width: 100,
    // },
    {
      Header: 'Team',
      accessor: 'Team',
      width: 80,
    },
    {
      Header: 'Status',
      accessor: 'Status',
      width: 70,
    },
    {
      Header: 'Target',
      accessor: 'Target',
      width: 50,
    },
    {
      Header: 'Admissions',
      accessor: 'Admissions',
      width: 50,
    },
    {
      Header: 'Collected Revenue',
      accessor: 'CollectedRevenue',
      width: 80,
      Cell: ({ value }) => {
        return <div>{value}</div>;
      },
      getProps: (state, rowInfo, column) => {
        if (rowInfo && rowInfo.original) {
          const collectedRevenue = rowInfo.original.CollectedRevenue;
          const maxCollectedRevenue = Math.max(...state.sortedData.map(row => row._original.CollectedRevenue));
          const percentage = (collectedRevenue / maxCollectedRevenue).toFixed(2);

          return {
            style: {
              background: `linear-gradient(90deg, rgba(0, 128, 0, ${percentage}), transparent)`,
            },
          };
        } else {
          return {};
        }
      },
    },
    {
      Header: 'BilledRevenue',
      accessor: 'BilledRevenue',
      width: 80,
      Cell: ({ value }) => {
        return <div>{value}</div>;
      },
      getProps: (state, rowInfo, column) => {
        if (rowInfo && rowInfo.original) {
          const billedRevenue = rowInfo.original.BilledRevenue;
          const maxBilledRevenue = Math.max(...state.sortedData.map(row => row._original.BilledRevenue));
          const percentage = (billedRevenue / maxBilledRevenue).toFixed(2);

          return {
            style: {
              background: `linear-gradient(90deg, rgba(0, 128, 0, ${percentage}), transparent)`,
            },
          };
        } else {
          return {};
        }
      },
    },
    {
      Header: 'T-Lead',
      accessor: 'TotalLead',
      width: 50,
    },
    {
      Header: '% Achievement',
      accessor: 'Admissions',
      width: 80,
      Cell: ({ original }) => {
        const achievement = calculateAchievement(original);
        const cellColor = achievement >= 100 ? 'green' : 'red';

        return (
          <div style={{ backgroundColor: cellColor, color: 'white' }}>
            {achievement}%
          </div>
        );
      },
      getProps: (state, rowInfo, column) => {
        if (rowInfo && rowInfo.original) {
          const achievement = calculateAchievement(rowInfo.original);
          const cellColor = achievement >= 100 ? 'green' : 'red';

          return {
            style: {
              backgroundColor: cellColor,
            },
          };
        } else {
          return {};
        }
      },
    },


    {
      Header: 'Conversion%',
      accessor: 'Admissions',
      width: 70,
      Cell: ({ original }) => calculateConversion(original),
    },
    {
      Header: 'C.PSR',
      width: 60,
      accessor: (row) => {
        const collectedRevenue = row.CollectedRevenue;
        const admissions = row.Admissions;
        if (admissions === 0) {
          return 'N/A';
        }
        const cpsr = (collectedRevenue / admissions).toFixed(2);
        return cpsr;
      },
      id: 'cpsr', // Unique ID for the 'C.PSR' column
    },
    {
      Header: 'B.PSR',
      width: 60,
      accessor: (row) => {
        const billedRevenue = row.BilledRevenue;
        const admissions = row.Admissions;
        if (admissions === 0) {
          return 'N/A';
        }
        const bpsr = (billedRevenue / admissions).toFixed(2);
        return bpsr;
      },
      id: 'bpsr', // Unique ID for the 'B.PSR' column
    },
    {
      Header: 'C-Call',
      accessor: 'ConnectedCall',
      width: 50,
    },
    {
      Header: 'Talk Time',
      accessor: 'TalkTime',
      width: 70,
      Cell: ({ value }) => {
        const time = value.split(' ')[1];
        return <span>{time}</span>;
      },
    },
    {
      Header: 'Final',
      accessor: 'Final',
      width: 100,
    },
    {
      Header: 'Group',
      accessor: 'Group',
      width: 50,
    },
    {
      Header: 'CounselorWiseSummaries',
      accessor: 'CounselorWiseSummaries',
      Cell: ({ original }) => (
        <select>
          {original.CounselorWiseSummaries.map((summary, index) => (
            <option key={index}>
              {`${summary.AmountReceived}/${summary.AmountBilled}/${summary.Specialization}`}
            </option>
          ))}
        </select>
      ),
    },

  ];

  const [excelData, setExcelData] = useState(data);

  const exportToExcel = () => {
    // Create an array of data for export
    const dataToExport = data.map(item => ({
      'Counselor': item.Counselor,
      'Team Leaders': item.TeamLeaders,
      'Team Manager': item.TeamManager,
      'Sales Manager': item.SalesManager,
      'Role': item.Role,
      'Team': item.Team,
      'Status': item.Status,
      'Target': item.Target,
      'Admissions': item.Admissions,
      'Collected Revenue': item.CollectedRevenue,
      'Billed Revenue': item.BilledRevenue,
      'Total Lead': item.TotalLead,
      '% Achievement': ((item.Admissions / item.Target) * 100).toFixed(2) + '%',
      'Conversion%': ((item.Admissions / item.TotalLead) * 100).toFixed(2) + '%',
      'C.PSR': (item.CollectedRevenue / item.Admissions).toFixed(2),
      'B.PSR': (item.BilledRevenue / item.Admissions).toFixed(2),
      'Connected Call': item.ConnectedCall,
      'Talk Time': item.TalkTime.split(' ')[1],
      'Final': item.Final,
      'Group': item.Group,
      // 'CounselorWiseSummaries': item.CounselorWiseSummaries,
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data');

    // Save the workbook
    XLSX.writeFile(wb, 'api_data.xlsx');
  };



  return (
    <div className='m-2'>
      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={112}
        pageSizeOptions={[10, 20, 50, 100, 125, 150, 200]}
        getTheadThProps={(state, rowInfo, column) => ({
          style: {
            backgroundColor: 'yellow',
          },
          className: 'custom-header', // Apply the custom header class
        })}
        className="-striped -highlight custom-table" // Apply your custom class here
      />

      <button onClick={exportToExcel}>Export to Excel</button>
    </div>
  )
}

export default CounselorWiseSummary