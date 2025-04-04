import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import SingleDatePicker from '../components/SingleDatepicker';
import NotOnCampCard from '../partials/dashboard/NotOnCampCard';
import CamperCareHelpRequestedCard from '../partials/dashboard/CamperCareHelpRequestedCard';
import UnitHeadHelpRequestedCard from '../partials/dashboard/UnitHeadHelpRequestedCard';
import BunkLogsTableViewCard from '../partials/dashboard/BunkLogsTableViewCard';
import { useLocation } from 'react-router-dom';
import BunkChartTitleCard from '../partials/dashboard/BunkChartTitleCard';
import Banner from '../partials/Banner';
import CategoryScoreCard from '../partials/dashboard/CategoryScoreCard';
import BunkLabelCard from '../partials/dashboard/BunkLabelCard';

const BunkName = "Bunk 19";
const bunk_id = "28";

function BunkDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { bunk_id } = useParams();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date()
  );

  const handleDateChange = React.useCallback((newDate) => {
    // Ensure a clean, new date object is set
    // to avoid React state updates causing unnecessary re-renders
    if (!new Date(newDate).getTime()) return;

    // Update the selected date state
    setSelectedDate(new Date(newDate));
    console.log('New date selected:', newDate);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        console.log('New date selected:', formattedDate); // formattedDate is in the correct format "YYYY-MM-DD"
        
        //console.log('Fetching data for:', formattedDate); // Debug
        
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/bunklogs/${bunk_id}/${formattedDate}`
        );
        
        console.log('Response - Bunklogs:', response.data); // Debug
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [bunk_id, selectedDate]);

  console.log("my data", data); // Debug
  const cabin_name = data?.bunk?.cabin?.name || "Bunk X"; // Default to "Bunk 19" if cabin_name is not available
  const session_name = data?.bunk?.session?.name || "Session X"; // Default to "Session X" if session_name is not available
  const bunk_label = `${cabin_name} - ${session_name}`; // Default to "Bunk 19" if bunk_label is not available // Format date as YYYY-MM-DD
  const selected_date = data?.date || "2025-01-01"; // Format date as YYYY-MM-DD
  
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} date={selected_date}/>

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8 dark:bg-gray-800">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                
              </div>
              <div className="container mb-4 sm:mb-0">
                <div>
                            {/* Right: Actions */}
                  <div className="grid grid-flow-col sm:auto-cols-max justify-start gap-2">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2"><BunkLabelCard bunkLabel={bunk_label} /></h1>
                    </div>
                    {/* Filter button */}
                    <FilterButton align="right" />
                    {/* Datepicker built with React Day Picker */}
                    <SingleDatePicker 
                      align="right" 
                      date={selectedDate} 
                      setDate={handleDateChange} 
                    />
                    {/* Add view button */}
                    <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-full">
                      <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="max-xs:sr-only">Submit Maintenance Request</span>
                    </button>
                    <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-full">
                      <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="max-xs:sr-only">Requests Items</span>
                    </button>
                    
                  </div>
                </div>
              </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {console.log(data.campers)}
              <NotOnCampCard bunkData={data} />
              <UnitHeadHelpRequestedCard bunkData={data} />
              <CamperCareHelpRequestedCard bunkData={data} />
              <BunkLogsTableViewCard bunkData={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default BunkDashboard;