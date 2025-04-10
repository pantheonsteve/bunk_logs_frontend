import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import SingleDatePicker from '../components/SingleDatepicker';
import BunkLogsCamperViewCard from '../partials/dashboard/BunkLogsCamperViewCard';
import CamperTitleCard from '../partials/dashboard/CamperTitleCard';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';

import Banner from '../partials/Banner';
import ScoresLineChartCard from '../partials/dashboard/ScoresLineChartCard';

function CamperDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { camper_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log('Camper ID:', camper_id); // formattedDate is in the correct format "YYYY-MM-DD"
        
        //console.log('Fetching data for:', formattedDate); // Debug
        
        const response = await axios.get(
          `http://127.0.0.1:8000//api/v1/camper/${camper_id}`
        );
        
        console.log('Response:', response.data); // Debug
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [camper_id]);

  console.log('Camper Data:', data); // Debug

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">{data?.camper?.first_name} {data?.camper?.last_name}</h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              <ScoresLineChartCard camperData={data} />
              <BunkLogsCamperViewCard camperData = {data}/>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default CamperDashboard;



