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
                        <td style={{ width: "100px" }}>{leaderData.TeamLeaderCounselorCount}</td>
                        <td style={{ width: "100px" }}>{leaderData.Target}</td>
                        <td style={{ width: "100px" }}>{leaderData.Admissions}</td>
                        <td style={{ width: "100px" }}>{((leaderData.Admissions / leaderData.Target) * 100).toFixed(2)}%</td>
                        <td style={{ width: "100px" }}>{leaderData.TotalLead}</td>
                        <td style={{ width: "100px" }}>{((leaderData.Admissions / leaderData.TotalLead) * 100).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{leaderData.CollectedRevenue}</td>
                        <td style={{ width: "100px" }}>{leaderData.BilledRevenue}</td>
                        <td style={{ width: "100px" }}>{(leaderData.CollectedRevenue / leaderData.Admissions).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{(leaderData.BilledRevenue / leaderData.Admissions).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{(leaderData.CollectedRevenue / leaderData.TeamLeaderCounselorCount).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{(leaderData.BilledRevenue / leaderData.TeamLeaderCounselorCount).toFixed(2)}</td>
                        <td style={{ width: "100px" }}>{(leaderData.Admissions / leaderData.TeamLeaderCounselorCount).toFixed(2)}</td>
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


    const renderTotals = (totals) => {
        // Define a function to render the totals row
        return (
          <tr className='border'>
            <td style={{ width: "350px" }}>Total</td>
            <td style={{ width: "150px" }}>{totals.TeamManagerCount}</td>
            <td style={{ width: "150px" }}>{totals.Target}</td>
            <td style={{ width: "150px" }}>{totals.Admissions}</td>
            <td style={{ width: "150px" }}>{((totals.Admissions / totals.Target) * 100).toFixed(2)}%</td>
            <td style={{ width: "150px" }}>{totals.TotalLead}</td>
            <td style={{ width: "150px" }}>{((totals.Admissions / totals.TotalLead) * 100).toFixed(2)}%</td>
            <td style={{ width: "150px" }}>{totals.CollectedRevenue}</td>
            <td style={{ width: "150px" }}>{totals.BilledRevenue}</td>
            <td style={{ width: "150px" }}>{(totals.CollectedRevenue / totals.Admissions).toFixed(2)}</td>
            <td style={{ width: "150px" }}>{(totals.BilledRevenue / totals.Admissions).toFixed(2)}</td>
            <td style={{ width: "150px" }}>{(totals.CollectedRevenue / totals.TeamManagerCount).toFixed(2)}</td>
            <td style={{ width: "150px" }}>{(totals.BilledRevenue / totals.TeamManagerCount).toFixed(2)}</td>
            <td style={{ width: "150px" }}>{(totals.Admissions / totals.TeamManagerCount).toFixed(2)}</td>
          </tr>
        );
      };


    return (
        <div className='custom-table pt-3 pb-5'>
        <div className="container-fluid">
          <div className="row">
            <div class="d-flex flex-row mb-3 border bg-warning">
              {/* Existing table headers */}
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
                        {renderTotals(salesManagerData)} {/* Render Sales Manager totals */}
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

