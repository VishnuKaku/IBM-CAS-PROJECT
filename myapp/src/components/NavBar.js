import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./NavBar.css"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser,setToken,setLoggedIn } from '../redux/UserSlice';

function NavBar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Define state to manage the active link
    const [activeLink, setActiveLink] = useState('Home');
    const isLoggedIn = useSelector(store=>store.user.isLoggedIn)
    const userRole = useSelector(store=>store.user.currentUser.role)
    const isEmployee = userRole === 'Employee'
    const isCitizen = userRole === 'Citizen'


    // Function to handle click event on navigation links
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const logout = ()=>{
        dispatch(setCurrentUser({}));
        dispatch(setToken(''));
        dispatch(setLoggedIn(false))
        navigate(['/logout'])
        
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="#">Your Logo</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                           <Link className='link-no-underline' to={'/home'}> <button
                                className="nav-link"
                                onClick={() => handleLinkClick('Home')}
                            >
                                Home
                            </button></Link> 
                        </li>
                        {isLoggedIn && <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle"
                                id="suggestionsDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Suggestions
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="suggestionsDropdown">
                                {isCitizen &&<li>
                                   <Link className='link-no-underline' to={'/submit-suggestion'}> <button className="dropdown-item">Submit Suggestion</button></Link>
                                </li>}
                                {isCitizen && <li>
                                    <Link className='link-no-underline' to={'/my-suggestions'}><button
                                        className="dropdown-item"
                                        onClick={() => handleLinkClick('MySuggestions')}
                                    >
                                        My Suggestions
                                    </button></Link>
                                </li>}
                                 <li>
                                <Link className='link-no-underline' to={'/show-suggestion'}> <button className="dropdown-item">All Suggestions</button></Link>
                                </li>
                            </ul>
                        </li>}
                        {isLoggedIn && <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle"
                                id="complaintsDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Complaints
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="complaintsDropdown">
                                {isCitizen && <li>
                                   <Link className='link-no-underline' to={'/raise-complaint'}> <button className="dropdown-item">Raise Complaint</button></Link>
                                </li>}
                                {isCitizen && <li>
                                   <Link className='link-no-underline' to={'/show-complaint'}> <button className="dropdown-item">My Complaints</button></Link>
                                </li>}
                                {isEmployee && <li>
                                <Link className='link-no-underline' to={'/show-complaint'}><button className="dropdown-item" >All Complaints</button></Link>
                                </li>}
                            </ul>
                        </li>}
                        {isLoggedIn && <li className="nav-item">
                            <Link className='link-no-underline' to={'/profile'}><button type='button' className="nav-link">Profile</button></Link>
                        </li>}
                    </ul>
                    <div className="d-flex">
                        {!isLoggedIn && <Link to={'/login'}><button type="button" className="btn btn-outline-primary me-2">Login</button></Link>}
                        {isLoggedIn && <button type="button" className="btn btn-outline-primary me-2" onClick={logout}>Logout</button>}
                        {!isLoggedIn && <Link to={'/signup'}><button type="button" className="btn btn-primary me-0">Sign-up</button></Link>}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;