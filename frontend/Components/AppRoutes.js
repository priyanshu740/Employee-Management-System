import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EmployeeDirectory from './EmployeeDirectory.jsx';
import EmployeeCreateWrapper from './EmployeeCreateWrapper.jsx';
import EmployeeDetails from './EmployeeDetails.jsx';
import EmployeeRetirement from './EmployeeRetirement.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EmployeeDirectory />} />
      <Route path="/create" element={<EmployeeCreateWrapper />} />
      <Route path="/upcomingRetirement" element={<EmployeeRetirement />} />
      <Route path="/details/:id" element={<EmployeeDetails />} />   
    </Routes>
  );
};

export default AppRoutes;
