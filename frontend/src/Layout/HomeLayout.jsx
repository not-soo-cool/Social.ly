import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import RightSidebar from '../Components/RightSideBar/RightSideBar';
import { useLocation } from 'react-router-dom';

const HomeLayout = (props) => {

    const { children } = props;



  return (
    <div style={{ display: 'flex', height: '100vh', gap: 0, background: '#000', color: 'white' }}>

        <div style={{ width: '20%' }}>
            <Sidebar 
            onClose={handleModal}
            open={openCreate} 
            />
        </div>
        
        <div style={{ display: 'flex', height: '100%', overflowX: 'hidden', maxWidth: '100%', marginLeft: 0 }}>
                {children}
        </div>

        {/* {isHalf && */}
        <div style={{ width: '20%' }}>
            <RightSidebar />
        </div>
        {/* } */}
    </div>
  );
};

export default HomeLayout;
