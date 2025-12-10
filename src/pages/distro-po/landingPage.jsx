
import React from 'react';
// 1. Make sure to import the Link component
import { Link } from 'react-router-dom';

// This is your existing landing page component
export default function DistroPoLandingPage() {
  return (
    <div>
      <h1>Welcome to the Distro PO Landing Page</h1>
      <p>This is the first landing page.</p>

      {/* 2. Add the Link to navigate to the other page */}
      <Link to="/distro-po/landing2">
        Go to Landing Page 2
      </Link>

      {/* ... rest of your page content */}
    </div>
  );
}
