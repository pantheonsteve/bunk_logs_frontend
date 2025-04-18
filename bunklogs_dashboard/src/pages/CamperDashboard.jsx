import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import CamperPageSidebar from '../partials/camper-dashboard/CamperPageSidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import SingleDatePicker from '../components/SingleDatepicker';
import BunkLogsCamperViewCard from '../partials/dashboard/BunkLogsCamperViewCard';
import CamperTitleCard from '../partials/dashboard/CamperTitleCard';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import ScoresBarChartCard from '../partials/dashboard/ScoresBarChartCard';
import BarChart03 from '../charts/BarChart03';
import ScoresLineChartCard from '../partials/dashboard/ScoresLineChartCard';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import CamperScoresChart from '../partials/dashboard/CamperScoresChart';

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
        console.log('Attempting API call for camper_id:', camper_id);
        
        // Check if camper_id is valid
        if (!camper_id) {
          console.error('Invalid camper_id:', camper_id);
          setError('Invalid camper ID');
          return;
        }
        
        const url = `http://127.0.0.1:8000/api/v1/camper/${camper_id}/`;
        console.log('API URL:', url);
        
        const response = await axios.get(url);
        console.log('API Response Status:', response.status);
        console.log('API Response Data:', response.data);
        
        setData(response.data || {});
      } catch (error) {
        console.error('API Call Error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [camper_id]);

  console.log('Camper Data:', data); // Debug
  
  // Process data only if it's available
  const bunkAssignments = data?.bunk_assignments || [];
  console.log('Bunk Assignments:', bunkAssignments); // Debug
  const activeBunkAssignments = bunkAssignments.filter(assignment => assignment.is_active);
  // Get the active bunk ID for back linking
  const activeBunkId = activeBunkAssignments.length > 0 ? activeBunkAssignments[0].bunk_id : null;
  const activeBunkName = activeBunkAssignments.length > 0 ? activeBunkAssignments[0].bunk_name : null;

  console.log('Active Bunk ID:', activeBunkId); // Debug

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <CamperPageSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        bunk_id={activeBunkId}
        bunk_name = {activeBunkName}
      />

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
                {loading ? (
                  <div className="animate-pulse h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ) : error ? (
                  <h1 className="text-2xl md:text-3xl text-red-600 font-bold">Error Loading Camper</h1>
                ) : (
                  <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    {data?.camper?.first_name} {data?.camper?.last_name}
                  </h1>
                )}
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              </div>

            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading camper data...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error.message || 'Failed to load camper data'}</span>
              </div>
            )}

            {/* Cards - only render when data is loaded and no errors */}
            {!loading && !error && (
              <div className="grid grid-cols-12 gap-6">
                <ScoresLineChartCard camperData={data.bunk_logs} />
                <BunkLogsCamperViewCard camperData={data} />
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default CamperDashboard;



