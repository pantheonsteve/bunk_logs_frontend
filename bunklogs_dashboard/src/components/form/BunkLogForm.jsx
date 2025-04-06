import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Wysiwyg from './Wysiwyg';

function BunkLogForm({ bunk_id, camper_id, date }) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Use props or fallback to params
  const bunkIdToUse = bunk_id || params.bunk_id;
  const camperIdToUse = camper_id || params.camper_id;
  const dateToUse = date || (location.state?.selectedDate 
    ? new Date(location.state.selectedDate).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]);
  
  // For Quill editor
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  
  // State for camper data
  const [camperData, setCamperData] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    bunk_id: bunkIdToUse,
    camper_id: camperIdToUse,
    counselor_id: '',
    date: dateToUse,
    not_on_camp: false,
    unit_head_help_requested: false,
    camper_care_help_requested: false,
    behavior_score: 3,
    participation_score: 3,
    social_score: 3,
    description: '',
  });
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Get counselors for the dropdown
  const [counselors, setCounselors] = useState([]);

  console.log('Camper Data:', camperData);
  
  // Fetch camper data when camper_id changes
  useEffect(() => {
    async function fetchCamperData() {
      if (camperIdToUse) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/v1/campers/${camperIdToUse}`
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
    // In a real app, you would fetch this from API or use context
    setCounselors([
      { id: 1, name: 'Jane Smith' },
      { id: 2, name: 'John Doe' },
      { id: 3, name: 'Alex Johnson' },
    ]);
  }, []);
  
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
    
    try {
      // Reset certain fields if camper is not on camp
      const submissionData = { ...formData };
      if (submissionData.not_on_camp) {
        submissionData.unit_head_help_requested = false;
        submissionData.camper_care_help_requested = false;
        submissionData.behavior_score = null;
        submissionData.participation_score = null;
        submissionData.social_score = null;
        submissionData.description = '';
      }
      
      // API call to submit the form
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v1/bunklogs/create',
        submissionData
      );
      
      setSuccess(true);
      // Redirect back to bunk dashboard after successful submission
      setTimeout(() => {
        navigate(`/bunk/${bunkIdToUse}`, { 
          state: { selectedDate: new Date(dateToUse) }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to submit bunk log');
    } finally {
      setLoading(false);
    }
  };
  
  // Get camper name
  const camperName = camperData?.first_name && camperData?.last_name 
    ? `${camperData.first_name} ${camperData.last_name}`
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
      
      {/* Form content continues as before */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date - Read only, comes from context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input 
              type="date" 
              value={formData.date} 
              readOnly 
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Date is set from the dashboard
            </p>
          </div>
          
          {/* Counselor Selection */}
          <div>
            <label htmlFor="counselor_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reporting Counselor
            </label>
            <select
              id="counselor_id"
              name="counselor_id"
              value={formData.counselor_id}
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
              checked={formData.not_on_camp}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
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
                  id="unit_head_help_requested"
                  name="unit_head_help_requested"
                  type="checkbox"
                  checked={formData.unit_head_help_requested}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
                />
                <label htmlFor="unit_head_help_requested" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unit Head Help Requested
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="camper_care_help_requested"
                  name="camper_care_help_requested"
                  type="checkbox"
                  checked={formData.camper_care_help_requested}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600"
                />
                <label htmlFor="camper_care_help_requested" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  value={formData.behavior_score}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
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
                  value={formData.participation_score}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
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
                  value={formData.social_score}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
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
                <Wysiwyg ref={editorRef} />
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