import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Wysiwyg from './Wysiwyg';

function BunkLogForm({ bunk_id, camper_id, date, data, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Use props or fallback to params
  const bunkIdToUse = bunk_id || params.bunk_id; //WORKING
  const camperIdToUse = camper_id || params.camper_id;
  const dateToUse = date || (location.state?.selectedDate 
    ? new Date(location.state.selectedDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]); //WORKING
  const Data = data || null;
  const bunk_assignment = Data?.campers?.find(c => c.camper_id == camperIdToUse)?.bunk_assignment?.id || null;
  
  // For Quill editor
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  
  // State for camper data
  const [camperData, setCamperData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    bunk_id: bunkIdToUse, //WORKING
    camper_id: camperIdToUse,
    bunk_assignment: bunk_assignment,
    counselor: '',
    date: dateToUse, //WORKING
    not_on_camp: false,
    request_unit_head_help: false,
    request_camper_care_help: false,
    behavior_score: 3,
    participation_score: 3,
    social_score: 3,
    description: '',
  });
  
  // Update form data when camperIdToUse changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      camper_id: camperIdToUse,
      bunk_assignment: bunk_assignment, 
      date: dateToUse,
    }));
  }, [camperIdToUse]);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Get counselors for the dropdown
  const [counselors, setCounselors] = useState([]);

  // Fetch camper data when camper_id changes
  useEffect(() => {
    async function fetchCamperData() {
      if (camperIdToUse) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/v1/bunklogs/${bunkIdToUse}/${date}`
          );
          setCamperData(response.data);
        } catch (err) {
          console.error('Error fetching camper data:', err);
          setError('Failed to load camper data');
        }
      }
    }
    
    fetchCamperData();
  }, [camperIdToUse]);

  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const toolbarOptions = [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'list', 'align', 'justify'],
        ['clean']
      ];

      quillRef.current = new Quill(editorRef.current, {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });

      // Update form data when editor content changes
      quillRef.current.on('text-change', function() {
        setFormData(prev => ({
          ...prev,
          description: quillRef.current.root.innerHTML
        }));
      });
    }
    
    // If not on camp is checked, clear the editor
    if (formData.not_on_camp && quillRef.current) {
      quillRef.current.setText('');
    }
  }, [formData.not_on_camp]);
  
  // Fetch counselors
  useEffect(() => {
    const counselors = camperData?.bunk?.counselors || [];
    setCounselors(
      counselors.map(counselor => ({
        id: counselor.id,
        name: `${counselor.first_name} ${counselor.last_name}`
      }))
  );
  }, [camperData]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Form validation
    if (!formData.counselor) {
      setError('Please select a counselor');
      setLoading(false);
      return;
    }
    
    // Log complete form data including WYSIWYG content
    console.log('Form Data being submitted:', {
      ...formData,
      description: formData.description || (quillRef.current ? quillRef.current.root.innerHTML : '')
    });
    
    try {
      // Reset certain fields if camper is not on camp
      const submissionData = { ...formData };
      if (submissionData.not_on_camp) {
        submissionData.request_unit_head_help = false;
        submissionData.request_camper_care_help = false;
        submissionData.behavior_score = null;
        submissionData.participation_score = null;
        submissionData.social_score = null;
        submissionData.description = '';
      }
      
      // Get API base URL from environment variable or use default
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/v1';
      
      // API call to submit the form
      const response = await axios.post(
        `${API_BASE_URL}/bunklogs/`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        
        // Close the modal and trigger data refresh
        setTimeout(() => {
          if (onClose) {
            // IMPORTANT: Pass true to onClose to indicate successful form submission
            onClose(true); // This will inform the parent component that the form was submitted
            
            // Force page refresh if needed - backup approach
            if (window.location.reload) {
              console.log("Forcing page refresh");
              setTimeout(() => window.location.reload(), 100);
            }
          } else {
            // Fallback to original redirect behavior if no onClose provided
            navigate(`/bunk/${bunkIdToUse}`, { 
              state: { selectedDate: new Date(dateToUse) }
            });
          }
        }, 1500);
      } else {
        setError(`Unexpected response: ${response.status}`);
      }
      
    } catch (err) {
      console.error('Error submitting form:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Error ${err.response.status}: ${err.response.data?.message || 'Failed to submit bunk log'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Network error: No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const campers = camperData?.campers || [];
  const selectedCamper = campers.find(c => c.camper_id == camperIdToUse);
  
  // Get camper name
  const camperName = selectedCamper
    ? `${selectedCamper.camper_first_name} ${selectedCamper.camper_last_name}`
    : 'Selected Camper';

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Bunk Log Entry for {camperName}
      </h1>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Bunk log successfully submitted! Redirecting...
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden field for camper_id */}
        <input 
          type="hidden" 
          name="camper_id" 
          value={camperIdToUse} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input 
              type="date" 
              value={date ? dateToUse : ''} 
              readOnly 
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Date is set from the dashboard
            </p>
          </div>

          {/* Counselor Selection */}
          <div>
            <label htmlFor="counselor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reporting Counselor
            </label>
            <select
              id="counselor"
              name="counselor"
              value={formData.counselor}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Counselor</option>
              {counselors.map(counselor => (
                <option key={counselor.id} value={counselor.id}>
                  {counselor.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Not on Camp Checkbox */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="not_on_camp"
              name="not_on_camp"
              type="checkbox"
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
              checked={formData.not_on_camp}
              onChange={handleChange}
            />
            <label htmlFor="not_on_camp" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Camper not on camp today
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Check this if the camper was absent from camp today. All other fields will be disabled.
          </p>
        </div>

        {/* Conditional Fields - Only show if camper is on camp */}
        {!formData.not_on_camp && (
          <>
            {/* Help Request Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  id="request_unit_head_help"
                  name="request_unit_head_help"
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
                  checked={formData.request_unit_head_help}
                  onChange={handleChange}
                />
                <label htmlFor="request_unit_head_help" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unit Head Help Requested
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="request_camper_care_help"
                  name="request_camper_care_help"
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
                  checked={formData.request_camper_care_help}
                  onChange={handleChange}
                />
                <label htmlFor="request_camper_care_help" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Camper Care Help Requested
                </label>
              </div>
            </div>
            
            {/* Score Sliders */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Camper Scores</h3>
              
              {/* Behavior Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="behavior_score" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Behavior Score: {formData.behavior_score}
                  </label>
                  <span className="text-sm text-gray-500">1-5</span>
                </div>
                <input
                  id="behavior_score"
                  name="behavior_score"
                  type="range"
                  min="1"
                  max="5"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  value={formData.behavior_score}
                  onChange={handleChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              {/* Participation Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="participation_score" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Participation Score: {formData.participation_score}
                  </label>
                  <span className="text-sm text-gray-500">1-5</span>
                </div>
                <input
                  id="participation_score"
                  name="participation_score"
                  type="range"
                  min="1"
                  max="5"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  value={formData.participation_score}
                  onChange={handleChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              {/* Social Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="social_score" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Social Score: {formData.social_score}
                  </label>
                  <span className="text-sm text-gray-500">1-5</span>
                </div>
                <input
                  id="social_score"
                  name="social_score"
                  type="range"
                  min="1"
                  max="5"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  value={formData.social_score}
                  onChange={handleChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
            
            {/* Quill WYSIWYG Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daily Report
              </label>
              <div className="border border-gray-300 rounded-md dark:border-gray-600 overflow-hidden">
                <Wysiwyg 
                  ref={editorRef} 
                  onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                />
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Bunk Log'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BunkLogForm;