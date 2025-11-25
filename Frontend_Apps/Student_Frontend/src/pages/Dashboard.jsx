import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import { Box, Toolbar } from '@mui/material';
import ViewAttendance from '../components/Dashboard/StudentHandler/ViewAttendance';
import OverAllAttendance from '../components/Dashboard/StudentHandler/OverAllAttendance';






const Dashboard = () => {
    return (
        
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <Sidebar />
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f9f9f9',
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Routes>
           
                    <Route path="view-attendance" element={<ViewAttendance />} />
                    <Route path="view-attendance-percentage" element={<OverAllAttendance />} />

                   

                    


                </Routes>
            </Box>
        </Box>
    );
};

export default Dashboard;
