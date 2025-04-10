import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const getBunkAssignment = (camper_id, bunk_id) => {
    const api_call = 'http://127.0.0.1:8000/api/v1/bunk-assignments/';
    
    return axios.get(api_call)
        .then(response => {
            const assignments = response.data;
            // Find the assignment where both camper.id and bunk.id match the provided IDs
            const matchingAssignment = assignments.find(assignment => 
                assignment.bunk.id === bunk_id && 
                assignment.camper.id === camper_id
            );
            return matchingAssignment || null;
        })
        .catch(error => {
            console.error('Error fetching bunk assignments:', error);
            throw error;
        });
}

export default getBunkAssignment;