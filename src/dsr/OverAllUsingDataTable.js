import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';

function OverAllUsingDataTable() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:7000/dsr_report/react-table-data');
                const allRows = response.data;
                const lastTwoRows = allRows.slice(0, -2); // Remove the last two rows
                const lastRow = allRows.slice(-1); // Get the last row

                setData(lastTwoRows.concat(lastRow));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Asst. Manager',
                accessor: 'AsstManager',
                width: 80,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.AsstManager === data[row.index - 1].AsstManager;
                    return isSameAsPrevious ? null : row.value;
                },
            },
            {
                Header: 'Team Manager',
                accessor: 'TeamManager',
                width: 120,
                Cell: (row) => {
                    const isSameAsPrevious =
                        row.index > 0 &&
                        row.original.TeamManager === data[row.index - 1].TeamManager;
                    return isSameAsPrevious ? null : row.value;
                },
            },
            {
                Header: 'Team Leader',
                accessor: 'TeamLeader',
                width: 130,
            },
            {
                Header: 'H-count',
                accessor: 'TeamLeaderCounselorCount',
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
                Header: 'Conversion%',
                accessor: 'Conversion%',
                width: 100,
            },
            {
                Header: 'Coll-Revenue',
                accessor: 'Coll-Revenue',
                width: 90,
            },
            {
                Header: 'Bill-Revenue',
                accessor: 'Bill-Revenue',
                width: 90
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
                    return {};
                }}
            />
        </>
    );
}
export default OverAllUsingDataTable;
