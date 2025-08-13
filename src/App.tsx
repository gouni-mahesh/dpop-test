// src/App.tsx
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



import { queryClient } from './api/hooks/d-pop';
import { QueryClientProvider } from '@tanstack/react-query';
import Home from './components/Home/Home';
function App() {
  // Set timeout to 10 minutes (10 * 60 * 1000 ms). Adjust as needed.
  const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* <AuthProvider> */}
          {/* <AvootaContextProvider> */}
            {/* <IdleSessionHandler
              timeout={SESSION_TIMEOUT_MS}
              onExpire={() => {
                // Optional: additional cleanup or redirect logic
              }}
            > */}
              <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/search-result" element={<SearchResult />} /> */}
                {/* <Route
                  path="/search-detail/:hotelId/:avootaSearchId?"
                  element={<SearchDetails />}
                />
                <Route
                  path="/review-booking/:hotelId/:opsId"
                  element={<ReviewBooking />}
                /> */}
                {/* <Route path="/no-Data" element={<NoData />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/check-status" element={<CheckStatus />} />
                <Route path="/booking-status" element={<BookingStatus />} />
                <Route
                  path="/user/*"
                  element={
                    <ProtectedRoute>
                      <User />
                    </ProtectedRoute>
                  }
                /> */}
                {/* <Route path="/vibes/:vibeId" element={<VibesScreen />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route
                  path="/terms-conditions"
                  element={<TermsAndConditions />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route
                  path="*"
                  element={
                    <NoData
                      message="Page not found!"
                      header={true}
                      footer={true}
                    />
                  }
                /> */}
              </Routes>
            {/* </IdleSessionHandler> */}
          {/* </AvootaContextProvider> */}
        {/* </AuthProvider> */}
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
