import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

function CamperList({ bunk_id, date }) {

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await axios.get(
              //`https://dev-camper-care-bunk-logs.pantheonsite.io/api/v1/campers?bunk_id=${bunk_id}`
              `http://127.0.0.1:8000/api/v1/bunklogs/${bunk_id}/${date}`
            );
            setData(response.data.campers);
            console.log('Bunk ID:', bunk_id); // Debug
            console.log('Formatted Date:', date); // Debug
            console.log('Response:', response.data.campers); // Debug
          } catch (error) {
            setError('Error fetching campers.');
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    }, [bunk_id, date]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            {data.map((camper) => (
                <div key={camper.camper_id}>
                    <NavLink
                        end
                        to={`/camper/${camper.camper_id}`}
                        className={({ isActive }) =>
                        "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                        }
                    >
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        {camper.camper_first_name} {camper.camper_last_name}
                        </span>
                    </NavLink>
                </div>
            ))}
        </>
    );
}

export default CamperList;