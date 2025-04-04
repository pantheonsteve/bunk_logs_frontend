import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Image01 from '../../images/user-36-05.jpg';
import Image02 from '../../images/user-36-06.jpg';
import Image03 from '../../images/user-36-07.jpg';
import Image04 from '../../images/user-36-08.jpg';
import Image05 from '../../images/user-36-09.jpg';

function TestComponent({ date, bunk }) {
  // Define state for the fetched data, error and loading status.
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Format the date as "YYYY-MM-DD" if needed.
        const formattedDate = date.toISOString().split('T')[0];
        // Build the URL dynamically using bunk and formattedDate.
        const response = await axios.get(
          `https://dev-camper-care-bunk-logs.pantheonsite.io/api/v1/92/${formattedDate}`
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        // Use the 'error' variable consistently.
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 404) {
            setError(
              error.response.data.message ||
                `Missing call ID for bunk ${bunk} on ${formattedDate}`
            );
          } else {
            setError("An error occurred while fetching the summary.");
          }
        } else {
          console.error("Error:", error);
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, bunk]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Campers</h2>
      </header>
        <div className="p-3">

            {/* Table */}
            <div className="overflow-x-auto">
        <table>
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
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
                <th className="p-1 whitespace-wrap">
                  <div className="font-semibold text-left">Camper Care Help</div>
                </th>
                <th className="p-1 whitespace-wrap">
                  <div className="font-semibold text-left">Unit Head Help</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Reporting Counselor</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
            {data.map((item) => (
                <tr key={item.id}>
                    <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                        <img className="rounded-full" src={Image01} width="40" height="40" alt={item.first_name + " " + item.last_name} />
                        </div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">{item.first_name} {item.last_name}</div>
                    </div>
                    </td>
                    <td className="p-1 whitespace-wrap">
                    <div className="text-center text-sm text-black-200">{date.toISOString().split('T')[0]}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.social}`}>
                    <div className={`text-center text-sm text-black-200`}>{item.social}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.behavior}`}>
                    <div className="text-center text-sm text-black-200">{item.behavior}</div>
                    </td>
                    <td className={`p-1 whitespace-wrap bg-${item.participation}`}>
                    <div className="text-center text-sm text-black-200">{item.participation}</div>
                    </td>
                    <td className="p-4 whitespace-wrap">
                    <div className="text-left text-sm text-black-200" dangerouslySetInnerHTML={{ __html: item.notes }} />
                    </td>
                    <td className="p-1 whitespace-nowrap">
                    <div className="text-center text-sm text-green-500">{item.camper_care_help}</div>
                    </td>
                    <td className="p-1 whitespace-nowrap">
                    <div className="text-center text-sm text-green-500">{item.unit_head_help}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                    <div className="text-sm text-center">{item.counselor_id}</div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
</div>
);
}

export default TestComponent;
