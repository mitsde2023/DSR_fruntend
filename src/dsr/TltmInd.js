import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactTable from 'react-table-6';
import * as XLSX from 'xlsx';

function TltmInd() {
    const [tltmdata, settltmdata] = useState([]);

    useEffect(() => {
        async function fetchTlTmData() {
            const resData = await axios.get('http://localhost:7000/dsr_report/tltm-in');
            settltmdata(resData.data);
        }
        fetchTlTmData();
    }, [])

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

        XLSX.writeFile(wb, 'TL-TM.xlsx');
    };

    return (
        <>
            <ReactTable
                data={tltmdata}
                columns={columns}
                defaultPageSize={32}
                pageSizeOptions={[10, 20, 50, 100]}
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
            <button onClick={exportToExcel}>Export to Excel</button>

        </>
    )
}

export default TltmInd