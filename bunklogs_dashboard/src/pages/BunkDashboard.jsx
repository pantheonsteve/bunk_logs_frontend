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
import BunkLogForm from '../components/form/BunkLogForm';
import Wysiwyg from '../components/form/Wysiwyg';
import BunkLogFormModal from '../components/modals/BunkLogFormModal';

function BunkDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bunkLogModalOpen, setBunkLogFormModalOpen] = useState(false);
  const [selectedCamperId, setSelectedCamperId] = useState(null);
  const [selectedBunkAssignmentID, setBunkAssignmentId] = useState(null);
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

  const handleOpenBunkLogModal = (camperId, camper_bunk_assignment_id) => {
    setSelectedCamperId(camperId);
    setBunkAssignmentId(camper_bunk_assignment_id);
    setBunkLogFormModalOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        const response = await axios.get(
          `http://127.0.0.1:8000/api/v1/bunklogs/${bunk_id}/${formattedDate}`
        );
         
        setData(response.data); // Debug
      } catch (error) {
        console.error('Error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [bunk_id, selectedDate]);

  const handleFormClose = () => {
    setBunkLogFormModalOpen(false);
    setSelectedCamperId(null);
    setBunkAssignmentId(null);
    fetchData();
  }

  const cabin_name = data?.bunk?.cabin?.name || "Bunk X"; // Default if cabin_name is not available
  const session_name = data?.bunk?.session?.name || "Session X"; // Default if session_name is not available
  const bunk_label = `${cabin_name} - ${session_name}`; 
  const selected_date = data?.date || "2025-01-01"; // Format date as YYYY-MM-DD
  
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        date={selected_date} 
        bunk={bunk_id} 
        openBunkModal={handleOpenBunkLogModal}
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions - Main Row Container */}
            <div className="w-full mb-8">
              {/* Responsive Grid: 3 columns that stack on smaller screens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Column A: Title */}
                <div className="p-4">
                  <BunkLabelCard bunkLabel={bunk_label} />
                </div>
                
                {/* Column B: Filter & Date Picker that stay side by side */}
                <div className="p-4">
                  <div className="flex flex-row">
                    {/* Filter Button (3/12 width) */}
                    <div className="w-3/12 pr-2">
                      <FilterButton align="left" />
                    </div>
                    
                    {/* Date Picker (9/12 width) */}
                    <div className="w-9/12">
                      <SingleDatePicker 
                        align="left" 
                        date={selectedDate} 
                        setDate={handleDateChange} 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Column C: Action Buttons that become full width on small screens */}
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Button 1 (6/12 width on larger screens, full width on small) */}
                    <button className="w-full sm:w-6/12 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-full">
                      <svg className="fill-current shrink-0 xs:hidden mr-2" width="16" height="16" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span>Maintenance Request</span>
                    </button>
                    
                    {/* Button 2 (6/12 width on larger screens, full width on small) */}
                    <button className="w-full sm:w-6/12 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-full">
                      <svg className="fill-current shrink-0 xs:hidden mr-2" width="16" height="16" viewBox="0 0 16 16">
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span>Camper Care Items</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {console.log("my data", data)} {/* Debug */}
            {console.log('date', selected_date)} {/* Debug */}

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
            <BunkLogFormModal 
              id="bunklogform-modal" 
              modalOpen={bunkLogModalOpen} 
              setModalOpen={setBunkLogFormModalOpen} 
              title="Create Bunk Log"
            >
              <BunkLogForm 
                bunk_id={bunk_id}
                camper_id={selectedCamperId}
                date={selected_date}
                data={data}
                onClose={handleFormClose}
              />
              </BunkLogFormModal>
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