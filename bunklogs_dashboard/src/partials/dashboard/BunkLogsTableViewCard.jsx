import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Image01 from '../../images/user-36-05.jpg';
import Image02 from '../../images/user-36-06.jpg';
import Image03 from '../../images/user-36-07.jpg';
import Image04 from '../../images/user-36-08.jpg';
import Image05 from '../../images/user-36-09.jpg';

function BunkLogsTableViewCard({ bunkData }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);  // Changed to false since data is passed as prop
  const [data, setData] = useState(bunkData);

  const filterNotOnCamp = (campers) => {
    return campers.filter((camper) => camper.bunk_log?.not_on_camp == false);
  }

  useEffect(() => {
          if (bunkData && bunkData.campers) {
              setData(filterNotOnCamp(bunkData.campers));
          }
      }, [bunkData]);

  console.log('BunkLogsTableViewCard - Data:', data);

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table>
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 dark:bg-gray-700/50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Camper Name</div>
                </th>
                <th className="p-1 whitespace-nowrap">
                  <div className="font-semibold text-left">Date</div>
                </th>
                <th className="p-1 whitespace-wrap score-column">
                  <div className="font-semibold text-xs text-center">Social</div>
                </th>
                <th className="p-1 whitespace-wrap score-column">
                  <div className="font-semibold text-xs text-center">Behavior</div>
                </th>
                <th className="p-1 whitespace-wrap score-column">
                  <div className="font-semibold text-xs text-center">Participation</div>
                </th>
                <th className="p-4 whitespace-nowrap">
                  <div className="font-semibold text-center">Notes</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Reporting Counselor</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {data?.map((item) => {
                // Format the date
                //const formattedDate = new Date(item.date).toISOString().split('T')[0];
                
                return (
                  <tr key={item.id}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                          <img className="rounded-full" src={Image01} width="40" height="40" alt={`${item.camper_first_name} ${item.camper_last_name}`} />
                        </div>
                        <Link className="font-medium text-gray-800 dark:text-gray-100" to={`/camper/${item.id}`}>
                          {item.camper_first_name} {item.camper_last_name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-1 whitespace-wrap">
                      <div className="text-center text-sm text-black-200">{item.bunk_log?.date}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.bunk_log?.social_score}`}>
                      <div className={`text-center text-sm text-black-200`}>{item.bunk_log?.social_score}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.bunk_log?.behavior_score}`}>
                      <div className={`text-center text-sm text-black-200`}>{item.bunk_log?.behavior_score}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.bunk_log?.participation_score}`}>
                      <div className={`text-center text-sm text-black-200`}>{item.bunk_log?.participation_score}</div>
                    </td>
                    <td className="p-4 whitespace-wrap">
                      <div className="text-left text-sm text-black-200" dangerouslySetInnerHTML={{ __html: item.bunk_log?.description }} />
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-sm text-center">{item.bunk_log?.counselor}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BunkLogsTableViewCard;