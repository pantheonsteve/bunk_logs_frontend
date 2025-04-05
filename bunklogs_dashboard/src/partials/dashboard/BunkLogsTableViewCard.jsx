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
    return campers.filter((camper) => camper.bunk_log?.not_on_camp === false);
  }

  useEffect(() => {
    if (bunkData && bunkData.campers) {
      setData(filterNotOnCamp(bunkData.campers));
    }
  }, [bunkData]);

  // Get the Counselor Name from the ID
  const getCounselorName = (counselorId, data) => {
    // First check in bunk.counselors (primary location in your data)
    const counselor = data?.bunk?.counselors?.find((c) => c.id === counselorId);
    
    // If found, return the name
    if (counselor) {
      return `${counselor.first_name} ${counselor.last_name}`;
    }
    return "Unknown";
  }

  // Score background color mapping
  const getScoreBackgroundColor = (score) => {
    if (!score) return "bg-gray-100";
    
    const scoreNum = parseInt(score);
    if (scoreNum == 1) return 'bg-[#e86946]';
    if (scoreNum == 2) return 'bg-[#de8d6f]';
    if (scoreNum == 3) return 'bg-[#e5e825]';
    if (scoreNum == 4) return 'bg-[#90d258]';
    if (scoreNum == 5) return 'bg-[#18d128]';
    return "bg-red-100";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="col-span-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Camper Logs</h2>
        
        {/* Table Container with horizontal scroll for mobile */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/50">
              <tr>
                {/* Column width: 2/12 */}
                <th className="w-2/12 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-left">Camper Name</div>
                </th>
                {/* Column width: 1/12 */}
                <th className="w-1/12 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-center">Date</div>
                </th>
                {/* Column width: 2/12 */}
                <th className="w-2/12 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-center">Social</div>
                </th>
                {/* Column width: 2/12 */}
                <th className="w-2/12 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-center">Behavior</div>
                </th>
                {/* Column width: 2/12 */}
                <th className="w-2/12 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-center">Participation</div>
                </th>
                {/* Column width: 3/12 */}
                <th className="w-3/12 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-left">Notes</div>
                </th>
                {/* Column width: 2/12 */}
                <th className="w-2/12 p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="font-semibold text-center">Counselor</div>
                </th>
              </tr>
            </thead>
            
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {data && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="p-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 shrink-0 mr-2 sm:mr-3">
                          <img className="rounded-full border border-gray-200" src={Image01} width="32" height="32" alt={`${item.camper_first_name} ${item.camper_last_name}`} />
                        </div>
                        <Link className="font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400" to={`/camper/${item.id}`}>
                          {item.camper_first_name} {item.camper_last_name}
                        </Link>
                      </div>
                    </td>
                    <td className="p-2 text-center text-gray-600 dark:text-gray-400">
                      {item.bunk_log?.date}
                    </td>
                    <td className={`${getScoreBackgroundColor(item.bunk_log?.social_score)}`}>
                      <div className={`text-center py-1 px-2 font-medium`}>
                        {item.bunk_log?.social_score || 'N/A'}
                      </div>
                    </td>
                    <td className={`${getScoreBackgroundColor(item.bunk_log?.behavior_score)}`}>
                      <div className={`text-center py-1 px-2 font-medium`}>
                        {item.bunk_log?.behavior_score || 'N/A'}
                      </div>
                    </td>
                    <td className={`${getScoreBackgroundColor(item.bunk_log?.participation_score)}`}>
                      <div className={`text-center py-1 px-2 font-medium`}>
                        {item.bunk_log?.participation_score || 'N/A'}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="max-h-20 overflow-y-auto text-sm text-gray-600 dark:text-gray-400" 
                        dangerouslySetInnerHTML={{ __html: item.bunk_log?.description || 'No notes provided' }} />
                    </td>
                    <td className="p-2 text-center text-gray-600 dark:text-gray-400">
                      {getCounselorName(item.bunk_log?.counselor, bunkData)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No camper data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BunkLogsTableViewCard;