import React from 'react';
import { useEffect, useState } from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

function OverAllUsingDataTable() {
    const [data, setData] = useState([]);
    const [filterdata, setFilterData] = useState([]);
    const [selectedSalesManager, setSelectedSalesManager] = useState('');
    const [selectedTeamManager, setSelectedTeamManager] = useState('');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState('');

    useEffect(() => {
        async function fetchHierarchyData() {
            try {
                const hierarchyData = await axios.get('http://localhost:7000/dsr_report/hierarchical-data-filter');
                setFilterData(hierarchyData.data);
            } catch (error) {
                console.error('Error fetching hierarchical data:', error);
            }
        }

        fetchHierarchyData();
    }, []);

    const handleSalesManagerChange = (event) => {
        const value = event.target.value;
        // localStorage.setItem('selectedSalesManager', value);
        // localStorage.removeItem('selectedTeamManager');
        // localStorage.removeItem('selectedTeamLeader');
        setSelectedSalesManager(value);
        setSelectedTeamManager('');
        setSelectedTeamLeader('');
    };

    const handleTeamManagerChange = (event) => {
        const value = event.target.value;
        // localStorage.setItem('selectedTeamManager', value);
        // localStorage.removeItem('selectedTeamLeader');
        setSelectedTeamManager(value);
        setSelectedTeamLeader('');
    };

    const handleTeamLeaderChange = (event) => {
        const value = event.target.value;
        // localStorage.setItem('selectedTeamLeader', value);
        setSelectedTeamLeader(value);
    };

    const renderSalesManagerDropdown = () => {
        const salesManagers = Object.keys(filterdata);
        const options = salesManagers.map((salesManager) => (
            <option key={salesManager} value={salesManager}>
                {salesManager}
            </option>
        ));

        return (
            <select value={selectedSalesManager} onChange={handleSalesManagerChange}>
                <option value={''}>select manager</option>
                {options}
            </select>
        );
    };

    const renderTeamManagerDropdown = () => {
        if (!selectedSalesManager) return null;

        const filtTeamManagers = filterdata[selectedSalesManager];
        const filteredTeamManagers = Object.keys(filtTeamManagers)
        const options = filteredTeamManagers.map((teamManager) => (
            <option key={teamManager} value={teamManager}>
                {teamManager}
            </option>
        ));

        return (
            <select value={selectedTeamManager} onChange={handleTeamManagerChange}>
                <option value={''}>select Team manager</option>
                {options}
            </select>
        );
    };

    const renderTeamLeaderDropdown = () => {
        if (!selectedSalesManager || !selectedTeamManager) return null;

        const filtTeamLeaders = filterdata[selectedSalesManager][selectedTeamManager];
        const filteredTeamLeaders = Object.keys(filtTeamLeaders)
        const options = filteredTeamLeaders.map((teamLeader) => (
            <option key={teamLeader} value={teamLeader}>
                {teamLeader}
            </option>
        ));

        return (
            <select value={selectedTeamLeader} onChange={handleTeamLeaderChange}>
                <option value={''}>select Team Leader</option>
                {options}
            </select>
        );
    };
    // console.log(selectedSalesManager, selectedTeamManager, selectedTeamLeader, 112)

    useEffect(() => {
        // const selectedSalesManager = localStorage.getItem('selectedSalesManager');
        // const selectedTeamManager = localStorage.getItem('selectedTeamManager');
        // const selectedTeamLeader = localStorage.getItem('selectedTeamLeader');
        // console.log(selectedSalesManager, selectedTeamManager, selectedTeamLeader, 15);

        const params = {
            selectedSalesManager,
            selectedTeamManager,
            selectedTeamLeader,
        };

        const queryString = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/dsr_report/react-table-data?${queryString}`);
                const allRows = response.data;
                const lastTwoRows = allRows.slice(0, -2); // Remove the last two rows
                const lastRow = allRows.slice(-1); // Get the last row

                setData(lastTwoRows.concat(lastRow));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedSalesManager, selectedTeamManager, selectedTeamLeader]);


    const columns = React.useMemo(
        () => [
            {
                Header: 'Asst. Manager',
                accessor: 'AsstManager',
                width: 130,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.AsstManager === data[row.index - 1].AsstManager;

                    const isSameAsNext =
                        row.index < data.length - 1 &&
                        row.original.AsstManager === data[row.index + 1].AsstManager;

                    if (isSameAsPrevious && !isSameAsNext) {
                        const cellClassName = isSameAsPrevious && !isSameAsNext ? 'total-cell' : '';
                        const cellValue = row.value ? `Total ${row.value}` : ``;

                        return (
                            <div className={cellClassName}>
                                {cellValue}
                            </div>
                        );
                    } else if (isSameAsPrevious) {
                        return null;
                    }

                    return row.value;
                },
            },
            {
                Header: 'Team Manager',
                accessor: 'TeamManager',
                width: 140,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.TeamManager === data[row.index - 1].TeamManager;

                    const isSameAsNext =
                        row.index < data.length - 1 &&
                        row.original.TeamManager === data[row.index + 1].TeamManager;

                    if (isSameAsPrevious && !isSameAsNext) {
                        const cellClassName = isSameAsPrevious && !isSameAsNext ? 'total-cell' : '';
                        const cellValue = row.value ? `Total ${row.value}` : `Total`;

                        return (
                            <div className={cellClassName}>
                                {cellValue}
                            </div>
                        );
                    } else if (isSameAsPrevious) {
                        return null;
                    }

                    return row.value;
                },
            }


            ,
            {
                Header: 'Team Leader',
                accessor: 'TeamLeader',
                width: 130,
            },
            {
                Header: 'count',
                accessor: 'TeamLeaderCounselorCount',
                width: 50,
            },
            {
                Header: 'Target',
                accessor: 'Target',
                width: 50,
            },
            {
                Header: 'Admissions',
                accessor: 'Admissions',
                width: 100,
                Cell: ({ value }) => {
                    return <div>{value}</div>;
                },
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        const admissions = rowInfo.original.Admissions;
                        const uniqueAdmissions = [...new Set(state.sortedData.map(row => row._original.Admissions))];
                        uniqueAdmissions.sort((a, b) => b - a);

                        const maxAdmissions = uniqueAdmissions[0];
                        // const thirdMaxAdmissions = uniqueAdmissions[2];
                        const thirdMaxAdmissions = uniqueAdmissions[3];

                        if (admissions === maxAdmissions) {
                            return {};
                        }

                        const percentage = (admissions / thirdMaxAdmissions).toFixed(2);

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
                Header: '% Achieve',
                accessor: '%Achieve',
                width: 70,
                Cell: ({ value }) => {
                    return <div style={{ color: "white" }}>{value}%</div>;
                },
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        const percentageAchieve = parseFloat(rowInfo.original['%Achieve']);
                        let backgroundColor = '';

                        if (percentageAchieve === 50) {
                            backgroundColor = '#f0b624';
                        } else if (percentageAchieve < 50) {
                            backgroundColor = 'red';
                        } else if (percentageAchieve > 50 && percentageAchieve < 100) {
                            backgroundColor = '#ed8f24';
                        } else if (percentageAchieve >= 100) {
                            backgroundColor = 'green';
                        }

                        // Check if the row is not the last row (Grand Total)
                        if (rowInfo.viewIndex !== state.sortedData.length - 1) {
                            return {
                                style: {
                                    background: backgroundColor,
                                },
                            };
                        }
                    }
                    return {};
                },

            },

            {
                Header: 'T-Lead',
                accessor: 'T-Lead',
                width: 50,
            },
            {
                Header: 'Con%',
                accessor: 'Conversion%',
                width: 70,
            },
            {
                Header: 'Coll-Reve',
                accessor: 'Coll-Revenue',
                width: 80,
            },
            {
                Header: 'Bill-Reve',
                accessor: 'Bill-Revenue',
                width: 80
            },
            {
                Header: 'C_PSR',
                accessor: 'C_PSR',
                width: 70,
            },
            {
                Header: 'B_PSR',
                accessor: 'B_PSR',
                width: 70,
            },
            {
                Header: 'C_PCR',
                accessor: 'C_PCR',
                width: 70,
            },
            {
                Header: 'B_PCR',
                accessor: 'B_PCR',
                width: 70,
            },
            {
                Header: 'PCE',
                accessor: 'PCE',
                width: 50,
            },
            {
                Header: 'Rank',
                accessor: 'Rank',
                width: 50,
                getProps: (state, rowInfo, column) => {
                    if (rowInfo && rowInfo.original) {
                        const rolesPresent = ['AsstManager', 'TeamManager', 'TeamLeader'].filter(
                            (role) => rowInfo.original[role]
                        );

                        let backgroundColor = 'red'; // Default background color for one field parent

                        if (rolesPresent.length === 3 && rowInfo.original.Rank < 4) {
                            backgroundColor = 'green'; // If 3 fields present and Rank < 4, set to green
                        } else if (rolesPresent.length === 2) {
                            backgroundColor = '#f0ab0a';
                        } else if (rolesPresent.length === 1) {
                            backgroundColor = '#25f21b';
                        }

                        if (rowInfo.viewIndex !== state.sortedData.length - 1) {
                            return {
                                style: {
                                    background: backgroundColor,
                                    color: "white"
                                },
                            };
                        }
                        if (rowInfo.viewIndex !== state.sortedData.length - 0) {
                            return {
                                style: {
                                    background: "white",
                                    color: "white"
                                },
                            };
                        }
                    }

                    return {};
                },
            },


        ],
        [data]
    );

    const exportToExcel = () => {
        const header = columns.map((column) => column.Header);
        const dataToExport = tableData.map((row) => columns.map((column) => row[column.accessor]));

        const ws = XLSX.utils.aoa_to_sheet([header, ...dataToExport]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'OverallSummary.xlsx');
    };


    const filteredData = data.filter(
        (row) => row.AsstManager && !row.TeamManager && !row.TeamLeader
    );

    const grandTotal = {
        AsstManager: 'Grand Total',
        TeamManager: '',
        TeamLeader: '',
        TeamLeaderCounselorCount: 0,
        Target: 0,
        Admissions: 0,
        '%Achieve': 0,
        'T-Lead': 0,
        'Conversion%': 0,
        'Coll-Revenue': 0,
        'Bill-Revenue': 0,
        'C_PSR': 0,
        'B_PSR': 0,
        'C_PCR': 0,
        'B_PCR': 0,
        'PCE': 0,
    };

    filteredData.forEach((row) => {
        grandTotal.TeamLeaderCounselorCount += row.TeamLeaderCounselorCount;
        grandTotal.Target += row.Target;
        grandTotal.Admissions += row.Admissions;
        grandTotal['%Achieve'] = parseFloat(row['%Achieve']);
        grandTotal['T-Lead'] += parseFloat(row['T-Lead']);
        grandTotal['Conversion%'] = parseFloat(row['Conversion%']);
        grandTotal['Coll-Revenue'] += parseFloat(row['Coll-Revenue']);
        grandTotal['Bill-Revenue'] += parseFloat(row['Bill-Revenue']);
        grandTotal['C_PSR'] = parseFloat(row['C_PSR']);
        grandTotal['B_PSR'] = parseFloat(row['B_PSR']);
        grandTotal['C_PCR'] = parseFloat(row['C_PCR']);
        grandTotal['B_PCR'] = parseFloat(row['B_PCR']);
        grandTotal['PCE'] = parseFloat(row['PCE']);
    });


    grandTotal['%Achieve'] = ((grandTotal.Admissions / grandTotal.Target) * 100).toFixed(2);
    grandTotal['Conversion%'] = ((grandTotal.Admissions / grandTotal['T-Lead']) * 100).toFixed(2);
    grandTotal['C_PSR'] = (grandTotal['Coll-Revenue'] / grandTotal.Admissions).toFixed(2)
    grandTotal['B_PSR'] = (grandTotal['Bill-Revenue'] / grandTotal.Admissions).toFixed(2)
    grandTotal['C_PCR'] = (grandTotal['Coll-Revenue'] / grandTotal.TeamLeaderCounselorCount).toFixed(2)
    grandTotal['B_PCR'] = (grandTotal['Bill-Revenue'] / grandTotal.TeamLeaderCounselorCount).toFixed(2)
    grandTotal['PCE'] = (grandTotal.Admissions / grandTotal.TeamLeaderCounselorCount).toFixed(2)

    const tableData = data.concat(grandTotal);

    return (
        <>
 <div className='m-2 d-flex'>
                <button className='btn btn-primary me-2 active'><Link className='text-white' to={'/'}>CounselorWiseSummary</Link></button>
                <button className='btn btn-primary me-2'><Link className='text-white' to={'/overall-Data-Table'}>Overall Summary</Link></button>
                <button className='btn btn-primary'><Link className='text-white' to={'/tltm'}>TL-TM</Link></button>
                <button className='btn btn-primary ms-2'><Link className='text-white' to={'/Excluding-TL'}>Excluding-TL</Link></button>
                <button className='btn btn-primary ms-2'><Link className='text-white' to={'/group-wise'}>Group-Wise</Link></button>
                <div className='ps-5 d-flex'>
                    <div className='ps-2'>{renderSalesManagerDropdown()}</div>
                    <div className='ps-2'>{renderTeamManagerDropdown()}</div>
                    <div className='ps-2'>{renderTeamLeaderDropdown()}</div>
                </div>
            </div>

            <span className='heading ps-5 pe-5'>Overall Summary</span>
            {/* <div className='ps-5 d-flex'>
                <div className='ps-2'>{renderSalesManagerDropdown()}</div>
                <div className='ps-2'>{renderTeamManagerDropdown()}</div>
                <div className='ps-2'>{renderTeamLeaderDropdown()}</div>
            </div> */}

            <ReactTable
                data={tableData}
                columns={columns}
                defaultPageSize={42}
                pageSizeOptions={[10, 20, 50, 100]}
                getTheadThProps={(state, rowInfo, column) => ({
                    style: {
                        backgroundColor: 'yellow',
                    },
                    className: 'custom-header',
                })}
                className="-striped -highlight custom-table p-2"
                // getTrProps={(state, rowInfo) => {
                //     if (rowInfo && rowInfo.index === tableData.length - 1) {
                //         return {
                //             className: 'last-row',
                //         };
                //     }
                //     return {};
                // }}
                getTrProps={(state, rowInfo) => {
                    if (rowInfo) {
                        const rolesPresent = ['AsstManager', 'TeamManager', 'TeamLeader'].filter(
                            (role) => rowInfo.original[role]
                        );

                        if (rolesPresent.length === 2) {
                            return {
                                className: 'two-fields-row',
                            };
                        }
                        if (rolesPresent.length === 1) {
                            return {
                                className: 'one-fields-row',
                            };
                        }
                        if (rolesPresent.length === 0) {
                            return {
                                className: 'one-fields-row',
                            };
                        }
                        return {};
                    }

                    if (rowInfo && rowInfo.index === tableData.length - 1) {
                        return {
                            className: 'last-row',
                        };
                    }
                    return {};

                }}
            />
            <button className='btn btn-primary m-2' onClick={exportToExcel}>Export to Excel</button>
        </>
    );
}
export default OverAllUsingDataTable;