import React, { useEffect, useState } from 'react';
import axios from 'axios';
function OverallSummary() {
    const [hdata, setHData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:7000/dsr_report/counselor-data-hir');
                setHData(response.data.SalesManagers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    const renderTeamLeaders = (teamLeaders) => {
        return Object.keys(teamLeaders).map((leaderName, index) => {
            const leaderData = teamLeaders[leaderName];
            return (
                <>
                    <tr key={index} className='border'>
                        <th style={{ width: "150px" }}>{leaderName}</th>
                        <td style={{ width: "100px" }}>{leaderData.TeamLeaderCounselors.length}</td>
                        <td style={{ width: "100px" }}>{leaderData.Target}</td>
                        <td style={{ width: "100px" }}>{leaderData.Admissions}</td>
                        <td style={{ width: "100px" }}>{((leaderData.Admissions / leaderData.Target) * 100).toFixed(2)}%</td>
                        <td style={{ width: "100px" }}>{leaderData.TotalLead}</td>
                        <td style={{ width: "100px" }}>{((leaderData.Admissions / leaderData.TotalLead) * 100).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{leaderData.CollectedRevenue}</td>
                        <td style={{ width: "100px" }}>{leaderData.BilledRevenue}</td>
                        <td style={{ width: "100px" }}>{(leaderData.CollectedRevenue / leaderData.Admissions).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{(leaderData.BilledRevenue / leaderData.Admissions).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{((leaderData.CollectedRevenue / leaderData.TeamLeaderCounselors.length)).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{((leaderData.BilledRevenue / leaderData.TeamLeaderCounselors.length)).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{((leaderData.Admissions / leaderData.TeamLeaderCounselors.length)).toFixed(2)}</td>
                    </tr>
                </>

            );
        });
    };

    const renderTeamManagers = (teamManagers) => {
        if (!teamManagers) {
            return null;
        }
        return Object.keys(teamManagers).map((managerName, index) => {
            const managerData = teamManagers[managerName];
            return (
                <div class="container-fluid">
                    <div key={index} className='row'>

                        <div className="col col-md-1 border">
                            {managerName === 'Jayjeet Deshmukh' && 'Pravin Patare' ? <div className="col col-lg-2">{managerName}</div> : <div className="col col-lg-2" style={{ paddingTop: "40%" }}>{managerName}</div>}
                        </div>
                        <div className="col col-lg-11 ">
                            <table className='table responsive-table'>

                                <tbody style={{ paddingTop: "5px" }}>
                                    {renderTeamLeaders(managerData.TeamLeaders)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className='custom-table pt-3 pb-5'>
            <div className="container-fluid">
                <div className="row">
                    <div class="d-flex flex-row mb-3 border bg-warning">
                        <span class="ps-4">Asst.Manager</span>
                        <span class="ps-5"> Team Manager</span>
                        <span class="ps-5">Team Leaders</span>
                        <span class="ps-3">H-Count</span>
                        <span class="ps-3">Target</span>
                        <span class="ps-4">Admissions</span>
                        <span class="ps-2">% Achieve</span>
                        <span class="ps-4">T-Lead</span>
                        <span class="ps-3">Conversion%</span>
                        <span class="ps-2">Coll-Revenue</span>
                        <span class="ps-2">Bill-Revenue</span>
                        <span class="ps-4">C.PSR</span>
                        <span class="ps-5 ms-2">B.PSR</span>
                        <span class="ps-5">C.PCR</span>
                        <span class="ps-5 ms-1">C.PCR</span>
                        <span class="ps-5 ms-2">PEC</span>
                    </div>
                    {Object.keys(hdata).map((salesManagerName, index) => {
                        const salesManagerData = hdata[salesManagerName];
                        return (
                            <div key={index}>
                                <div class="container-fluid">
                                    <div class="row">

                                        <div class="col-1 col-md-1 border" style={{ paddingTop: "25%" }}>{salesManagerName}</div>
                                        <div class="col-11 col-md-11">
                                            {renderTeamManagers(salesManagerData?.TeamManagers)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
export default OverallSummary;













// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useTable } from 'react-table';

// function OverallSummary() {

//     const [data, setData] = useState([])

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:7000/dsr_report/react-table-data');
//                 setData(response.data);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         fetchData();
//     }, []);

//     const columns = React.useMemo(
//         () => [
//             {
//                 Header: 'Asst. Manager',
//                 accessor: 'Asst. Manager',
//             },
//             {
//                 Header: 'Team Manager',
//                 accessor: 'Team Manager',
//             },
//             {
//                 Header: 'Team Leader',
//                 accessor: 'Team Leader',
//             },
//             {
//                 Header: 'Target',
//                 accessor: 'Target',
//             },
//             {
//                 Header: 'Admissions',
//                 accessor: 'Admissions',
//             },
//             {
//                 Header: '% Achieve',
//                 accessor: '% Achieve',
//             },
//             {
//                 Header: 'T-Lead',
//                 accessor: 'T-Lead',
//             },
//             {
//                 Header: 'Conversion%',
//                 accessor: 'Conversion%',
//             },
//             {
//                 Header: 'Coll-Revenue',
//                 accessor: 'Coll-Revenue',
//             },
//             {
//                 Header: 'Bill-Revenue',
//                 accessor: 'Bill-Revenue',
//             },
//             {
//                 Header: 'TeamLeaderCounselorCount',
//                 accessor: 'TeamLeaderCounselorCount',
//             },
//         ],
//         []
//     );

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         rows,
//         prepareRow,
//     } = useTable({
//         columns,
//         data,
//     });

//     // Calculate column totals
//     const calculateColumnTotal = (columnAccessor) =>
//         rows.reduce((sum, row) => sum + row.values[columnAccessor], 0);

//     return (
//         <div>
//             <table {...getTableProps()} className="table">
//                 <thead>
//                     {headerGroups.map((headerGroup) => (
//                         <tr {...headerGroup.getHeaderGroupProps()}>
//                             {headerGroup.headers.map((column) => (
//                                 <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//                             ))}
//                         </tr>
//                     ))}
//                 </thead>
//                 <tbody {...getTableBodyProps()}>
//                     {rows.map((row) => {
//                         prepareRow(row);
//                         return (
//                             <tr {...row.getRowProps()}>
//                                 {row.cells.map((cell) => {
//                                     return (
//                                         <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                                     );
//                                 })}
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>

//             {/* Display column totals */}
//             <div>
//                 <p>Total Target: {calculateColumnTotal('Target')}</p>
//                 <p>Total Admissions: {calculateColumnTotal('Admissions')}</p>
//                 <p>Total T-Lead: {calculateColumnTotal('T-Lead')}</p>
//                 <p>Total Coll-Revenue: {calculateColumnTotal('Coll-Revenue')}</p>
//                 <p>Total Bill-Revenue: {calculateColumnTotal('Bill-Revenue')}</p>
//                 <p>Total TeamLeaderCounselorCount: {calculateColumnTotal('TeamLeaderCounselorCount')}</p>
//             </div>
//         </div>
//     );
// };

// export default OverallSummary;













// react data table -6 



// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import ReactTable from 'react-table-6';
// import 'react-table-6/react-table.css';

// function OverallSummary() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:7000/dsr_report/react-table-data');
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: 'Asst. Manager',
//         accessor: 'AsstManager',
//         Cell: (row) => {
//           const isSameAsPrevious =
//             row.index > 0 &&
//             row.original.AsstManager === data[row.index - 1].AsstManager;
//           return isSameAsPrevious ? null : row.value;
//         },
//       },
//       {
//         Header: 'Team Manager',
//         accessor: 'TeamManager',
//         Cell: (row) => {
//           const isSameAsPrevious =
//             row.index > 0 &&
//             row.original.TeamManager === data[row.index - 1].TeamManager;
//           return isSameAsPrevious ? null : row.value;
//         },
//       },
//       {
//         Header: 'Team Leader',
//         accessor: 'TeamLeader',
//       },
//       {
//         Header: 'Target',
//         accessor: 'Target',
//       },
//       {
//         Header: 'Admissions',
//         accessor: 'Admissions',
//       },
//       {
//         Header: '% Achieve',
//         accessor: '%Achieve',
//       },
//       {
//         Header: 'T-Lead',
//         accessor: 'T-Lead',
//       },
//       {
//         Header: 'Conversion%',
//         accessor: 'Conversion%',
//       },
//       {
//         Header: 'Coll-Revenue',
//         accessor: 'Coll-Revenue',
//       },
//       {
//         Header: 'Bill-Revenue',
//         accessor: 'Bill-Revenue',
//       },
//       {
//         Header: 'TeamLeaderCounselorCount',
//         accessor: 'TeamLeaderCounselorCount',
//       },
//     ],
//     [data]
//   );

//   return (
//     <>
//       <ReactTable
//         data={data}
//         columns={columns}
//         defaultPageSize={32}
//         pageSizeOptions={[10, 20, 50, 100]}
//         getTheadThProps={(state, rowInfo, column) => ({
//           style: {
//             backgroundColor: 'yellow',
//           },
//           className: 'custom-header',
//         })}
//         className="-striped -highlight custom-table"
//       />
//     </>
//   );
// }

// export default OverallSummary;
