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

  const filterNotOnCamp = (data) => {
      return data.filter((item) => item.not_on_camp !== '1');
    }

  useEffect(() => {
    setData(filterNotOnCamp(bunkData));
  }, [bunkData]);

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
                const formattedDate = new Date(item.date).toISOString().split('T')[0];
                
                return (
                  <tr key={item.id}>
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                          <img className="rounded-full" src={Image01} width="40" height="40" alt={`${item.first_name} ${item.last_name}`} />
                        </div>
                        <Link className="font-medium text-gray-800 dark:text-gray-100" to={`/camper/${item.id}`}>
                          {item.first_name} {item.last_name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-1 whitespace-wrap">
                      <div className="text-center text-sm text-black-200">{formattedDate}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.social}`}>
                      <div className={`text-center text-sm text-black-200`}>{item.social}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.behavior}`}>
                      <div className={`text-center text-sm text-black-200`}>{item.behavior}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.participation}`}>
                      <div className={`text-center text-sm text-black-200`}>{item.participation}</div>
                    </td>
                    <td className="p-4 whitespace-wrap">
                      <div className="text-left text-sm text-black-200" dangerouslySetInnerHTML={{ __html: item.notes }} />
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <div className="text-sm text-center">{item.counselor_id}</div>
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