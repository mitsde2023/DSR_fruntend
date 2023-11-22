import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ReactTable from 'react-table-6';
import * as XLSX from 'xlsx';

function TltmInd() {
    const [tltmdata, settltmdata] = useState([]);
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
            <select className='btn btn-outline-primary ms-1' value={selectedSalesManager} onChange={handleSalesManagerChange}>
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
            <select className='btn btn-outline-primary ms-1' value={selectedTeamManager} onChange={handleTeamManagerChange}>
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
            <select className='btn btn-outline-primary ms-1' value={selectedTeamLeader} onChange={handleTeamLeaderChange}>
                <option value={''}>select Team Leader</option>
                {options}
            </select>
        );
    };
    // console.log(selectedSalesManager, selectedTeamManager, selectedTeamLeader, 112)
    useEffect(() => {

        const params = {
            selectedSalesManager,
            selectedTeamManager,
            selectedTeamLeader,
        };

        const queryString = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        const fetchTltmInData = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/dsr_report/tltm-in?${queryString}`);
                const tltmInData = response.data;
                settltmdata(tltmInData);
            } catch (error) {
                console.error('Error fetching TL-TM (tltm-in) data:', error);
            }
        };

        fetchTltmInData();
    }, [selectedSalesManager, selectedTeamManager, selectedTeamLeader]);


    const columns = React.useMemo(
        () => [
            {
                Header: 'Asst. Manager',
                accessor: 'SalesManager',
                width: 130,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.SalesManager === tltmdata[row.index - 1].SalesManager;

                    if (isSameAsPrevious) {
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
                        row.original.TeamManager === tltmdata[row.index - 1].TeamManager;

                    if (isSameAsPrevious) {
                        return null;
                    }

                    return row.value;
                },
            }


            ,
            {
                Header: 'Team Leader',
                accessor: 'TeamLeaders',
                width: 130,
            },
            {
                Header: 'count',
                accessor: 'headCount',
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
                width: 100,
                Cell: ({ value }) => {
                    return <div style={{ color: "white" }}>{value}%</div>;
                },
                getProps: (state, rowInfo, column) => {

                    if (rowInfo && rowInfo.original) {
                        const admissions = rowInfo.original.Admissions;
                        const target = rowInfo.original.Target;
                        const percentageAchieve = ((admissions / target) * 100).toFixed(2);
                        let backgroundColor = '';

                        if (percentageAchieve === '50.00') {
                            backgroundColor = '#b8a304';
                        } else if (percentageAchieve < 50) {
                            backgroundColor = 'red';
                        } else if (percentageAchieve > 50 && percentageAchieve < 100) {
                            backgroundColor = '#c76f04';
                        } else if (percentageAchieve >= 100) {
                            backgroundColor = 'green';
                        }

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
                accessor: 'TotalLead',
                width: 50,
            },
            {
                Header: '% Conversion',
                accessor: '%Conversion',
                width: 100,
            },
            {
                Header: 'Coll-Reve',
                accessor: 'CollectedRevenue',
                width: 80,
            },
            {
                Header: 'Bill-Reve',
                accessor: 'BilledRevenue',
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
            }
        ],
        [tltmdata]
    );
    const exportToExcel = () => {
        const header = columns.map((column) => column.Header);
        const dataToExport = tltmdata.map((row) => columns.map((column) => row[column.accessor]));

        const ws = XLSX.utils.aoa_to_sheet([header, ...dataToExport]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, 'TL-TM_Summary.xlsx');
    };

    return (
        <>
            <div className='m-2 d-flex pb-2'>
                <button className='btn btn-primary me-1 active'><Link className='text-white' to={'/'}>CounselorWiseSummary</Link></button>
                <button className='btn btn-primary me-1'><Link className='text-white' to={'/overall-Data-Table'}>Overall Summary</Link></button>
                <button className='btn btn-primary'><Link className='text-white' to={'/tltm'}>TL-TM</Link></button>
                <button className='btn btn-primary ms-1'><Link className='text-white' to={'/Excluding-TL'}>Excluding-TL</Link></button>
                <button className='btn btn-primary ms-1'><Link className='text-white' to={'/group-wise'}>Group-Wise</Link></button>
                <div className='ms-2 d-flex'>
                    <div className='ms-1'>{renderSalesManagerDropdown()}</div>
                    <div className='ms-1'>{renderTeamManagerDropdown()}</div>
                    <div className='ms-1'>{renderTeamLeaderDropdown()}</div>
                    <button className='btn btn-primary ms-1' onClick={exportToExcel}>Export</button>
                </div>
            </div>

            <span className='heading ps-5 pe-5 m-2'>TL /TM- Summary Report ( Individual Admission Count)</span>
            {/* <div className='ps-5 d-flex'>
                <div className='ps-2'>{renderSalesManagerDropdown()}</div>
                <div className='ps-2'>{renderTeamManagerDropdown()}</div>
                <div className='ps-2'>{renderTeamLeaderDropdown()}</div>
            </div> */}
            <ReactTable
                data={tltmdata}
                columns={columns}
                defaultPageSize={32}
                pageSizeOptions={[10, 20, 35, 50, 75, 100]}
                getTheadThProps={(state, rowInfo, column) => ({
                    style: {
                        backgroundColor: 'yellow',
                    },
                    className: 'custom-header',
                })}
                className="-striped -highlight custom-table p-2"
                getTrProps={(state, rowInfo) => {
                    if (rowInfo && rowInfo.index === tltmdata.length - 1) {
                        return {
                            className: 'last-row',
                        };
                    }
                    return {};
                }}

            />

        </>
    )
}

export default TltmInd