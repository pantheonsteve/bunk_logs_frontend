import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import Image01 from '../../images/user-36-05.jpg';
import Image02 from '../../images/user-36-06.jpg';
import Image03 from '../../images/user-36-07.jpg';
import Image04 from '../../images/user-36-08.jpg';
import Image05 from '../../images/user-36-09.jpg';


function BunkLogsCamperViewCard({camperData}) {

    // Define state for the fetched data, error and loading status.
      const [error, setError] = useState(null);
      const [loading, setLoading] = useState(false);  // Changed to false since data is passed as prop
      const [data, setData] = useState([]);

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;

      console.log('Rendering BunkLogsCamperViewCard:', camperData); // Debug

      const filterNoNotes = (data) => {
        return data.filter((item) => item.notes !== false);
      }

      useEffect(() => {
        setData(filterNoNotes(camperData));
      }, [camperData]);

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;

      console.log('Rendering BunkLogsCamperViewCard:', data); // Debug

      return (

        <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
            <div className="p-3">

                {/* Table */}
                <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    {/* Table header */}
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="p-3 whitespace-wrap">
                        <div className="font-semibold text-center">Date</div>
                        </th>
                        <th className="p-1 whitespace-wrap">
                        <div className="font-semibold text-center">Social</div>
                        </th>
                        <th className="p-1 whitespace-wrap">
                        <div className="font-semibold text-center">Behavior</div>
                        </th>
                        <th className="p-1 whitespace-wrap">
                        <div className="font-semibold text-center">Participation</div>
                        </th>
                        <th className="p-4 whitespace-nowrap">
                        <div className="font-semibold text-center">Counselor Notes</div>
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
                        <th className="p-4 whitespace-nowrap">
                        <div className="font-semibold text-center">Camper Care Notes</div>
                        </th>
                    </tr>
                    </thead>
                    {/* Table body */}
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                    {data.map((item) => (
                        <tr key={item.nid}>
                            <td className="p-3 whitespace-wrap">
                              <Link 
                                to={`/bunk/${item.bunk}`}
                                state={{ selectedDate: item.date }}
                                >
                                <div className="text-center text-sm text-black-200">{item.date}</div>
                              </Link>
                            </td>
                            <td className={`p-1 whitespace-wrap bg-${item.social}`}>
                                <div className="text-center text-sm text-black-200">{item.social}</div>
                            </td>
                            <td className={`p-1 whitespace-wrap bg-${item.behavior}`}>
                                <div className="text-center text-sm text-black-200">{item.behavior}</div>
                            </td>
                            <td className={`p-1 whitespace-wrap bg-${item.participation}`}>
                                <div className="text-center text-sm text-black-200">{item.participation}</div>
                            </td>
                            <td className="p-3 whitespace-wrap">
                                <div className="text-left text-sm text-black-200" dangerouslySetInnerHTML={{ __html: item.notes }} />
                            </td>
                            <td className="p-1 whitespace-nowrap">
                                <div className="text-center text-sm text-green-500">{item.camper_care_help}</div>
                            </td>
                            <td className="p-1 whitespace-nowrap">
                                <div className="text-center text-sm text-green-500">{item.unit_head_help}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                                <div className="text-sm text-center">{item.reporting_counselor}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                                <div className="text-sm text-center">This are some notes here </div>
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

export default BunkLogsCamperViewCard;
