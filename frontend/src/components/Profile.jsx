import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';



const Profile = () => {
  return (
    <>
    <h1>Profile Page</h1>
    <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/NationalDex">NationalDex</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Profile