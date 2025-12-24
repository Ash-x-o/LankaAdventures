import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes,Route } from 'react-router-dom';

import Home from './home';
import TourSearch from './tour_search';
import PackageDetails from './package_details';
import Login from './login';
import Destinations from './destinations';
import CustomTour from './custom_tour';
import CustomerDashboard from './cus_dashboard';
import AdminDashboard from './admin_dashboard';
import DestinationDetails from './destinantion_details';
import LocationPicker from './sampleMap';
import PaymentPortal from './payment_portal';
import AboutUs from './about_us';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour_search" element={<TourSearch />} />
        <Route path="/package_details" element={<PackageDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/custom_tour" element={<CustomTour />} />
        <Route path="/customer_dashboard" element={<CustomerDashboard />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/destination_details" element={<DestinationDetails />} />
        <Route path="/location_picker" element={<LocationPicker />} />
        <Route path="/payment_portal" element={<PaymentPortal />} />
        <Route path="/about_us" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
);

        

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
