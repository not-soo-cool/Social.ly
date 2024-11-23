import React, { useEffect, useState } from 'react';
import {
  Home, User, Bell, MessageCircle, Settings, Menu, Search, SquarePlusIcon,
} from 'lucide-react';
import '../../styles/Sidebar.css';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);


  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <aside className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
            <nav className="sidebar-nav">
            <Logo size="2rem" />
            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li
                        key={index} 
                        className={`menu-item ${
                            // selectedItem.label === item.label ? 'selected' : ''
                            location.pathname === item.route ? 'selected' : ''
                        }`}
                        // onClick={() => handleItemClick(item)}
                    >
                        <div className="menu-link">
                            <item.icon className="menu-icon" />
                            {isOpen && <span className="menu-text">{item.label}</span>}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="logout-section" onClick={handleLogout}>
                <Link href="#" className="menu-link">
                <User className="menu-icon" />
                    <span className="menu-text">Log Out</span>
                </Link>
            </div>
            </nav>
        </aside>
        {/* {openCreateModal && (
            <div className="overlay" onClick={handleCloseModal}>
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CreateModal onClose={handleCloseModal} />
                </div>
            </div>
            
            )
        } */}
    </div>
    );
};

export default Sidebar;
