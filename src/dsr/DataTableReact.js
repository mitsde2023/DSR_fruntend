import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'react-table-6/react-table.css';

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

    console.log(hdata, 20);

    const renderTeamLeaders = (teamLeaders) => {
        return Object.keys(teamLeaders).map((leaderName, index) => {
            const leaderData = teamLeaders[leaderName];
            return (
                <tr key={index} className='border'>
                    <th scope="row">{leaderName}</th>
                    <td>{leaderData.Target}</td>
                    <td>{leaderData.TotalLead}</td>
                    <td>{leaderData.Admissions}</td>
                    <td>{leaderData.CollectedRevenue}</td>
                    <td>{leaderData.BilledRevenue}</td>

                </tr>
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
                <div class="container">
                    <div key={index} className='row'>
                        <div className="col col-lg-2 border">
                            {managerName === 'Jayjeet Deshmukh' && 'Pravin Patare' ? <div className="col col-lg-2">{managerName}</div> : <div className="col col-lg-2" style={{ paddingTop: "40%" }}>{managerName}</div>}
                        </div>
                        <div className="col col-lg-10 ">
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
        <div>
            <div className="container">
                <div className="row">
                    <h1>Overall</h1>
                    {Object.keys(hdata).map((salesManagerName, index) => {
                        const salesManagerData = hdata[salesManagerName];
                        return (
                            <div key={index}>
                                <div class="container">
                                    <div class="row">
                                        <div class="col-1 col-md-2 border" style={{ paddingTop: "33%" }}>{salesManagerName}</div>


                                        <div class="col-11 col-md-10">
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
