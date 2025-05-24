import React from 'react';
import { Routes, Route } from 'react-router-dom';

const TestComponent = () => <div>Test Component</div>;

const TestRoutes = () => (
  <Routes>
    <Route path="/test" element={<TestComponent />} />
  </Routes>
);

export default TestRoutes;
