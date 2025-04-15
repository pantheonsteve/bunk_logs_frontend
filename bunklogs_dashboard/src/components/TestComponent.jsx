import React, { useState, useEffect } from 'react';
import { useBunkContext } from '../context/BunkContext';

function TestComponent() {
    const bunkData = useBunkContext();

    console.log('bunkData:', bunkData); // Debugging line

    const date = bunkData.date;
    const campers = bunkData.campers;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);  // Changed to false since data is passed as prop
    const [data, setData] = useState(bunkData);

    const filterNotOnCamp = (campers) => {
        return campers.filter((camper) => camper.bunk_log?.not_on_camp == true);
    }
    
    useEffect(() => {
        if (bunkData && bunkData.campers) {
            setData(filterNotOnCamp(bunkData.campers));
        }
    }, [bunkData]);

    return (
        <div>
            <h1>{ bunkData.bunk_name }</h1>
        </div>
    );
}

export default TestComponent;