import React, { useState,useRef, useEffect, use } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {Header} from './home';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useNavigate } from "react-router-dom";
import {CusTourDetails} from './cus_dashboard';
 
import marker from "./images/marker.png";
import db_bg_1 from './images/db_bg_2.png';
import db_bg from './images/db_bg.png';
import noImg from './images/noImg.png';

function valuetext(value) {
  return `${value}°C`;
}

function AdminDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const defaultSection = searchParams.get("section") || "profile";
    const [dashContent, setDashContent] = useState(defaultSection);

    const handleDashContSwitch = (content) => {
    setDashContent(content);
    setSearchParams({ section: content }); // update URL
  };

  useEffect(() => {
              async function checkSession() {
                  try{
                      const response =  await fetch('/api/users/check-session', {
                          method: 'GET',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          credentials: 'include', // Include cookies for authentication
                      });
                      const data = await response.json();
                      console.log("Session data:", data.user);
                      if(response.ok){
                          if(data.user){
                                setUser(data.user);
                          }else{
                                navigate('/login');
                            }
                          
                      }
                  }
                  catch (error) {
                      console.error('Error fetching profile:', error);
                  }
              }
              checkSession();
          }, []);
          

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && section !== dashContent) {
      setDashContent(section);
    }
  }, [searchParams]);

    const handleLogOut = async () => {
        try {
            const response = await fetch('/api/users/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                window.location.href = '/login';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    
    const [showAside, setShowAside] = useState(false);  
    
    

    return (
        <div className="font-display bg-white dark:bg-background-dark text-text-light dark:text-text-dark">
            <div className="flex h-screen w-full">
                {/* SideNavBar */}
                <aside className={` absolute top-0 left-0 h-full bg-white flex flex-col shadow z-20 bg-card-light dark:bg-card-dark transform transition-transform duration-300 ${showAside ? 'translate-x-0' : '-translate-x-[calc(100%-0.5rem)]'}`}>
                    <div className="relative w-full h-full">
                    <div className="absolute top-20 -right-12 overflow-hidden rounded-r-md p-0 m-0  w-12 h-12 flex items-center justify-center cursor-pointer" onClick={() => setShowAside(!showAside)} >
                        <div className="bg bg-white dark:bg-background-dark  shadow w-10 h-10 rounded-r-md mr-2 flex items-center justify-center">
                            <span className={`material-symbols-outlined ${showAside ? '' : 'rotate-180'}`}>chevron_left</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 p-4">
                        <div className="flex items-center gap-3">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                            data-alt="Lanka Adventures Logo"
                            style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXH3tHmtL_aMloPqDB3XUqswHirYdf6ALd33U8xKWZ2_KB8X9zxZg0c22q-GLHTn_PV6w_mWkVfpvJe2_BMXmaRVuvOc9ejRS-NrhRej0ABCkeeCR6g-pDn7MftFJ552roARltWb8Z5P_qAK9YIMVOpZjM9_NGLEWYE7kh94KYWRI4mWBhrj8jlaAqT7-mPVuxlFSHnGWv0gYUhS3TxV-q3_eHwSBL-_WAc5cr8R7OBDlhHrOcMqnaVJRaKQtmYlFWNaKC1PiVFP4")'
                            }}
                        />
                        <div className="flex flex-col">
                            <h1 className="text-base font-medium leading-normal text-text-light dark:text-text-dark">
                            Lanka Adventures
                            </h1>
                            <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                            Admin Panel
                            </p>
                        </div>
                        </div>
                    </div>
                    
                    <nav className="flex flex-col gap-6 px-4 py-4 grow">
                        
                        <div className="flex flex-col gap-2">
                        <a
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium  rounded ${dashContent === "profile" ? "text-secondary bg-deep-forest-green dark:bg-primary/30 hover:bg-deep-forest-green/90" : "hover:bg-primary/10 dark:hover:bg-primary/20"}`}
                            href=""
                            onClick={() => handleDashContSwitch('profile')}
                        >
                            <span className="material-symbols-outlined text-xl">person</span>
                            Admin Profile
                        </a>
                        <a
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded ${dashContent === "tourPackages" ? "text-secondary bg-deep-forest-green dark:bg-primary/30 hover:bg-deep-forest-green/90" : "hover:bg-primary/10 dark:hover:bg-primary/20 "}`}
                            href=""
                            onClick={() => handleDashContSwitch('tourPackages')}
                        >
                            <span className="material-symbols-outlined text-xl !fill-1">
                            tour
                            </span>
                            Tours Packages
                        </a>
                        <a
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded ${dashContent === "tourBookings" ? "text-secondary bg-deep-forest-green dark:bg-primary/30 hover:bg-deep-forest-green/90" : "hover:bg-primary/10 dark:hover:bg-primary/20"}`}
                            href=""
                            onClick={() => handleDashContSwitch('tourBookings')}
                        >
                            <span className="material-symbols-outlined text-xl">
                            add_circle
                            </span>
                            Tour Bookings
                        </a>
                        <a
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded ${dashContent === "destinations" ? "text-secondary bg-deep-forest-green dark:bg-primary/30 hover:bg-deep-forest-green/90" : "hover:bg-primary/10 dark:hover:bg-primary/20"}`}
                            href=""
                            onClick={() => handleDashContSwitch('destinations')}
                        >
                            <span className="material-symbols-outlined text-xl">location_on</span>
                            Destinations
                        </a>
                        </div>
                        
                    </nav>
                    <div className="p-4 border-t border-border-light dark:border-border-dark">
                        <a
                        onClick={handleLogOut}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded hover:bg-red-100 dark:hover:bg-red-900/50"
                        
                        >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Logout
                        </a>
                    </div>
                </div>
                </aside>
                {/* Main Content */}
                <div className="flex flex-col flex-1 overflow-y-auto">
                {/* TopNavBar */}
                <Header user={user} />
                {/* <header className="relative flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-10 py-3 sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
                    <div className="absolute top-0 left-0 w-full h-full"></div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                    Welcome, Admin
                    </h2>
                    <div className="flex flex-1 justify-end items-center gap-4">
                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined text-2xl">
                        notifications
                        </span>
                    </button>
                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined text-2xl">settings</span>
                    </button>
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        data-alt="Admin user avatar"
                        style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAqTJZeMKuXBOyPLIeheCB-RjHC5D6NrJ0QNyuTEUaCmzqDTDdbclRBb24h3iXPJGEKQvuTu_O6BZ74f8rRJdWGJ_2zDJpPj55vmQHskiVRlyuwALexEGtaQITSpZi5_ZS9oorJHLu9hcmPEDdjTktv_oV0qM_uSGmOIn6F_vgdn1MlhRYvD3C8yH2O5bx_vDXpMYEwW3v5KnMl5SKmHbzR-6mAXAWQ7SXHFSm1op1C3UoR1zsYsaM0x4urLw5iWDmYvZ6Ye57ch84")'
                        }}
                    />
                    </div>
                </header> */}
                {/* Dashboard Content */}
                {dashContent === "profile" &&
                    <Profile />
                }
                {dashContent === "tourPackages" &&           
                    <ManageTourPackages />
                }
                {dashContent === "tourBookings" &&
                    < TourBookings />
                }
                {dashContent === "destinations" &&
                    <Destinations />
                }
                
                </div>
            </div>
        </div>

    );
}

export default AdminDashboard;

function Profile(){
    return (
        <div>profile</div>
    );
}
function ManageTourPackages() {
    const navigate = useNavigate();

    const [showAddTourModal, setShowAddTourModal] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const handleAddTourClick = () => {
        setShowAddTourModal(true);
        setShowOverlay(true);
    };

    const handleHideAddTourModal = () => {
        setShowAddTourModal(false);
        setShowOverlay(false);
    };

    const [allTourPackages, setAllTourPackages] = useState([]);

    const fetchTourPackages = async () => {
        try{
                const response = await fetch('/api/tours/get-all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllTourPackages(data.tours);
                } else {
                    console.error('Failed to fetch tour packages');
                }
            }catch(error){
                console.error('Error fetching tour packages:', error);
            }
    };

    useEffect(() => {
        // Fetch all tour packages from the backend API
        fetchTourPackages();
    }, [showOverlay]);

    const calRatings = (reviews) => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };
    const [currMenu, setCurrMenu] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setCurrMenu(null);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const updateStatus = async (id, status) => {
        try{
            const response = await fetch(`/api/tours/update-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status }),
            });
            if(response.ok){
                console.log('Tour status updated successfully');
                fetchTourPackages();
            }else{
                console.error('Failed to update tour status');
            }
        }catch(error){
            console.error('Error updating tour status:', error);
        }
    };


    const [searchReq,setSearchReq] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    
    const [ratingFilter, setRatingFilter] = useState([0, 5]);

    const handleChange = (event, newValue) => {
        setRatingFilter(newValue);
    };
    const [filteredTours, setFilteredTours] = useState(allTourPackages);
    const filteredToursRef = useRef(false);

    useEffect(() => {
        if (allTourPackages && allTourPackages.length > 0) {
            setFilteredTours(allTourPackages);
        }
    }, [allTourPackages]);
    
    useEffect(() => {
        search();
    }, [statusFilter]);
    const search = () =>{
        const filteredTours = allTourPackages.filter((tour) => {

            const matchesNames = tour.name.toLowerCase().includes(searchReq.toLowerCase());
            const matchesStatus = statusFilter === "All" ? true : tour.status === statusFilter;
            const matchesRating = ratingFilter
            ? calRatings(tour.reviews) >= ratingFilter[0] &&
                calRatings(tour.reviews) <= ratingFilter[1]
            : true;
            return matchesStatus && matchesRating && matchesNames;

        });

        setFilteredTours(filteredTours);
        setCheckedEntries([]);

    }

    const [checkedEntries, setCheckedEntries] = useState([]);

    const handleCheckboxChange = (e, tourId) => {
        if(e.target.checked){
            setCheckedEntries(prev => [...prev, tourId]);
        } else {
            setCheckedEntries(prev => prev.filter(id => id !== tourId));
        }
    }

    const handleAllCheckboxChange = () => {
        if(checkedEntries.length === filteredTours.length){
            setCheckedEntries([]);
        } else {
            setCheckedEntries(filteredTours.map((tour) => tour._id));
        }
    }

    
    const [showRatingFilter, setShowRatingFilter] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageStartIndex, setPageStartIndex] = useState(0);
    const [pageEndIndex, setPageEndIndex] = useState(10);

    useEffect(() => {
        
        if (filteredTours.length > page * 10) {
        setPageStartIndex((page - 1) * 10);
        setPageEndIndex(page * 10);
        } else if(filteredTours.length === 0){
            setPageStartIndex(0);
            setPageEndIndex(0);
        }else {
        setPageStartIndex((page - 1) * 10);
        setPageEndIndex(filteredTours.length);
        }
    }, [allTourPackages, filteredTours, page]);

    const deleteSelectedTours = async () => {
        try{
            const response = await fetch('/api/tours/delete-multiple', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tourIds: checkedEntries }),
            });
            if(response.ok){
                console.log('Selected tours deleted successfully');
                fetchTourPackages();
                setCheckedEntries([]);
            }else{
                console.error('Failed to delete selected tours');
            }
        }catch(error){
            console.error('Error deleting selected tours:', error);
        }
    };
    const deletetourPkg = async (id) => {
        try{
            const response = await fetch(`/api/tours/delete-by/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                console.log('Tour deleted successfully');
                fetchTourPackages();
            } else {
                console.error('Failed to delete tour');
            }
        } catch (error) {
            console.error('Error deleting tour:', error);
        }
    };

    const deleteAllTours = async () => {
        try{
            const response = await fetch('/api/tours/delete-all', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.ok){
                console.log('All tours deleted successfully');
                fetchTourPackages();
            }else{
                console.error('Failed to delete all tours');
            }
        }catch(error){
            console.error('Error deleting all tours:', error);
        }
    };

    const [tableMenuState, setTableMenuState] = useState(false);
    const toggleTableMenu = () => {
        setTableMenuState(!tableMenuState);
    };
    const tableMenuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (tableMenuRef.current && !tableMenuRef.current.contains(event.target)) {
            setTableMenuState(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [currEditingPkg, setCurrEditingPkg] = useState(null);
    const handleUpdatePkg = (pkg) => {
        setCurrEditingPkg(pkg);
        setShowAddTourModal(true);
        setShowOverlay(true);
    };
    
    return (
        <main className="flex-1 p-8">
                    <div className="flex flex-col gap-8">
                        <div className={`relative bg-[url(${db_bg})] bg-cover bg-center rounded p-6 overflow-hidden shadow-lg`}>
                            {/* PageHeading */}
                            <div>
                                <p className="text-4xl text-text-dark leading-tight tracking-[-0.033em]">
                                Dashboard
                                </p>
                            </div>
                        {/* Stats */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-5 text-text-dark dark:text-text-light ">
                                <div className="flex flex-col gap-2 rounded p-6 border border-2 border-[rgba(225,225,255,0.2)] bg-[rgba(225,225,225,0.1)] ">
                                <p className="text-base font-medium">Total Tours</p>
                                <p className="tracking-light text-3xl font-bold">125</p>
                                <p className="text-green-600 text-sm font-medium">
                                    +5.2% this month
                                </p>
                                </div>
                                <div className="flex flex-col gap-2 rounded p-6 border border-2 border-[rgba(225,225,255,0.2)] bg-[rgba(225,225,225,0.1)]">
                                <p className="text-base font-medium">Active Bookings</p>
                                <p className="tracking-light text-3xl font-bold">42</p>
                                <p className="text-green-600 text-sm font-medium">
                                    +12.0% this month
                                </p>
                                </div>
                                <div className="flex flex-col gap-2 rounded p-6 border border-2 border-[rgba(225,225,255,0.2)] bg-[rgba(225,225,225,0.1)]">
                                <p className="text-base font-medium">Total Revenue</p>
                                <p className="tracking-light text-3xl font-bold">$54,800</p>
                                <p className="text-green-600 text-sm font-medium">
                                    +8.5% this month
                                </p>
                                </div>
                            </div>
                        </div>
                        {/* Tour Details Table Section */}
                        <div className="flex flex-col gap-4 rounded border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
                            {/* SectionHeader */}
                            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">
                            Manage Tour Packages
                            </h2>
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="relative flex-1 min-w-64">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                search
                                </span>
                                <input
                                className="w-full pl-10 pr-4 py-2 border rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary"
                                placeholder="Search tours..."
                                type="text"
                                value={searchReq}
                                onChange={(e) => setSearchReq(e.target.value.trim())}
                                onKeyDown={(e) => {
                                    if(e.key ==="Enter"){
                                        e.preventDefault()
                                        search();
                                    }
                                }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <select onChange={(e) => setStatusFilter(e.target.value)} className="border rounded border-border-light outline-0 ring-0 dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary">
                                <option value={"All"} >Filter by Status</option>
                                <option value={"Published"} >Published</option>
                                <option value={"Archived"} >Archived</option>
                                </select>
                                <div
                                    onClick={() => setShowRatingFilter(!showRatingFilter)}
                                    className="relative cursor-pointer w-[10vw] border rounded p-2 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary">
                                    Filter by Rating
                                    {showRatingFilter &&
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute p-4 mt-1 w-full top-full left-0 bg-white shadow rounded-b-md">
                                        <div className="flex justify-between mb-4">
                                            <label className="flex flex-col justify-center">
                                            Min                                            
                                            <input type="number" min={0} max={5} step={0.1} onChange={(e) => setRatingFilter([e.target.value, ratingFilter[1]])} className="w-16 border border-border-light dark:border-border-dark rounded px-2 py-1 outline-0 ring-0 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary" />
                                            </label>
                                            <label className="flex flex-col justify-center">
                                            Max
                                            <input type="number" min={0} max={5} step={0.1} onChange={(e) => setRatingFilter([ratingFilter[0], e.target.value])} className="w-16 border border-border-light dark:border-border-dark rounded px-2 py-1 outline-0 ring-0 bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary" />
                                            </label>
                                        </div>
                                        <Slider
                                            getAriaLabel={() => 'Temperature range'}
                                            value={ratingFilter}
                                            onChange={handleChange}
                                            valueLabelDisplay="auto"
                                            getAriaValueText={valuetext}
                                            min={0}
                                            max={5}
                                            step={0.1}
                                            color="accent"
                                            marks={
                                                [{ value: 0, label: '0' },
                                                { value: 1, label: '1' },
                                                { value: 2, label: '2' },
                                                { value: 3, label: '3' },
                                                { value: 4, label: '4' },
                                                { value: 5, label: '5' }]
                                            }
                                        />
                                        <div className="flex justify-end mt-4 ">
                                            <button className="bg-accent text-secondary text-sm py-2 px-4 cursor-pointer rounded hover:bg-accent/90 hover:text-white transition-colors duration-200" onClick={() => {search(); setShowRatingFilter(false)}}>Apply</button>
                                        </div>
                                    </div>
                                    }
                                </div>
                                <button 
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-deep-forest-green rounded hover:bg-deep-forest-green/90"
                                    onClick={() => {handleAddTourClick(); setCurrEditingPkg(null); }}
                                    >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Add New Tour
                                </button>
                                <div className="relative">
                                    <span className="material-symbols-outlined bg-accent/5 hover:bg-accent/10 cursor-pointer p-2 rounded" onClick={toggleTableMenu}>more_horiz</span>
                                    <div className="absolute overflow-hidden right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10" ref={tableMenuRef} style={{ display: tableMenuState ? 'block' : 'none' }}>
                                        <ul className="flex flex-col ">
                                            <li className="flex items-center justify-between px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer" onClick={() => deleteAllTours()}>Delete All<span className="material-symbols-outlined">warning</span></li>
                                            <li className="flex items-center justify-between px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer" onClick={() => deleteSelectedTours()}>Delete Selected<span className="material-symbols-outlined">delete</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            </div>
                            {/* Table */}
                            <div className="">
                            <table className="w-full text-sm text-left">
                                <thead className="border-b border-border-light dark:border-border-dark text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3 font-medium" scope="col">
                                        <input
                                            checked={checkedEntries.length === filteredTours.length}
                                            onChange={() => handleAllCheckboxChange()}
                                            type="checkbox" value="" className="w-4 h-4 rounded-md text-primary bg-neutral-secondary-medium border-default-medium focus:ring-primary dark:focus:ring-primary ring-offset-neutral-primary focus:ring-2"/>
                                    </th>
                                    <th className="px-4 py-3 font-medium" scope="col">
                                    Tour Name
                                    </th>
                                    <th className="px-4 py-3 font-medium" scope="col">
                                    Tour Duration
                                    </th>
                                    <th className="px-4 py-3 font-medium" scope="col">
                                    Group Limit
                                    </th>
                                    <th className="px-4 py-3 font-medium" scope="col">
                                    Status
                                    </th>
                                    <th className="px-4 py-3 font-medium" scope="col">
                                    Price per person <span className="text-xs text-gray-500">(/Rs)</span>
                                    </th>
                                    <th className="px-4 py-3 font-medium" scope="col">
                                    Rating
                                    </th>
                                    <th
                                    className="px-4 py-3 font-medium text-right"
                                    scope="col"
                                    >                                    
                                    Actions
                                    </th>
                                    
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTours.slice(pageStartIndex, pageEndIndex).map((tour, index) => (
                                <tr onClick={() => navigate(`/package_details?id=${tour._id}`)} className="cursor-pointer border-b border-border-light rounded dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-4 py-4">
                                         <input 
                                            checked={checkedEntries.includes(tour._id)}
                                            onChange={(e) => handleCheckboxChange(e, tour._id)}
                                            type="checkbox" value="" className="w-4 h-4 rounded-md text-primary bg-neutral-secondary-medium border-default-medium focus:ring-primary dark:focus:ring-primary ring-offset-neutral-primary focus:ring-2"/>
                                    </td>
                                    <td className="px-4 py-4 font-medium">
                                    {tour.name}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                                    {tour.dailyPlan.length} days
                                    </td>
                                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                                    {tour.maxGroupSize} - {tour.minGroupSize} persons
                                    </td>
                                    <td className="px-4 py-4">
                                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                                        {tour.status}
                                    </span>
                                    </td>
                                    <td className="px-4 py-4">{tour.price}</td>
                                    <td className="px-4 py-4">⭐{calRatings(tour.reviews)}</td>

                                    <td className="relative px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <span 
                                                onClick={(e) => {setCurrMenu(tour._id); e.stopPropagation();}}
                                                className="material-symbols-outlined p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                                                more_vert
                                            </span>
                                        </div>
                                        {currMenu === tour._id &&
                                            <div onClick={(e) => e.stopPropagation()} ref={menuRef} className= "absolute z-10 bg-white shadow-lg rounded-md absolute right-10 -bottom-100 ">
                                                <ul className="flex flex-col ">
                                                
                                                    <li className={`relative rounded-t-md flex items-center px-5 py-2 justify-between gap-3 w-full cursor-pointer hover:bg-gray-100 hover:text-primary transition-colors duration-200 ${tour.status !== "Archived" ? "group" : "bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400  cursor-not-allowed" }`}>                                                        
                                                        <span className="material-symbols-outlined text-2xl">
                                                            chevron_left
                                                        </span>
                                                        Status
                                                        
                                                        <div className="absolute top-0 right-full mr-1 bg-white shadow-lg rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 ">
                                                            <ul className="flex flex-col ">
                                                                <li 
                                                                onClick={() => { updateStatus(tour._id, "Published"); setCurrMenu(null); }}
                                                                    className={`flex items-center rounded-t-md px-5 py-2 justify-between gap-3 w-full cursor-pointer ${tour.status === "Published" ? "text-text-dark bg-deep-forest-green hover:bg-deep-forest-green/90 hover:text-text-dark" : "hover:bg-gray-100 hover:text-primary"} transition-colors duration-300 `}>
                                                                    Published
                                                                    <span className="material-symbols-outlined text-lg">
                                                                        check
                                                                    </span>
                                                                </li>
                                                                
                                                                <li
                                                                    onClick={() => { updateStatus(tour._id, "Archived"); setCurrMenu(null); }}
                                                                    className={`flex items-center rounded-b-md px-5 py-2 justify-between gap-3 w-full cursor-pointer ${tour.status === "Archived" ? "text-text-dark bg-deep-forest-green hover:bg-deep-forest-green/90 hover:text-text-dark" : "hover:bg-gray-100 hover:text-primary"} transition-colors duration-300 `}>
                                                                    Archived
                                                                    <span className="material-symbols-outlined text-lg">
                                                                        archive
                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                    
                                                    
                                                    <li 
                                                        onClick={() => {deletetourPkg(tour._id); setCurrMenu(null);}}
                                                        className="flex items-center rounded-b-md px-5 py-2 justify-between gap-3 w-full cursor-pointer hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 ">
                                                        <span className="material-symbols-outlined text-lg">
                                                            delete
                                                        </span>
                                                        Delete                                                        
                                                    </li>
                                                    <li 
                                                        onClick={() => {handleUpdatePkg(tour); setCurrMenu(null);}}
                                                        className="flex items-center rounded-b-md px-5 py-2 justify-between gap-3 w-full cursor-pointer hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 ">
                                                        <span className="material-symbols-outlined text-lg">
                                                            update
                                                        </span>
                                                        Update                                                        
                                                    </li>
                                                </ul>

                                            </div>
                                        }
                                    </td>
                                    
                                </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                            {/* Pagination */}
                            <nav
                            aria-label="Table navigation"
                            className="flex items-center justify-between pt-4"
                            >
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Showing{" "}
                                <span className="font-semibold text-text-light dark:text-text-dark">
                                {pageStartIndex + 1} - {pageEndIndex}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-text-light dark:text-text-dark">
                                {filteredTours.length} Packages
                                </span>
                            </span>
                            <ul className="inline-flex items-center -space-x-px">
                                <li onClick={() => {if(page > 1) setPage(page - 1)}}>
                                <a
                                    className="px-3 cursor-pointer py-2 ml-0 leading-tight text-gray-500 bg-card-light border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    
                                >
                                    Previous
                                </a>
                                </li>
                                {Array.from({ length: Math.ceil(filteredTours.length / 10) }, (_, index) => (
                                <li 
                                    onClick={() => setPage(index + 1)}
                                    key={index}>
                                <a
                                    className={`cursor-pointer px-3 py-2 leading-tight text-gray-500 bg-card-light border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${page === index + 1 ? "bg-accent text-secondary hover:bg-accent/90 hover:text-white" : ""}`}
                                    
                                >
                                    {index + 1}
                                </a>
                                </li>
                                ))}
                                
                                <li onClick={() => {if(page < Math.ceil(filteredTours.length / 10)) setPage(page + 1)}}>
                                <a
                                    className="px-3 cursor-pointer py-2 leading-tight text-gray-500 bg-card-light border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    
                                >
                                    Next
                                </a>
                                </li>
                            </ul>
                            </nav>
                        </div>
                    
                    </div>
                    {showOverlay && (
                    <div className="fixed top-0 left-0 backdrop-blur-[5px] bg-[rgba(0,0,0,0.5)] w-screen h-screen z-30" onClick={handleHideAddTourModal}></div>
                    )}
                    {showAddTourModal && (
                    <div className="fixed top-1/2 left-1/2 w-[80vw] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50" >
                        <AddNewTourForm onClose={handleHideAddTourModal} editingPkg={currEditingPkg} />
                    </div>
                    )}
                </main>
    );
}

function AddNewTourForm({ onClose, editingPkg }) {


    const [tourName, setTourName] = useState("");
    const [tourSummary, setTourSummary] = useState("");
    const [tourOverview, setTourOverview] = useState("");
    const [pricePerPerson, setPricePerPerson] = useState("");
    const [minPersons, setMinPersons] = useState("");
    const [maxPersons, setMaxPersons] = useState("");
    const [destinations, setDestinations] = useState([]); // separate id's
    const [dailyPlan, setDailyPlan] = useState([]);
    const [includes, setIncludes] = useState([]);
    const [excludes, setExcludes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState("Archived");
    const [coverIndex, setCoverIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [isFeatured, setIsFeatured] = useState(false);

    // errors

    const [tourNameError, setTourNameError] = useState(false);
    const [tourSummaryError, setTourSummaryError] = useState(false);
    const [tourOverviewError, setTourOverviewError] = useState(false);
    const [pricePerPersonError, setPricePerPersonError] = useState(false);
    const [minPersonsError, setMinPersonsError] = useState(false);
    const [maxPersonsError, setMaxPersonsError] = useState(false);
    const [destinationsError, setDestinationsError] = useState(false);
    const [dailyPlanError, setDailyPlanError] = useState(false);
    const [includesError, setIncludesError] = useState(false);
    const [excludesError, setExcludesError] = useState(false);
    const [categoriesError, setCategoriesError] = useState(false);
    const [imagesError, setImagesError] = useState(false);
    
    const [typingInclude, setTypingInclude] = useState("");
    const [typingExclude, setTypingExclude] = useState("");

    const [publishable, setPublishable] = useState(true);
    const [draftable, setDraftable] = useState(true);
    

    const [submitClicked, setSubmitClicked] = useState(false);
    const [draftClicked, setDraftClicked] = useState(false);
    useEffect(() => {
        if (submitClicked) {
            
            if(tourName) setTourNameError(false);else setTourNameError(true);
            if(tourSummary) setTourSummaryError(false);else setTourSummaryError(true);
            if(tourOverview) setTourOverviewError(false);else setTourOverviewError(true);
            if(pricePerPerson) setPricePerPersonError(false);else setPricePerPersonError(true);
            if(minPersons) setMinPersonsError(false);else setMinPersonsError(true);
            if(maxPersons) setMaxPersonsError(false);else setMaxPersonsError(true);
            if(destinations.length > 0) setDestinationsError(false); else setDestinationsError(true);
            if(dailyPlan.length > 0) setDailyPlanError(false); else setDailyPlanError(true);
            if(includes.length > 0) setIncludesError(false); else setIncludesError(true);
            if(excludes.length > 0) setExcludesError(false); else setExcludesError(true);
            if(categories.length > 0) setCategoriesError(false); else setCategoriesError(true);
            if(images.length > 0) setImagesError(false); else setImagesError(true);
        }
        if(draftClicked){
            if(tourName) setTourNameError(false); else setTourNameError(true);
        }
    }, [submitClicked, draftClicked, tourName, tourSummary, tourOverview, pricePerPerson, minPersons, maxPersons, destinations, dailyPlan, includes, excludes, categories, images]);

    const [allDestinations, setAllDestinations] = useState([]);
    const [typingDestination, setTypingDestination] = useState("");
    const [suggestedDestinations, setSuggestedDestinations] = useState([]);

    const fetchDestinations = async () => {
        // Fetch destinations from an API or database
        const response = await fetch('/api/destinations/all', { method: 'GET' })
        if (response.ok) {
            const data = await response.json()
            setAllDestinations(data.destinations)            
        }
        
        
    }
    useEffect(() => {
        fetchDestinations();
    }, []);


    useEffect(() => {
      if (editingPkg) {
        // Populate form fields with existing data
        setTourName(editingPkg.name || "");
        setTourSummary(editingPkg.summary || "");
        setTourOverview(editingPkg.overview || "");
        setPricePerPerson(editingPkg.price || "");
        setMinPersons(editingPkg.minGroupSize || "");
        setMaxPersons(editingPkg.maxGroupSize || "");
        setCategories(editingPkg.categories || []);
        setDailyPlan(editingPkg.dailyPlan || []);
        setIncludes(editingPkg.includes || []);
        setExcludes(editingPkg.excludes || []);
        setStatus(editingPkg.status || "Archived");
        setCoverIndex(editingPkg.coverIndex || 0);
        setImages(editingPkg.images || []);
        setIsFeatured(editingPkg.isFeatured || false);
        if (allDestinations.length > 0) {
          setDestinations(
            allDestinations.filter((dest) =>
              editingPkg.destinations.includes(dest._id)
            ) || []
          );
        }
      }
    }, [editingPkg, allDestinations]);

    const filterDestinations = () => {
        if (typingDestination === "") {
            setSuggestedDestinations([]);
            return;
        }
        setSuggestedDestinations(allDestinations.filter(dest =>
            dest.name.toLowerCase().includes(typingDestination.toLowerCase()) &&
            !destinations.includes(dest.name)
        ));
    }

    useEffect(() => {
        filterDestinations();
    }, [typingDestination, allDestinations, destinations]);


    
    const newDestination = (des) => {
        if (des && !destinations.includes(des)) {
            setDestinations([...destinations, des]);
        }
    };

    const removeDestination = (des) => {
        setDestinations(destinations.filter(d => d !== des));
    };

    // get tour categories from backend
    const [categoryList, setCategoryList] = useState([]);
    const [typingCategory, setTypingCategory] = useState("");
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/tours/category-list', { method: 'GET' })
            if (response.ok) {
                const data = await response.json()
                setCategoryList(data.categories)
            }
        }
        fetchCategories();
    }, []);


    // create daily plan 
    const [typingActTitle, setTypingActTitle] = useState("");
    const [typingActDesc, setTypingActDesc] = useState("");

    const addDailyPlanItem = () => {
        if (typingActTitle && typingActDesc) {
            setDailyPlan([...dailyPlan, { actTitle: typingActTitle, actDescription: typingActDesc }]);
            setTypingActTitle("");
            setTypingActDesc("");
        }
    };

    const handleActTitleChange = (index, value) => {
        const updatedPlan = [...dailyPlan];
        updatedPlan[index].actTitle = value;
        setDailyPlan(updatedPlan);
    };

    const handleActDescChange = (index, value) => {
        const updatedPlan = [...dailyPlan];
        updatedPlan[index].actDescription = value;
        setDailyPlan(updatedPlan);
    };

    const handleRemoveDay = (index) => {
        const updatedPlan = dailyPlan.filter((_, i) => i !== index);
        setDailyPlan(updatedPlan);
    };

    const handleImageDelete = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        if (coverIndex === index) {
            setCoverIndex(0);
        }
    };
    
    const handleSaveDraft = async () => {
        setDraftClicked(true);
        setSubmitClicked(false);

        if (!tourName) {
            setTourNameError(true);
            setDraftable(false);
            return;
        }
        setTourNameError(false);

        try {
            let newImages = [];

            // ---- FIXED IMAGE UPLOAD SECTION ----
            const formData = new FormData();

            // Append only new image files (not existing URLs)
            images.forEach(img => {
                if (typeof img === "string") {
                    newImages.push(img);  // existing image URL
                } else {
                    formData.append("images", img); // <-- FIELD NAME MUST MATCH MULTER
                }
            });

            // Upload only if new images exist
            if (formData.has("images")) {
                const imgUploadResponse = await fetch(
                    "/api/tours/upload-images",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (imgUploadResponse.ok) {
                    const imgData = await imgUploadResponse.json();

                    // imgData.files = array of filenames
                    newImages = [...newImages, ...imgData.files];
                } else {
                    console.error("Failed to upload images");
                    return;
                }
            }

            // ---- SAVE DRAFT ----
            setDailyPlan([...dailyPlan, { actTitle: typingActTitle, actDescription: typingActDesc }]);
            const response = await fetch(
                "/api/tours/save-draft",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: tourName,
                        summary: tourSummary,
                        overview: tourOverview,
                        price: pricePerPerson,
                        maxGroupSize: maxPersons,
                        minGroupSize: minPersons,
                        destinations: destinations,
                        dailyPlan: typingActTitle || typingActDesc
                                ? [...dailyPlan, { actTitle: typingActTitle, actDescription: typingActDesc }]
                                : dailyPlan,                        
                        includes: includes,
                        excludes: excludes,
                        categories: categories,
                        status: "Archived",
                        coverIndex : coverIndex,
                        images: newImages,
                        isFeatured,
                    }),
                }
            );

            if (response.ok) {
                console.log("Draft saved successfully");
                onClose();
            } else {
                console.error("Failed to save draft");
            }
        } catch (error) {
            console.error("Error saving draft:", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitClicked(true);
        setDraftClicked(false);
        // Validate required fields
        if (!tourName || !tourSummary || !tourOverview || !pricePerPerson || !minPersons || !maxPersons || destinations.length === 0 || dailyPlan.length === 0 || includes.length === 0 || excludes.length === 0 || categories.length === 0 || images.length === 0) {
            setPublishable(false);
            return;
        }
        setPublishable(true);
        // Implement form submission logic here
        let uploadedFiles = [];
        if(!editingPkg){
            try {
                const formData = new FormData();

                // Collect only new files (not strings)
                images.forEach(img => {
                    if (typeof img !== "string") {
                        formData.append("images", img);
                    }
                });

                if (formData.has("images")) {
                    const imgUploadResponse = await fetch(
                        "/api/tours/upload-images",
                        { method: "POST", body: formData }
                    );
                    const imgData = await imgUploadResponse.json();
                    uploadedFiles = imgData.files;
                }
                
                const finalImages = [
                    ...images.filter(i => typeof i === "string"),
                    ...uploadedFiles
                ];

                // Create tour once
                const response = await fetch(
                    "/api/tours/create-package",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: tourName,
                            summary: tourSummary,
                            overview: tourOverview,
                            price: pricePerPerson,
                            maxGroupSize: maxPersons,
                            minGroupSize: minPersons,
                            destinations: destinations,
                            dailyPlan : typingActTitle || typingActDesc
                                ? [...dailyPlan, { actTitle: typingActTitle, actDescription: typingActDesc }]
                                : dailyPlan,
                            includes: includes,
                            excludes: excludes,
                            categories: categories,
                            status: "Published",
                            coverIndex : coverIndex,
                            images: finalImages,
                            isFeatured
                        }),
                    }
                );

                if (response.ok) {
                    console.log("Tour published!");
                    onClose();
                }
                else console.error("Failed to publish tour");

            } catch (error) {
                console.error("Error publishing tour:", error);
            }
        }else{
            try {
              const formData = new FormData();
              // Collect only new files (not strings)
              images.forEach((img) => {
                if (typeof img !== "string") {
                  formData.append("images", img);
                }
              });
              // Upload only if new images exist
              let finalImages = images; 
              if (formData.has("images")) {
                const imgUploadResponse = await fetch(
                  "/api/tours/upload-images",
                  { method: "POST", body: formData }
                );
                const imgData = await imgUploadResponse.json();
                if (imgUploadResponse.ok) {
                  uploadedFiles = imgData.files;
                  finalImages = [
                    ...images.filter((i) => typeof i === "string"),
                    ...uploadedFiles,
                  ];
                }
              }
              // Update tour once
              const response = await fetch(
                `/api/tours/update-package/${editingPkg._id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: tourName,
                    summary: tourSummary,
                    overview: tourOverview,
                    price: pricePerPerson,
                    maxGroupSize: maxPersons,
                    minGroupSize: minPersons,
                    destinations: destinations,
                    dailyPlan: typingActTitle || typingActDesc
                      ? [...dailyPlan,{ actTitle: typingActTitle, actDescription: typingActDesc }]
                      : dailyPlan,
                      
                    includes: includes,
                    excludes: excludes,
                    categories: categories,
                    status: "Published",
                    coverIndex: coverIndex,
                    images: finalImages,
                    isFeatured,
                  }),
                }
              );
              if (response.ok) {
                console.log("Tour updated and published!");
                onClose();
              } else console.error("Failed to publish tour");
            } catch (error) {
                console.error("Error publishing tour:", error);
            }
        }
    }

    const handleCheckCat = (category) => {
        if (categories.includes(category)) {
            setCategories(categories.filter(cat => cat !== category));
        } else {
            setCategories([...categories, category]);
        }
    };

    return (
        <div className="w-fit">
            <div className="h-[90vh] rounded overflow-auto no-scollbar bg-background-light dark:bg-background-dark w-fit font-display text-text-light dark:text-text-dark">
                
                <form className="relative w-full flex flex-col"  onSubmit={handleSubmit}>
                    {/* PageHeading */}
                        <div className="sticky top-0 left-0 flex flex-wrap items-center justify-between gap-4 bg-secondary dark:bg-deep-forest-green/80 backdrop-blur-sm p-6 z-10">
                        <p className="text text-4xl font-black leading-tight tracking-[-0.033em]">
                            Create a New Tour Package
                        </p>
                        <div className="flex items-center gap-3">
                            <button onClick={handleSaveDraft} type="button" className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-deep-forest-green px-6 text-deep-forest-green font-semibold transition-colors hover:bg-secondary/10">
                            Save Draft
                            </button>
                            <button type="submit" className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-deep-forest-green px-6 text-base font-semibold text-secondary transition-colors hover:bg-deep-forest-green/90">
                            Publish Tour
                            </button>
                        </div>
                        <div className="flex w-full justify-end">
                            {!publishable && submitClicked &&
                            <span className="text-red-500 italic text-xs">Please Fill All Required Fields</span>
                            }
                            {!draftable && draftClicked &&
                            <span className="text-red-500 italic text-xs">Tour Name is Required to Save Draft</span>
                            }
                        </div>
                        </div>
                    
                    {/* Main Content */}
                    <main className="flex-1 p-8">
                    <div className="mx-auto max-w-7xl">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column (Main Form) */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Section: Basic Information */}
                            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                            <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                                Basic Information
                            </h2>
                            <div className="flex flex-col gap-6">
                                <label className="flex flex-col w-full">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    Tour Name
                                </p>
                                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">

                                <input
                                    className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                    placeholder="e.g., Sri Lanka's Cultural Triangle Expedition"
                                    value={tourName}
                                    onChange={(e) => setTourName(e.target.value)}
                                />
                                
                                </div>
                                {tourNameError && <p className="text-red-500 text-xs mt-1 italic">*Tour Name is required.</p>}
                                </label>
                                
                                <label className="flex flex-col w-full">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    Tour Summary
                                </p>
                                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">

                                    <textarea
                                        className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark overflow-hidden resize-none"
                                        placeholder="A short, catchy description for tour listings."
                                        value={tourSummary}
                                        onChange={(e) => setTourSummary(e.target.value)}
                                    />
                                </div>
                                {tourSummaryError && <p className="text-red-500 text-xs mt-1 italic">*Tour Summary is required.</p>}
                                </label>
                                
                                <label className="flex flex-col w-full">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    Tour Overview <span className="text-gray text-xs">(Description)</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">

                                    <textarea
                                        className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark overflow-hidden resize-none"
                                        placeholder="Describe the tour in detail, including the itinerary, highlights, and unique experiences."
                                        value={tourOverview}
                                        onChange={(e) => setTourOverview(e.target.value)}
                                    />
                                </div>
                                {tourOverviewError && <p className="text-red-500 text-xs mt-1 italic">*Tour Overview is required.</p>}
                                </label>
                            </div>
                            </div>
                            {/* Section: Logistics & Pricing */}
                            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                            <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                                Logistics &amp; Pricing
                            </h2>
                            <div className="flex flex-col gap-6">
                                
                                <label className="flex flex-col">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2 ">
                                    Price Per Person (Rs)
                                </p>
                                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                    <input
                                        type="number"
                                        className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                        placeholder="e.g., 15000"
                                        value={pricePerPerson}
                                        onChange={(e) => setPricePerPerson(e.target.value)}
                                        />
                                            
                                    </div>
                                {pricePerPersonError && <p className="text-red-500 text-xs mt-1 italic">*Price Per Person is required.</p>}
                                </label>
                                <div>
                                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                        Number of Persons
                                    </p>
                                    <div className="flex gap-5">
                                        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                            <input
                                            type="number"
                                            className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                            placeholder="minimum"
                                            value={minPersons}
                                            onChange={(e) => setMinPersons(e.target.value)}
                                            />
                                            {minPersonsError && <p className="text-red-500 text-xs mt-1 italic">*Minimum Persons is required.</p>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                            <input
                                            type="number"
                                            className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                            placeholder="maximum"
                                            value={maxPersons}
                                            onChange={(e) => setMaxPersons(e.target.value)}
                                            />
                                            {maxPersonsError && <p className="text-red-500 text-xs mt-1 italic">*Maximum Persons is required.</p>}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            </div>
                            {/* Section: Itinerary Details */}
                            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                            <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                                Itinerary Details
                            </h2>
                            <div className="flex flex-col gap-6">
                                
                                <div>
                                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                        Destinations 
                                    </p>
                                    <div className="relative flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                        {destinations.map((des, index) => (
                                            <span key={index} className="flex items-center gap-1.5 bg-secondary/20 text-secondary-dark font-medium px-3 py-1.5 rounded text-sm">
                                                {des.name}{" "}
                                                <button
                                                    onClick={() => removeDestination(des)}
                                                    className="material-symbols-outlined !text-sm">
                                                    close
                                                </button>
                                            </span> 
                                        ))}
                                        
                                        <input
                                        className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                        placeholder="Add destinations..."
                                        value={typingDestination}
                                        onChange={(e) => setTypingDestination(e.target.value)}                                        
                                        />
                                        <div className="absolute w-full top-full left-0 bg-white shadow-lg rounded-b overflow-hidden">
                                            <ul className="flex flex-col ">
                                                {suggestedDestinations.map((des, index) => (
                                                    <li key={index} 
                                                        onClick={() => {                                                            
                                                            newDestination(des);
                                                            setTypingDestination("");
                                                        }}    
                                                        className="py-2 px-4 hover:bg-accent hover:text-secondary cursor-pointer">{des.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                    </div>
                                    {destinationsError && <p className="text-red-500 text-xs mt-1 italic">*At least one destination is required.</p>}
                                </div>
                                <div>
                                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                        Daily Plan
                                    </p>
                                    {dailyPlan.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-2 border border-dashed p-2 rounded-lg border-border-light dark:border-border-dark mb">
                                        <label className="flex justify-between w-full mb-1">Day {index + 1}<span className="text-red-500 italic text-xs mr-5 cursor-pointer underline" onClick={() => handleRemoveDay(index)}>Remove Day</span></label>
                                        <div className="flex flex-col flex-wrap gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                            <input
                                            className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                            placeholder="Title of activities..."
                                            value={item.actTitle}
                                            onChange={(e) => handleActTitleChange(index, e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col flex-wrap gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                            <input
                                            className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                            placeholder="Title of activities..."
                                            value={item.actDescription}
                                            onChange={(e) => handleActDescChange(index, e.target.value)}
                                            />  
                                        </div>
                                        
                                    </div>
                                    ))}
                                    <div className="flex flex-col gap-2 border border-dashed p-2 rounded-lg border-border-light dark:border-border-dark mt-2">
                                        <label className="flex justify-between w-full mb-1">Day {dailyPlan.length + 1}</label>
                                        <div className="flex flex-col flex-wrap gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                            <input
                                            className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                            placeholder="Title of activities..."
                                            value={typingActTitle}
                                            onChange={(e) => setTypingActTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col flex-wrap gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                            <input
                                            className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                            placeholder="Title of activities..."
                                            value={typingActDesc}
                                            onChange={(e) => setTypingActDesc(e.target.value)}
                                            />  
                                        </div>
                                        
                                    </div> 
                                    <div className="w-full flex justify-end"><button type="button" className="mt-3 text-sm text-primary font-semibold" onClick={addDailyPlanItem}>+ Add Another Day</button>
                                    </div>
                                    {dailyPlanError && <p className="text-red-500 text-xs mt-1 italic">*At least one daily plan item is required.</p>}                                       
                                </div>
                                <div>
                                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                        What's Included
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                        {includes.map((inc, index) => (
                                            <span key={index} className="flex items-center gap-1.5 bg-secondary/20 text-secondary-dark font-medium px-3 py-1.5 rounded text-sm">
                                                {inc}{" "}
                                                <button
                                                    onClick={() => setIncludes(includes.filter((_,i) => i !== index))}
                                                    className="text-secondary-dark hover:text-secondary"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                        className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                        placeholder="Add inclusions (e.g., accommodation, meals)..."
                                        value={typingInclude}
                                        onChange={(e) => setTypingInclude(e.target.value)}
                                        onKeyDown={(e) =>{
                                            if(e.key === 'Enter'){
                                                e.preventDefault();
                                                setIncludes([...includes, typingInclude]);
                                                setTypingInclude("");
                                            }
                                        }}
                                        />
                                    </div>
                                {includesError && <p className="text-red-500 text-xs mt-1 italic">*Includes field is required.</p>}
                                </div>
                                <div>
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    What's Excluded
                                </p>
                                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                    {excludes.map((ex, index) => (
                                        <span key={index} className="flex items-center gap-1.5 bg-secondary/20 text-secondary-dark font-medium px-3 py-1.5 rounded text-sm">
                                                {ex}{" "}
                                                <button
                                                    onClick={() => setExcludes(excludes.filter((_,i) => i !== index))}
                                                    className="material-symbols-outlined !text-sm">
                                                    close
                                                </button>
                                            </span> 
                                    ))}
                                    <input
                                    className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                    placeholder="Add exclusions (e.g., flights, visa fees)..."
                                    value={typingExclude}
                                    onChange={(e) => setTypingExclude(e.target.value)}
                                    onKeyDown={(e) =>{
                                        if(e.key === 'Enter'){
                                            e.preventDefault();
                                            setExcludes([...excludes, typingExclude]);
                                            setTypingExclude("");
                                        }
                                    }}
                                    />
                                </div>
                                {excludesError && <p className="text-red-500 text-xs mt-1 italic">*Excludes field is required.</p>}
                                </div>
                            </div>
                            </div>
                            {/* Section: Metadata & Visibility */}
                            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                                <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                                    Metadata &amp; Visibility
                                </h2>
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <label className="flex flex-col flex-1">
                                    <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                        Tour Category
                                    </p>
                                    {categoriesError && <p className="text-red-500 text-xs mt-1 italic">*At least one category is required.</p>}
                                    <ul className="m-0 list-none  list-inside text-text-light dark:text-text-dark">
                                        {categoryList.map((cat, index) => (
                                        <li key={index} className="flex items-center"><input type="checkbox" checked={categories.includes(cat)} onChange={() => {handleCheckCat(cat)}} className="mr-2 w-4 h-4 rounded-md text-primary bg-neutral-secondary-medium border-default-medium focus:ring-primary dark:focus:ring-primary ring-offset-neutral-primary focus:ring-2" />{cat}</li>
                                        ))}
                                        
                                    </ul>
                                    <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-border-light dark:border-border-dark p-2 min-h-14">
                                            {categories.map((cat, index) => (
                                                <span key={index} className="flex items-center gap-1.5 bg-secondary/20 text-secondary-dark font-medium px-3 py-1.5 rounded text-sm">
                                                {cat}{" "}
                                                <button
                                                    onClick={() =>
                                                        setCategories(categories.filter((_,i) => i !== index))
                                                    }
                                                    className="material-symbols-outlined !text-sm">
                                                    close
                                                </button>
                                                </span>
                                            ))}
                                            <input
                                            className="form-input flex-1 bg-transparent border-0 focus:ring-0 p-2 placeholder:text-subtle-light dark:placeholder:text-subtle-dark"
                                            placeholder="Add Category..."
                                            value={typingCategory}
                                            onChange={(e) => setTypingCategory(e.target.value)}
                                            onKeyDown={(e) =>{
                                                if(e.key === "Enter"){
                                                    e.preventDefault()
                                                    if (typingCategory.trim() !== "") {
                                                        setCategories([...categories, typingCategory.trim()]);
                                                        setTypingCategory("");
                                                    }
                                                }
                                            }}
                                            />
                                        </div>
                                    </label>
                                    
                                </div>
                                <div className="flex items-center gap-4 pt-8 w-full flex justify-end">
                                        <label
                                            className="relative inline-flex cursor-pointer items-center"
                                            htmlFor="featured-toggle"
                                        >
                                            <input
                                            className="peer sr-only"
                                            id="featured-toggle"
                                            type="checkbox"
                                            defaultValue=""
                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                            checked={isFeatured}
                                            />
                                            <div className="peer h-7 w-14 rounded-full bg-gray-300 after:absolute after:start-[4px] after:top-1 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-deep-forest-green peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full" />
                                        </label>
                                        <p className="text-text-light dark:text-text-dark text-base font-medium">
                                            Mark as Featured
                                        </p>
                                </div>
                            </div>
                            {/* Section 3: Highlights */}
                            
                        </div>
                        {/* Right Column (Media Sidebar) */}
                        <div className="lg:sticky top-8 flex flex-col gap-8 h-fit">
                            {/* Floating Video Player */}
                            <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                            <div className="relative aspect-video rounded-lg overflow-hidden">
                                <img
                                className="w-full h-full object-cover"
                                data-alt="Scenic video of Sri Lankan tea plantations"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5WXrwd5rKNWwVq30PLsaXBt_FEC2xj8l3Edr1SQJd0REHtQJmPXYo6qjBSngH_371DoTAR8FDufxeeFR75VUnlNdxlog1c0zhXB-agWR--42zIihOi72X2DzJ78epbUK9_pDot131QWTRmkehlihS9SRfVL1tv_6on-6doxL9JdX5Q6OqkKZsTW8C7HgZiYc0fq4t-ktc4yPPoBIZkhnCfTXq7kGe45gzlxaDZqZPFfuE72rpcqGAG0o0fUVOGGZkqnenAQNurpg"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <button className="bg-white/20 backdrop-blur-sm p-4 rounded-full text-white">
                                    <span className="material-symbols-outlined !text-4xl">
                                    play_arrow
                                    </span>
                                </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <p className="text-subtle-light dark:text-subtle-dark text-sm">
                                Watch instructions or preview
                                </p>
                                <button className="text-subtle-light dark:text-subtle-dark">
                                <span className="material-symbols-outlined !text-xl">
                                    close
                                </span>
                                </button>
                            </div>
                            </div>
                            {/* Image Uploader */}
                            <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                            <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight">
                                Tour Gallery
                            </h3>
                            <p className="text-subtle-light dark:text-subtle-dark text-sm mt-1">
                                You can set a cover image by clicking "set as cover" on an image.
                            </p>
                            {imagesError && <p className="text-red-500 text-xs mt-1 italic">*At least one image is required.</p>}
                            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-light dark:border-border-dark p-8 text-center">
                                <span className="material-symbols-outlined text-5xl text-subtle-light dark:text-subtle-dark">
                                cloud_upload
                                </span>
                                <p className="mt-2 font-semibold text-text-light dark:text-text-dark">
                                Drag &amp; drop images here
                                </p>
                                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                                or
                                </p>
                                <label
                                    htmlFor="fileUpload"
                                    className="mt-2 text-sm font-semibold text-primary cursor-pointer"
                                >
                                    Browse Files
                                </label>

                                <input
                                    id="fileUpload"
                                    className="sr-only"
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        setImages((prevImages) => [...prevImages, ...files]);
                                    }}
                                />
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {images.map((image, index) => (
                                <div className="relative group aspect-square rounded-lg overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    data-alt="The Nine Arch Bridge in Ella, Sri Lanka"
                                    
                                    src={image instanceof File ? URL.createObjectURL(image) : `/uploads/${image}`}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-white">
                                    <span
                                        className="material-symbols-outlined"
                                        onClick={() => handleImageDelete(index)}
                                        >delete</span>
                                    </button>
                                </div>
                                {coverIndex === index ? (
                                <div
                                    
                                    className="absolute top-1 left-1 bg-accent text-xs text-secondary font-bold px-2 py-0.5 rounded">
                                    cover
                                </div>
                                ) : (
                                    <div 
                                    onClick={() => setCoverIndex(index)}
                                    className="absolute top-1 left-1 bg-gray-500/50 cursor-pointer text-xs text-secondary font-bold px-2 py-0.5 rounded">
                                    set as cover
                                </div>
                                )}
                                </div>
                                ))}
                            </div>
                            
                            </div>
                        </div>
                        </div>
                    </div>
                    </main>
                </form>
                </div>

        </div>
    );
    
}

function Destinations(){
    const [showOverlay, setShowOverlay] = useState(false);
    const [showAddDestinationModal, setShowAddDestinationModal] = useState(false);

    const handleAddDestination = () => {
        setShowOverlay(true);
        setShowAddDestinationModal(true);
    };

    const handleHideAddDestinationModal = () => {
        setShowOverlay(false);
        setShowAddDestinationModal(false);
    };

    const [allDestinations, setAllDestinations] = useState([]);

    const getDestinations = async () => {
            // Fetch destinations from the backend API
        try{
            const response = await fetch('/api/destinations/all');
            const data = await response.json();
            setAllDestinations(data.destinations);
        } catch (error) {
            console.error('Error fetching destinations:', error);


        }

    };
    const setCoverImg = (index, destination) =>{
        if(destination.images.length > 0){
            const img = destination.images[index];
            
            return `/uploads/${img}`;
        }else{
            return noImg;
        }

    }
    

    const [currMenu, setCurrMenu] = useState(null);
    const menuRef = useRef(null);

  // Close menu if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setCurrMenu(null);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [editingDes, setEditingDes] = useState(null);

    const handleClickEdit = (des) => {
        setEditingDes(des);
        setShowOverlay(true);
        setShowAddDestinationModal(true);
    }

    const handleClickDelete = async (des) => {
        try{
            const response = await fetch(`/api/destinations/delete/${des._id}`, {
                method: 'DELETE',
            });
            if(response.ok){
                console.log('Destination deleted successfully');
                getDestinations();
            }else{
                console.error('Failed to delete destination');
            }
        }catch(error){
            console.error('Error deleting destination:', error);
        }
    }

    const [checkedEntries, setCheckedEntries] = useState([]);

    const handleCheckboxChange = (desId) => {
        if (checkedEntries.includes(desId)) {
            setCheckedEntries(checkedEntries.filter((id) => id !== desId));
        } else {
            setCheckedEntries([...checkedEntries, desId]);
        }
    };

    const handleAllCheckboxChange = () => {
        if (checkedEntries.length === filteredDestinations.length) {
            setCheckedEntries([]);

        } else {
            setCheckedEntries(filteredDestinations.map((des) => des._id));
        }
    };


    //get all regions
    const [regionList, setRegionList] = useState([]);
    const getRegions = async () => {
        try{
            const response = await fetch('/api/destinations/region-list');
            const data = await response.json();
            setRegionList(data.regions);
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    };

    useEffect(() => {
        getRegions();
    }, []);

    // get all categories
    const [categoryList, setCategoryList] = useState([]);
    const getCategories = async () => {
        try{
            const response = await fetch('/api/destinations/category-list');
            const data = await response.json();
            setCategoryList(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        getCategories();
    }, []);

    // const [searchRequest, setSearchRequest] = useState('');
    const [filteredDestinations, setFilteredDestinations] = useState(allDestinations);
    const [searchRequest, setSearchRequest] = useState('');
    const [regionFilter, setRegionFilter] = useState('All Regions');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [statusFilter, setStatusFilter] = useState('Any Status');

    // const []
    const handleSearch = () => {
        const query = searchRequest.toLowerCase();

        const filtered = allDestinations.filter((des) => {
            const matchesName = des.name.toLowerCase().includes(query);

            const matchesRegion =
                regionFilter === 'All Regions' || des.region === regionFilter;

            const matchesCategory =
                categoryFilter === 'All Categories' || des.categories.includes(categoryFilter);

            const matchesStatus =
                statusFilter === 'Any Status' || des.status === statusFilter;

            return matchesName && matchesRegion && matchesCategory && matchesStatus;
        });

        setFilteredDestinations(filtered);
    };

    useEffect(() => {
        handleSearch();
    }, [allDestinations, regionFilter, categoryFilter, statusFilter, searchRequest]);

    
    const deleteChecked = async () => {
        try{
            const response = await fetch(`/api/destinations/delete-multiple`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: checkedEntries }),
            });
            if(response.ok){
                console.log('Selected destinations deleted successfully');
                getDestinations();
                setCheckedEntries([]);
            }else{
                console.error('Failed to delete selected destinations');
            }
        }catch(error){
            console.error('Error deleting selected destinations:', error);
        }
    };

    const [tableMenuState, setTableMenuState] = useState(false);
    const toggleTableMenu = () => {
        setTableMenuState(!tableMenuState);
    };
    const tableMenuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (tableMenuRef.current && !tableMenuRef.current.contains(event.target)) {
            setTableMenuState(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    
    useEffect(() => {
        getDestinations();
    }, [allDestinations,showOverlay, showAddDestinationModal, currMenu]);

    return (
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="mx-auto ">
                
                <div className={`q-full h-full bg-[url(${db_bg})] bg-cover bg-center rounded p-6 overflow-hidden shadow-lg  mb-5`}>
                    {/* PageHeading */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 ">
                    <h1 className="text-4xl tracking-tighter text-text-dark dark:text-text-light">
                        Manage Destinations
                    </h1>
                    <button 
                        className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded h-10 px-4 bg-deep-forest-green text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-deep-forest-green/90"
                        onClick={() => { handleAddDestination(); setEditingDes(null);}}>
                        <span className="material-symbols-outlined">add_circle</span>
                        <span className="truncate">Add New Destination</span>
                    </button>
                    </div>
                    {/* Stats */}
                    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 text-text-dark dark:text-text-light mb-5`}>
                        
                    <div className="flex flex-col gap-2 rounded p-6 border border-2 border-[rgba(225,225,255,0.2)] bg-[rgba(225,225,225,0.1)] backdrop-blur-sm">
                        <p className="">Total Destinations</p>
                        <p className="text-2xl font-bold tracking-light">82</p>
                        <p className="text-green-600 text-sm font-medium">+5.2%</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded p-6 border border-2 border-[rgba(225,225,255,0.2)] bg-[rgba(225,225,225,0.1)] backdrop-blur-sm">
                        <p className="text-base font-medium">Most Popular</p>
                        <p className="text-2xl font-bold tracking-light">Ella</p>
                        <p className="text-green-600 text-sm font-medium">+12%</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded p-6 border border-2 border-[rgba(225,225,255,0.2)] bg-[rgba(225,225,225,0.1)] backdrop-blur-sm">
                        <p className="text-base font-medium">Newest Destination</p>
                        <p className="text-2xl font-bold tracking-light">Jaffna</p>
                        <p className="text-green-600 text-sm font-medium">+2.1%</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded p-6 border border-2 border-[rgba(225,225,255,0.2)] bg-[rgba(225,225,225,0.1)] backdrop-blur-sm">
                        <p className="text-base font-medium">Active Destinations</p>
                        <p className="text-2xl font-bold tracking-light">75</p>
                        <p className="text-red-600 text-sm font-medium">-1.5%</p>
                    </div>
                    </div>
                </div>
                {/* Toolbar and Table Section */}
                <div className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark overflow-hidden">
                {/* SearchBar & Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1 min-w-[280px]">
                    <label className="flex flex-col h-12 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded h-full">
                        <div className="text-text-light/70 dark:text-text-dark/70 flex bg-white dark:bg-black/20 items-center justify-center pl-4 rounded-l border border-gray-300 dark:border-gray-600 border-r-0">
                            <span className="material-symbols-outlined" >search</span>
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light dark:text-text-dark bg-white dark:bg-black/20 focus:outline-0 focus:ring-1 focus:ring-primary h-full placeholder:text-text-light/70 dark:placeholder:text-text-dark/70 px-4 rounded-l-none text-base font-normal leading-normal border border-gray-300 dark:border-gray-600"
                            placeholder="Search destinations..."
                            defaultValue=""
                            onChange={(e) => setSearchRequest(e.target.value)}
                        />
                        </div>
                    </label>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 ">
                    <select 
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="form-select rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-black/20 focus:ring-1 focus:ring-primary focus:border-primary">
                        <option>All Regions</option>
                        {regionList.map((region, index) => (
                            <option key={index} value={region}>{region}</option>
                        ))}
                    </select>
                    <select 
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="form-select rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-black/20 focus:ring-1 focus:ring-primary focus:border-primary">
                        <option>All Categories</option>
                        {categoryList.map((category, index) => (
                            <option 
                                key={index}
                                value={category}                                
                            >{category}</option>
                        ))}
                    </select>
                    <select 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-black/20 focus:ring-1 focus:ring-primary focus:border-primary">
                        <option>Any Status</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                        <div className="relative" ref={tableMenuRef}>
                            <span
                                onClick={toggleTableMenu}
                                className="material-symbols-outlined text-md font-normal cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded">more_horiz</span>
                            <div 
                                style={{ display: tableMenuState ? 'block' : 'none' }}
                                className="absolute w-max overflow-hidden top-full right-0 bg-white shadow-lg rounded-b z-10">
                                <ul className="flex flex-col">
                                    <li 
                                        onClick={() => deleteChecked()}
                                        className="flex items-center justify-between px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer">
                                        Delete Selected
                                        <span className=" material-symbols-outlined text-md ml-5 mt-2 font-normal cursor-pointer">delete</span></li>
                                    <li
                                        
                                        className="flex items-center justify-between px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer">
                                        Delete All
                                        <span className=" material-symbols-outlined text-md ml-5 mt-2 font-normal cursor-pointer">warning</span></li>

                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Data Table */}
                <div className="">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-text-light/70 dark:text-text-dark/70">
                        <tr>
                        <th className="px-6 py-3 font-medium" scope="col">
                            <input type="checkbox" 
                                onChange = {() => handleAllCheckboxChange()}
                                className="w-4 h-4 rounded-sm text-primary bg-neutral-secondary-medium border-default-medium focus:ring-primary dark:focus:ring-primary ring-offset-neutral-primary focus:ring-2" />
                        </th>
                        <th className="px-6 py-3 font-medium" scope="col">
                            Destination Name
                        </th>
                        <th className="px-6 py-3 font-medium" scope="col">
                            Region
                        </th>
                        <th className="px-6 py-3 font-medium" scope="col">
                            Status
                        </th>
                        <th className="px-6 py-3 font-medium" scope="col">
                            Date Added
                        </th>
                        <th className="px-6 py-3 font-medium" scope="col">
                            Location
                        </th>
                        <th className="px-6 py-3 font-medium text-center" scope="col">
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        filteredDestinations.map((destination) => (
                        <tr key={destination._id} className="border-b dark:border-gray-700 hover:bg-primary/5">
                            <td className="px-6 py-3 font-medium" scope="col">
                                <input type="checkbox" className="w-4 h-4 rounded-sm text-primary bg-neutral-secondary-medium border-default-medium focus:ring-primary dark:focus:ring-primary ring-offset-neutral-primary focus:ring-2"
                                onChange={() => handleCheckboxChange(destination._id)}
                                checked={checkedEntries.includes(destination._id)}
                                />
                            </td>
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                            <img
                            className="w-12 h-9 object-cover rounded-md"
                            data-alt={destination.name}
                            src={setCoverImg(destination.coverIndex, destination)}
                            />
                            {destination.name}
                        </td>
                        <td className="px-6 py-4">{destination.region}</td>
                        <td className={`px-6 py-4`}>
                            <span className={`px-5 py-2 rounded-md ${destination.status === 'Published' ? 'text-accent bg-primary/10' : destination.status === 'On Hold' ? 'text-yellow-600 bg-yellow-500/10' : 'text-red-600 bg-red-500/10'}`}>{destination.status}</span>                            
                        </td>
                        <td className="px-6 py-4">{new Date(destination.updatedAt).toISOString().split("T")[0]}</td>
                        <td className="px-6 py-4">
                            {destination.location.shortName}
                        </td>
                        <td className="relative px-6 py-4 text-center">
                            <span 
                                className="material-symbols-outlined text-lg text-text-light/70 dark:text-text-dark/70 cursor-pointer hover:text-primary"
                                onClick={() => setCurrMenu(destination._id)}
                                >more_vert</span>
                            {currMenu === destination._id &&
                                <div 
                                    ref={menuRef}
                                    className="overflow-hidden absolute top-12 right-[50%] bg-white shadow rounded-md z-10">
                                    <ul className="m-0 flex flex-col list-none">
                                        <li className="flex gap-2 py-2 px-4 text-sm justify-between hover:bg-primary/10 cursor-pointer" onClick={() => handleClickEdit(destination)}>Edit<span className="material-symbols-outlined text-md">edit</span></li>
                                        <li className="flex gap-2 py-2 px-4 text-sm hover:text-red-500 justify-between hover:bg-primary/10 cursor-pointer" onClick={() => handleClickDelete(destination)}>Delete<span className="material-symbols-outlined text">delete</span></li>
                                    </ul>
                                </div>
                            }
                        </td>
                        </tr>
                        ))}
                    
                    </tbody>
                    
                    </table>
                    {filteredDestinations.length === 0 && (
                        <div className="border-b dark:border-gray-700 hover:bg-primary/5">
                            <span className="text-center text-text-light dark:text-text-dark w-full p-4">No destinations found.</span>
                        </div>
                    )} 
                    
                </div>
                {/* Pagination */}
                <nav
                    aria-label="Table navigation"
                    className="flex items-center justify-between p-4"
                >
                    <span className="text-sm font-normal text-text-light/70 dark:text-text-dark/70">
                    Showing{" "}
                    <span className="font-semibold text-text-light dark:text-text-dark">
                        1-4
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-text-light dark:text-text-dark">
                        82
                    </span>
                    </span>
                    <ul className="inline-flex -space-x-px text-sm h-8">
                    <li>
                        <a
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight border rounded-s hover:bg-primary/10 border-gray-300 dark:border-gray-600"
                        href="#"
                        >
                        Previous
                        </a>
                    </li>
                    <li>
                        <a
                        aria-current="page"
                        className="flex items-center justify-center px-3 h-8 text-white bg-primary border border-primary"
                        href="#"
                        >
                        1
                        </a>
                    </li>
                    <li>
                        <a
                        className="flex items-center justify-center px-3 h-8 leading-tight border hover:bg-primary/10 border-gray-300 dark:border-gray-600"
                        href="#"
                        >
                        2
                        </a>
                    </li>
                    <li>
                        <a
                        className="flex items-center justify-center px-3 h-8 leading-tight border hover:bg-primary/10 border-gray-300 dark:border-gray-600"
                        href="#"
                        >
                        3
                        </a>
                    </li>
                    <li>
                        <a
                        className="flex items-center justify-center px-3 h-8 leading-tight border rounded-e hover:bg-primary/10 border-gray-300 dark:border-gray-600"
                        href="#"
                        >
                        Next
                        </a>
                    </li>
                    </ul>
                </nav>
                </div>
            </div>
            {showOverlay && (
                <div className="fixed top-0 left-0 backdrop-blur-[5px] bg-[rgba(0,0,0,0.5)] w-screen h-screen z-30"></div>
            )}
            {showAddDestinationModal && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50" onClick={handleHideAddDestinationModal}>
                    <AddDestinationForm onClose={handleHideAddDestinationModal} editingDes={editingDes} />
                </div>
            )}
            </main>
    );
}



function AddDestinationForm({onClose, editingDes}) {
    
    const [locationName, setLocationName] = useState("");
    const [locSummary, setLocSummary] = useState("");
    const [locDescription, setLocDescription] = useState("");
    const [locRegion, setLocRegion] = useState("");
    const [locCoordinates, setLocCoordinates] = useState(null);
    const [images, setImages] = useState([]);
    const [coverImage, setCoverImage] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [categories, setCategories] = useState([]);
    const [typingCategory, setTypingCategory] = useState("");
    const [status, setStatus] = useState("Draft");

    const [nameError, setNameError] = useState(false);
    const [summaryError, setSummaryError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [regionError, setRegionError] = useState(false);
    const [coordinatesError, setCoordinatesError] = useState(false);
    const [imagesError, setImagesError] = useState(false);
    const [categoriesError, setCategoriesError] = useState(false);
    const [publishable, setPublishable] = useState(true);
    const [savable, setSavable] = useState(true);

    const [submitClicked, setSubmitClicked] = useState(false);
    
    useEffect(() => {
        if(submitClicked){
            if(locationName) {setNameError(false); setSavable(false)} else {setNameError(true); setSavable(true);}
            if(locSummary) setSummaryError(false); else setSummaryError(true);
            if(locDescription) setDescriptionError(false); else setDescriptionError(true);
            if(locRegion) setRegionError(false); else setRegionError(true);
            if(locCoordinates) setCoordinatesError(false); else setCoordinatesError(true);
            if(images.length > 0) setImagesError(false); else setImagesError(true);
            if(categories.length > 0) setCategoriesError(false); else setCategoriesError(true);
            
            if(locationName && locSummary && locDescription && locRegion && locCoordinates && images.length > 0 && categories.length > 0){
                setPublishable(true);
            }else{
                setPublishable(false);
            }
        }
    }, [locationName, locSummary, locDescription, locRegion, locCoordinates, images, categories, submitClicked]);

    
    const [regionList, setRegionList] = useState([])

    useEffect(() => {
        if(editingDes){
            setLocationName(editingDes.name);
            setLocSummary(editingDes.summary !== "N/A" ? editingDes.summary : "");
            setLocDescription(editingDes.description !== "N/A" ? editingDes.description : "");
            setLocRegion(editingDes.region !== "N/A" ? editingDes.region : "");
            setSelectedLocation(editingDes.location || null);
            setLocCoordinates(editingDes.location || null);
            setCategories(editingDes.categories || []);
            setImages(editingDes.images || []);
            setCoverImage(editingDes.coverIndex || 0);
            setStatus(editingDes.status || "Draft");
        }
    }, [editingDes]);
    
    const fetchRegionsList = async () => {
        try {
            const response = await fetch('/api/destinations/region-list');
            if (!response.ok) {
                throw new Error('Failed to fetch regions');
            }
            const data = await response.json();
            setRegionList(data.regions);
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    };

    const [filterdRegions, setFilteredRegions] = useState([])

    useEffect(() => {
        if(regionList && locRegion){
            
            const filtered = regionList.filter(region =>
                region.toLowerCase().includes(locRegion.trim().toLowerCase())
            );
            console.log(filtered);
            setFilteredRegions(filtered);
        }
        
    }, [regionList]);

    const [categoriesList, setCategoriesList] = useState([])
    const [filteredCategories, setFilteredCategories] = useState([])
    const fetchCategoriesList = async () => {
        try {
            const response = await fetch('/api/destinations/category-list');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategoriesList(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if(categoriesList.length > 0 && typingCategory){
            
            const filtered = categoriesList.filter(category =>
                category.toLowerCase().includes(typingCategory.trim().toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [categoriesList, typingCategory]);

    const handleSubmit = async (e) => {
        setSubmitClicked(true);
        e.preventDefault();
        if(!locationName || !locSummary || !locDescription || !locRegion || !locCoordinates || images.length === 0 || categories.length === 0){
            console.log(locationName, locSummary, locDescription, locRegion, locCoordinates, images);
            if(!locationName) setNameError(true);
            if(!locSummary) setSummaryError(true);
            if(!locDescription) setDescriptionError(true);
            if(!locRegion) setRegionError(true);
            if(!locCoordinates) setCoordinatesError(true);
            if(images.length === 0) setImagesError(true);
            if(categories.length === 0) {setCategoriesError(true); 
                
            }
            setPublishable(false);
            return;
        }

        setNameError(false);
        setSummaryError(false);
        setDescriptionError(false);
        setRegionError(false);
        setCoordinatesError(false);
        setImagesError(false);
        setCategoriesError(false);
        setPublishable(true);

        // Submit form logic here
        try {
            console.log("Submitting form...");
            const formData = new FormData();
            let filenames = [];
            let oldImages = []
            images.forEach(img => {
                if (img instanceof File) {
                    formData.append("images", img);
                }else{
                    oldImages.push(img);
                }
            });
            
            
            const uploadRes = await fetch("/api/destinations/upload-images", {
            method: "POST",
            body: formData,
            });

            
            const uploadData = await uploadRes.json();
            filenames = uploadData.files; // array of saved images
            filenames = [...oldImages, ...filenames];

            let url = ""
            if(editingDes){
                url = `/api/destinations/update-draft/${editingDes._id}`;
            }else{
                url = '/api/destinations/add';
            }
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: locationName,
                    summary: locSummary,
                    description: locDescription,
                    region: locRegion,
                    location: locCoordinates,
                    images: filenames,
                    coverIndex: coverImage,
                    categories: categories,
                    status: "Published",
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit destination');
            }else{
                onClose();
            }
            

            // Handle successful submission here
        } catch (error) {
            console.error('Error submitting destination:', error);
        }
    }

    const handleSaveDraft = async () => {
        // Save draft logic here

        if(!locationName){
            setNameError(true);
            setSavable(false);
            return;
        }
        else{
            setNameError(false);
            setSummaryError(false);
            setDescriptionError(false);
            setRegionError(false);
            setCoordinatesError(false);
            setImagesError(false);
            setCategoriesError(false);
            setSavable(true);


            try {
                console.log("Saving draft...");
                let filenames = [];
                if(images.length > 0){
                    const formData = new FormData();
                    let oldImages = []
                    images.forEach(img => {
                        if (img instanceof File) {
                            formData.append("images", img);
                        }else{
                            oldImages.push(img);
                        }
                    });

                    const uploadRes = await fetch("/api/destinations/upload-images", {
                    method: "POST",
                    body: formData,
                    });

                    const uploadData = await uploadRes.json();
                    filenames = uploadData.files ? uploadData.files : []; // array of saved images
                    filenames = [...oldImages, ...filenames];
                }
                let url = ""
                if(editingDes){
                    url = `/api/destinations/update-draft/${editingDes._id}`;
                }else{
                    url = '/api/destinations/save-draft';
                }
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: locationName,
                        summary: locSummary,
                        description: locDescription,
                        region: locRegion,
                        location: locCoordinates,
                        images: filenames,
                        coverIndex: coverImage,
                        categories: categories,
                        status: status,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save draft');
                } else {
                    onClose();
                }
            } catch (error) {
                console.error('Error saving draft:', error);
            }
        }
    }

    const [searchValue, setSearchValue] = useState("");

    const [searchResult, setSearchResult] = useState([]);
    const [showResults, setShowResults] = useState([]);
    const [showLocationList, setShowLocationList] = useState(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const key = process.env.REACT_APP_TOKEN;
    const searchUrl = process.env.REACT_APP_SEARCH_URL;

    // Initialize map once
    useEffect(() => {
    if (!mapRef.current) {
            mapRef.current = L.map("map", {
            center: [7.0, 80.0],
            zoom: 7,
            scrollWheelZoom: true,
            });

            L.tileLayer(
            `https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${key}`,
            {
                attribution:
                '<a href="https://locationiq.com/?ref=maps" target="_blank">© LocationIQ</a> <a href=\"https://openstreetmap.org/about/\" target=\"_blank\">© OpenStreetMap</a>',
                maxZoom: 18,
                id: "streets",
                key: key,
            }
            ).addTo(mapRef.current);
        }
        }, [key]);


    const doSearch = async (e) => {
        e.preventDefault();
        if (!searchValue) {
        alert("Please enter a location to search");
        return;
        }

        try {
        const url = `${searchUrl}key=${key}&q=${encodeURIComponent(searchValue)}&format=json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setSearchResult(data);
        
        formatResults(data);
        } catch (err) {
        console.error("Error during fetch:", err);
        alert("An error occurred while searching. Please try again.");
        }
    };

    useEffect(() => {
    if (searchResult.length > 0) {
        setShowLocationList(true);
    }else {
        setShowLocationList(false);
    }
  }, [searchResult]);

  const formatResults = (results) => {
    const formatted = results.map((loc) => {
      const parts = loc.display_name.split(",");
      return {
        shortName: parts[0],
        fullAddress: loc.display_name,
        lat: parseFloat(loc.lat),
        lon: parseFloat(loc.lon),
      };
    });
    setShowResults(formatted);
  };

  const handleResultClick = (loc) => {
    // Move map to clicked location
    mapRef.current.setView([loc.lat, loc.lon], 13);
    setLocCoordinates({ lat: loc.lat, lon: loc.lon,shortName: loc.shortName, fullAddress: loc.fullAddress });
    setShowLocationList(false);
    setSelectedLocation(loc);

    // Remove previous marker
    if (markerRef.current) markerRef.current.remove();

    // Create a custom icon
    const customIcon = L.icon({
        iconUrl: marker, // replace with your image URL
        iconSize: [30, 30], // adjust size
        iconAnchor: [20, 40], // bottom-center of icon points to the location
        popupAnchor: [0, -40], // popup appears above the marker
    });

    // Add new marker with custom icon
    markerRef.current = L.marker([loc.lat, loc.lon], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(loc.fullAddress)
        .openPopup();
  };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("Selected files:", files);
        if (files.length === 0) return;
        

        // Clean file names (replace spaces with underscores)
        const cleanedFiles = files.map(file => {
            const newFile = new File([file], file.name.replace(/\s+/g, "_"), { type: file.type });
            return newFile;
        });

        // Filter out files that already exist in images array (by name)
        const newFiles = cleanedFiles.filter(
            file => !images.some(img => img.name === file.name)
        );

        // Append new unique files to the existing state
        setImages(prevImages => [...prevImages, ...newFiles]);
    };

    const handleImageRemove = (index) => {
        console.log("Removing image at index:", index);
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        if(index === coverImage){
            setCoverImage(0); // Reset cover image if it was removed
        }
    }
    const removeCategory = (index) => {
        console.log("Removing category at index:", index);
        setCategories(prevCats => prevCats.filter((_, i) => i !== index));
    }
    useEffect(() => {
        if(status){console.log("status :",status);}
    }, [status]);

    return (
        <main className="flex-1 bg-background-light dark:bg-background-dark rounded max-w-5xl max-h-[90vh] overflow-y-auto shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 left-0 z-50 flex flex-wrap justify-between gap-3 bg-background-dark dark:bg-background-light rounded-t p-6 shadow-md">
                <h1 className="text-text-dark dark:text-text-light text-4xl font-black leading-tight tracking-tight">
                    Add New Destination
                </h1>
                </div>
            <div className="mx-auto max-w-4xl p-6 md:p-10 ">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 mb-4">
                {/* <a
                    className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary"
                    href="#"
                >
                    Dashboard
                </a>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
                    /
                </span>
                <a
                    className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary"
                    href="#"
                >
                    Destinations
                </a>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
                    /
                </span>
                <span className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">
                    Add New Destination
                </span> */}
                </div>
                {/* PageHeading */}
                
                {/* Form Container */}
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                {/* Section 1: Basic Information */}
                <div className="rounded bg-white dark:bg-gray-800/50 p-6 shadow-lg">
                    <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-tight mb-6">
                    Basic Information
                    </h3>
                    <div className="flex flex-col gap-6">
                    {/* Destination Name */}
                    <label className="flex flex-col w-full">
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Destination Name
                        </p>
                        <input
                        className="form-input w-full rounded text-text-light dark:text-text-dark border-border-color bg-background-light dark:bg-gray-900 focus:border-primary focus:ring-primary/50 h-12 placeholder:text-gray-400 p-3 text-base font-normal leading-normal"
                        placeholder="e.g., Sigiriya"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        />
                        {nameError && (
                        <span className="text-red-500 text-sm mt-2 italic">This field is required.</span>
                        )}
                    </label>
                    <label className="flex flex-col w-full">
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Destination Summary
                        </p>
                        <input
                        className="form-input w-full rounded text-text-light dark:text-text-dark border-border-color bg-background-light dark:bg-gray-900 focus:border-primary focus:ring-primary/50 h-12 placeholder:text-gray-400 p-3 text-base font-normal leading-normal"
                        placeholder="e.g., Short catchy summary about the destination"
                        value={locSummary}
                        onChange={(e) => setLocSummary(e.target.value)}
                        />
                        {summaryError && (
                        <span className="text-red-500 text-sm mt-2 italic">This field is required.</span>
                        )}
                    </label>
                    {/* Detailed Description */}
                    <label className="flex flex-col w-full">
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Detailed Description
                        </p>
                        <div className="rounded border border-border-color bg-background-light dark:bg-gray-900 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50">
                        <div className="p-2 border-b border-border-color flex items-center gap-2">
                            <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                            <span className="material-symbols-outlined text-base">
                                format_bold
                            </span>
                            </button>
                            <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                            <span className="material-symbols-outlined text-base">
                                format_italic
                            </span>
                            </button>
                            <button type="button" className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                            <span className="material-symbols-outlined text-base">
                                format_list_bulleted
                            </span>
                            </button>
                        </div>
                        <textarea
                            className="form-textarea overflow-y-auto resize-none w-full border-none bg-transparent focus:outline-0 focus:ring-0 text-text-light dark:text-text-dark h-40 placeholder:text-gray-400 p-3 text-base font-normal leading-normal"
                            placeholder="Write a travelogue-style description..."
                            value={locDescription}
                            onChange={(e) => setLocDescription(e.target.value)}
                        />
                        </div>
                        {descriptionError && (
                        <span className="text-red-500 text-sm mt-2 italic">This field is required.</span>
                        )}
                    </label>
                    {/* Location */}
                    <label className="relative text-text-light dark:text-text-dark text-base font-medium leading-normal pb-4">
                        <p className="mb-2">Region</p>
                        
                        <input 
                        type="text"
                        className="form-input w-full rounded text-text-light dark:text-text-dark border-border-color bg-background-light dark:bg-gray-900 focus:border-primary focus:ring-primary/50 h-12 placeholder:text-gray-400 p-3 text-base font-normal leading-normal"
                        placeholder="e.g., Anuradhapura"
                        value={locRegion}
                        onChange={(e) => {setLocRegion(e.target.value); fetchRegionsList()}}
                        
                        />
                        {regionList.length > 0 &&(
                        <div className="absolute top-50 left-0 w-full bg-white shadow p-4 rounded-b z-10">
                            <ul>
                                {filterdRegions.length === 0 && <li className="px-4 py-2 text-gray-500">No regions found.</li>}
                                {filterdRegions.map((region, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                                    onClick={() => {setLocRegion(region);setRegionList([])}}
                                    >{region}</li>
                                ))}
                            </ul>

                        </div>
                        )}
                        {regionError && (
                        <span className="text-red-500 text-sm font-normal mt-2 italic">This field is required.</span>
                        )}
                    </label>
                    <label className="flex flex-col w-full">
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                        Location
                        </p>
                        <div className="flex w-full h-500">
                            <div className="w-full relative">
                                <div className="flex " >
                                <input
                                
                                type="text"
                                className="form-input mb-2 w-full rounded text-text-light dark:text-text-dark border-border-color bg-background-light dark:bg-gray-900 focus:border-primary focus:ring-primary/50 h-12 placeholder:text-gray-400 p-3 text-base font-normal leading-normal"
                                placeholder="e.g., Central Province, Sri Lanka"
                                value={searchValue}
                                // onFocus={() => setShowLocationList(showResults.length > 0)}
                                // onBlur={() => setShowLocationList(false)}
                                onChange={(e) => {setSearchValue(e.target.value);setShowLocationList(showResults.length > 0)}}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        doSearch(e);
                                    }
                                }}
                                />
                                <div className="flex w-14 h-12 items-center justify-center border border-border-color rounded ml-2 cursor-pointer" onClick={doSearch}>
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                </div>
                                {selectedLocation &&
                                <div className="cursor-pointer py-2 border border-border-color rounded p-2">
                                    <div className="w-full flex justify-between">
                                        
                                        <h3 className="font-semibold">{selectedLocation.shortName}</h3>
                                        <span className="material-symbols-outlined text-base text-accent" onClick={() => {setSelectedLocation(null); setLocCoordinates(null)}}>close</span>
                                    </div>
                                    <p className="text-xs">{selectedLocation.fullAddress}</p>
                                </div>
                                }
                                {coordinatesError && (
                                <span className="text-red-500 text-sm mt-2 italic">This field is required.</span>
                                )}
                                {showLocationList && showResults.length > 0 && (
                                    <div className="absolute top-50 left-0 rounded-b z-10 w-[calc(100%-3.5rem)] p-4 bg-background-light dark:bg-gray-800 max-h-96 overflow-y-auto shadow">
                                    
                                    {showResults.map((result, index) => (
                                        <div
                                        key={index}
                                        className="cursor-pointer border-b py-2"
                                        
                                        onClick={() => handleResultClick(result)}
                                        >
                                        <h3 className="font-semibold">{result.shortName}</h3>
                                        <p className="text-xs">{result.fullAddress}</p>
                                        </div>
                                    ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center rounded w-full ml-4 border border-border-color overflow-hidden ">
                                <div id="map" className="w-full h-96 min-h-96 z-0"></div>                            
                            </div>
                        </div>
                    </label>
                    </div>
                </div>
                {/* Section 2: Media Gallery */}
                <div className="rounded bg-white dark:bg-gray-800/50 p-6 shadow-lg">
                    <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-tight">
                    Destination Images
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
                    Upload high-quality images. The first image will be the main cover.
                    </p>
                    {imagesError && (
                    <span className="text-red-500 text-sm font-normal mt-2 italic">This field is required.</span>
                    )}
                    <div className="flex flex-col items-center justify-center rounded border-2 border-dashed border-border-color p-8 text-center bg-background-light dark:bg-gray-900">
                    <span className="material-symbols-outlined text-5xl text-gray-400">
                        cloud_upload
                    </span>
                    <p className="mt-2 text-text-light dark:text-text-dark font-medium">
                        Drag &amp; drop files here
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">or</p>
                    <label htmlFor="file-upload" className="cursor-pointer mt-2 rounded bg-primary/20 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/30">
                        Browse Files
                        <input id="file-upload" type="file" className="sr-only" onChange={handleImageChange} multiple />
                    </label>
                    </div>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                    <div className="relative group aspect-square">
                        <img
                        className="object-cover w-full h-full rounded"
                        data-alt="View of Sigiriya rock fortress from afar"
                        src={
                            img instanceof File
                            ? URL.createObjectURL(img)                        // Frontend new uploads
                            : `/uploads/${img}`   // Backend stored images
                        }
                        alt={`Image ${index + 1}`}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                        <button type="button" className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700">
                            <span className="material-symbols-outlined text-xl"
                            onClick={() => handleImageRemove(index)}
                            >
                            delete
                            </span>
                        </button>
                        </div>
                        {images.length === 1 || coverImage === index && (
                            <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                            Cover
                            </div>
                        )}
                        {images.length > 1 && coverImage !== index && (
                            <button 
                            type="button" 
                            className="absolute top-2 left-2 bg-white/80 text-text-light dark:text-text-dark text-xs font-bold px-2 py-1 rounded hover:bg-white"
                            onClick={() => setCoverImage(index)}
                            >
                            Set as Cover
                            </button>
                        )}
                    </div>
                    ))}
                    
                    </div>
                </div>
                {/* Section 3: Highlights */}
                <div className="rounded bg-white dark:bg-gray-800/50 p-6 shadow-lg">
                    <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-tight">
                    Categories
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-6">
                    Add the the categories the destination can be described with (e.g., Historical,
                    Adventure).
                    <br></br>
                    Type and press Enter to add new.
                    </p>
                    <div className="flex items-end gap-2">
                    <label className="flex flex-col w-full flex-1">
                        {/* <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal pb-2 sr-only">
                        Point of Interest
                        </p> */}
                        
                        <div className="relative form-input w-full flex gap-2 items-center rounded text-text-light dark:text-text-dark border-border-color bg-background-light dark:bg-gray-900 focus:border-primary ring-0 focus:ring-0 placeholder:text-gray-400 p-3 text-base font-normal leading-normal">
                            <div className="flex gap-2 mb-2">
                                {categories.map((category, index) => (
                                <button key={index} type="button"
                                    className="flex gap-1 justify-center items-center p-2 text-accent rounded-md bg-secondary shadow-sm"
                                    
                                    >
                                    <span className="">{category}</span>
                                    <span className="material-symbols-outlined text-base " onClick={() => removeCategory(index)}>
                                        close
                                    </span>
                                </button>
                                ))}
                            </div>
                            <input
                            className="form-input border-none p-0 text-text-light dark:text-text-dark bg-transparent focus:ring-0 focus:outline-0"
                            placeholder="Enter an Category"
                            value={typingCategory}
                            onChange={(e) => {setTypingCategory(e.target.value); fetchCategoriesList()}}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && typingCategory.trim() !== '') {
                                    e.preventDefault();
                                    setCategories([...categories, typingCategory.trim()]);
                                    setTypingCategory('');
                                }
                            }}
                            />
                            
                            {typingCategory !== "" && (
                            <div className="absolute top-14 h-50 overflow-y-auto left-0 w-full bg-white shadow rounded-b z-10">
                                <ul>
                                    {filteredCategories.length === 0 && <li className="px-4 py-2 text-gray-500">No categories found.</li>}
                                    {filteredCategories.map((category, index) => (
                                    
                                    <li key={index} 
                                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700  cursor-pointer"
                                        onClick={() => {
                                            setCategories([...categories, category]);
                                            setTypingCategory('');
                                        }}
                                        >{category}</li>
                                    ))}
                                </ul>
                            </div>
                            )}
                        </div>
                        {categoriesError && (
                            <p className="text-red-500 text-xs italic mt-2">Please add at least one category.</p>
                        )}
                    </label>
                    
                    </div>
                    
                </div>
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-end gap-3 mt-4 pb-10">
                    <button type="button" className="flex cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 bg-transparent text-text-light dark:text-text-dark text-sm font-bold leading-normal hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="truncate">Cancel</span>
                    </button>
                    <button onClick={handleSaveDraft} type="button"  className="flex cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 bg-secondary/80 text-accent text-sm font-bold leading-normal hover:bg-secondary border border-1 border-accent/80 hover:border-accent">
                    <span className="truncate" >Save as Draft</span>
                    </button>
                    <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 bg-accent text-white text-sm font-bold leading-normal hover:bg-accent/90">
                    <span className="truncate">Publish Destination</span>
                    </button>
                </div>
                <div className="w-full flex flex-col items-end">
                    {!publishable && (
                    <span className="text-red-600 text-sm italic">Please fill all fields before publishing</span>
                    )}
                    {!savable && (
                    <span className="text-red-600 text-sm italic">Please input a destination name before saving</span>
                    )}
                </div>
                </form>
            </div>
            </main>

    )
}


function TourBookings () {

    const [bookings, setBookings] = useState([]);
    const [pkgIds, setPkgIds] = useState([]);
    const [customBookings, setCustomBookings] = useState([]);
    const [packages, setPackages] = useState([]);
    const [pkgBookings, setPkgBookings] = useState([]);

    const [filteredCusBookings, setFilteredCusBookings] = useState([]);
    const [filteredPkgBookings, setFilteredPkgBookings] = useState([]);

    const [initializedCus, setInitializedCus] = useState(false);
    const [initializedPkg, setInitializedPkg] = useState(false);

    useEffect(() => {
        if (!initializedCus && bookings && bookings.length > 0) {
            setFilteredCusBookings(bookings.filter(booking => booking.planType === 'custom'));
            setInitializedCus(true);
        }
    }, [bookings, initializedCus]);

    useEffect(() => {
        if(!initializedPkg && bookings && bookings.length > 0) {
            const pkgBks = bookings.filter(booking => booking.planType === 'package');
            setFilteredPkgBookings(pkgBks);
            setInitializedPkg(true);
        }
    }, [bookings, initializedPkg]);

     
    
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/tour-bookings/all-bookings');
                if (response.ok) {
                const data = await response.json();
                setBookings(data.bookings);
                }else{
                console.error('Failed to fetch bookings');
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);
    
    useEffect(() => {
        const pkgBks = bookings.filter(booking => booking.planType === 'package');
        setPkgIds(pkgBks.map(booking => booking.planId));
    }, [bookings]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/tours/get-all');
                if (response.ok) {
                const data = await response.json();
                setPackages(data.tours);
                }else{
                console.error('Failed to fetch packages');
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        const fetchCustomBookings = async () => {
            try {
                const response = await fetch('/api/custom-tours/all-custom-tours');
                if (response.ok) {
                const data = await response.json();
                setCustomBookings(data.customTours);
                }else{
                console.error('Failed to fetch custom bookings');
                }
            } catch (error) {
                console.error('Error fetching custom bookings:', error);
            }
        };
        fetchCustomBookings();
    }, []);

    // useEffect(() => {
    //     console.log("Package IDs:", pkgIds);
    //     console.log("Packages:", packages);
    //     console.log("Custom Bookings:", customBookings);
    //     console.log("All Bookings:", bookings);
    // }, [pkgIds, packages, customBookings, bookings]);

    const findCusTourDetailsForId = (customTourId) => {
        const tour = customBookings.find(tour => tour._id === customTourId);
        return tour ? tour : null;
    }

    const [userNames, setUserNames] = useState({});

    
    useEffect(() => {
        const fetchUserNames = async () => {
            if (!bookings || bookings.length === 0) return;
            const ids = [...new Set(bookings.map(b => b.userId))];

            const map = {};

            await Promise.all(
                ids.map(async (id) => {
                    console.log("Fetching user name for ID:", id._id);
                    try {
                        const res = await fetch(`/api/users/get-user-name-by/${id._id}`);
                        if (res.ok) {
                            const data = await res.json();
                            map[id] = data.userName;
                        } else {
                            map[id] = "Unknown User";
                        }
                    } catch {
                        map[id] = "Unknown User";
                    }
                })
            );

            setUserNames(map);
        };

        if (bookings?.length) fetchUserNames();
    }, [bookings]);


    const getDate = (date) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    const addDays = (date, days) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    // Pagination Cus
    const [pageCus, setPageCus] = useState(1);
    const [pageStartIndexCus, setPageStartIndexCus] = useState(0);
    const [pageEndIndexCus, setPageEndIndexCus] = useState(10);

    useEffect(() => {
        const bookingCus = filteredCusBookings
        if (bookingCus.length > pageCus * 10) {
        setPageStartIndexCus((pageCus - 1) * 10);
        setPageEndIndexCus(pageCus * 10);
        } else if(bookingCus.length === 0){
            setPageStartIndexCus(0);
            setPageEndIndexCus(0);
        }else {
        setPageStartIndexCus((pageCus - 1) * 10);
        setPageEndIndexCus(bookingCus.length);
        }
    }, [bookings, filteredCusBookings, pageCus]);

    const [pagePkg, setPagePkg] = useState(1);
    const [pageStartIndexPkg, setPageStartIndexPkg] = useState(0);
    const [pageEndIndexPkg, setPageEndIndexPkg] = useState(10);

    useEffect(() => {
        const bookingPkg = filteredPkgBookings
        if (bookingPkg.length > pagePkg * 10) {
        setPageStartIndexPkg((pagePkg - 1) * 10);
        setPageEndIndexPkg(pagePkg * 10);
        } else if(bookingPkg.length === 0){
            setPageStartIndexPkg(0);
            setPageEndIndexPkg(0);
        }else {
        setPageStartIndexPkg((pagePkg - 1) * 10);
        setPageEndIndexPkg(bookingPkg.length);
        }
    }, [bookings, filteredPkgBookings, pagePkg]);

    const [searchBookingsCus, setSearchBookingsCus] = useState('');
    const [searchBookingsPkg, setSearchBookingsPkg] = useState('');

    useEffect(() => {
        const filtered = bookings.filter(booking => booking.planType === 'custom' && (userNames[booking.userId] || "Unknown User").toLowerCase().includes(searchBookingsCus.toLowerCase()) || booking._id.toString().toLowerCase().includes(searchBookingsCus.toLowerCase()));
        
        setFilteredCusBookings(filtered);
        setPageCus(1);
    }, [searchBookingsCus, bookings, userNames]);

    useEffect(() => {
        const filtered = bookings.filter(booking => booking.planType === 'package' && (userNames[booking.userId] || "Unknown User").toLowerCase().includes(searchBookingsPkg.toLowerCase()) || booking._id.toString().toLowerCase().includes(searchBookingsPkg.toLowerCase()));
        
        setFilteredPkgBookings(filtered);
        setPagePkg(1);
    }, [searchBookingsPkg, bookings, userNames]);

    

    const getPkgNameById = (id) => {
        const pkg = packages.find(pkg => pkg._id === id);
        return pkg ? pkg.name : "Unknown Package";
    }
    const currActCusBookingRef = useRef(null);
    const currActPkgBookingRef = useRef(null);

    const [currActCusBooking, setCurrActCusBooking] = useState(null);
    const [currActPkgBooking, setCurrActPkgBooking] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (currActCusBookingRef.current && !currActCusBookingRef.current.contains(event.target)) {
                setCurrActCusBooking(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [currActCusBookingRef]);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (currActPkgBookingRef.current && !currActPkgBookingRef.current.contains(event.target)) {
                setCurrActPkgBooking(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [currActPkgBookingRef]);

    const handleCusBkngStsUpdate = (bookingId, newStatus) => {
        try {

            const response = fetch(`/api/tour-bookings/update-booking-status/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                try{
                    let message;
                    switch (newStatus){
                        case "Cancelled":
                            message = `Your tour booking #INQ"${bookingId.slice(-5)}" has been cancelled.`;
                            break;
                        case "Completed":
                            message = `Your tour booking is marked as completed: #INQ"${bookingId.slice(-5)}".Would you like to provide feedback on your experience?`;
                            break;
                        case "Pending":
                            message = `Your booking for the tour #INQ"${bookingId.slice(-5)}" is now pending. Wait for the approval.`;
                            break;
                        case "Approved":
                            message = `Great news! Your booking for the tour #INQ"${bookingId.slice(-5)}" has been approved. Proceed to payment to confirm your spot.`;
                            break;
                        default:
                            message = `Your booking for the tour #INQ"${bookingId.slice(-5)}" status has been updated to "${newStatus}".`;
                    }
                    const resNotifi = fetch('/api/notifications/add-notification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: bookingId, message }),
                    });if (!resNotifi.ok) {
                        console.error('Failed to send notification');
                    }else{
                        console.log('Notification sent successfully');
                    }
                    

                } catch (error) {
                    console.error('Error sending notification:', error);
                }
                const updatedBookings = bookings.map(booking => {
                    if (booking._id === bookingId) {
                        return { ...booking, status: newStatus };
                    }
                    return booking;
                });
                setBookings(updatedBookings);
                setCurrActCusBooking(null);
            } else {
                console.error('Failed to update booking status');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
        }

   }
    const handlePkgBkngStsUpdate = (bookingId, newStatus) => {
        try {
            const response = fetch(`/api/tour-bookings/update-booking-status/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                const updatedBookings = bookings.map(booking => {
                    if (booking._id === bookingId) {
                        return { ...booking, status: newStatus };
                    }
                    return booking;
                });
                setBookings(updatedBookings);
                setCurrActPkgBooking(null);
            } else {
                console.error('Failed to update booking status');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    }


    const [currViewingCusBooking, setCurrViewingCusBooking] = useState(null);
    const [currViewingPkgBooking, setCurrViewingPkgBooking] = useState(null);

    return (
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="text-4xl font-black tracking-tighter text-text-light dark:text-text-dark">
                    Manage Tour Bookings
                </h1>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-primary/90">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span className="truncate">Add New Booking</span>
                </button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
                    <p className="text-base font-medium">Total Bookings</p>
                    <p className="text-2xl font-bold tracking-light">1,250</p>
                    <p className="text-green-600 text-sm font-medium">+15.2%</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
                    <p className="text-base font-medium">Pending Bookings</p>
                    <p className="text-2xl font-bold tracking-light">75</p>
                    <p className="text-orange-500 text-sm font-medium">-2.1%</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
                    <p className="text-base font-medium">Completed Bookings</p>
                    <p className="text-2xl font-bold tracking-light">980</p>
                    <p className="text-green-600 text-sm font-medium">+12%</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
                    <p className="text-base font-medium">Cancelled Bookings</p>
                    <p className="text-2xl font-bold tracking-light">45</p>
                    <p className="text-red-600 text-sm font-medium">+1.5%</p>
                </div>
                </div>
                <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark mb-4">
                    Package Bookings
                </h2>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark ">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1 min-w-[280px]">
                        <label className="flex flex-col h-12 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-text-light/70 dark:text-text-dark/70 flex bg-background-light dark:bg-black/20 items-center justify-center pl-4 rounded-l-lg border border-gray-300 dark:border-gray-600 border-r-0">
                            <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark bg-background-light dark:bg-black/20 focus:outline-0 focus:ring-1 focus:ring-primary h-full placeholder:text-text-light/70 dark:placeholder:text-text-dark/70 px-4 rounded-l-none text-base font-normal leading-normal border border-gray-300 dark:border-gray-600"
                            placeholder="Search package bookings..."
                            value={searchBookingsPkg}
                            onChange={(e) => setSearchBookingsPkg(e.target.value)}
                            />
                        </div>
                        </label>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <select className="form-select rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-black/20 focus:ring-1 focus:ring-primary focus:border-primary">
                        <option>All Packages</option>
                        <option>Adventure Seeker</option>
                        <option>Cultural Explorer</option>
                        <option>Beach Paradise</option>
                        </select>
                        <select className="form-select rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-black/20 focus:ring-1 focus:ring-primary focus:border-primary">
                        <option>Any Status</option>
                        <option>Confirmed</option>
                        <option>Pending</option>
                        <option>Cancelled</option>
                        </select>
                    </div>
                    </div>
                    <div className="">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-text-light/70 dark:text-text-dark/70">
                        <tr>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Booking ID
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Customer Name
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Package Name
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Booking Date
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Status
                            </th>
                            <th className="px-6 py-3 font-medium text-center" scope="col">
                            
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPkgBookings && filteredPkgBookings.length !== 0 && filteredPkgBookings.length !== 0  ? (filteredPkgBookings.slice(pageStartIndexPkg, pageEndIndexPkg).map((booking, index) => (
                            booking.planType === 'package' && (
                                
                        <tr onClick={() => setCurrViewingPkgBooking(booking)} className="cursor-pointer border-b dark:border-gray-700 hover:bg-primary/5">
                            <td className="px-6 py-4 font-medium">#INQ{booking._id.slice(-5)}</td>
                            <td className="px-6 py-4">{userNames[booking.userId] || "Unknown User"}</td>
                            <td className="px-6 py-4">{getPkgNameById(booking?.planId?._id)}</td>
                            <td className="px-6 py-4">{getDate(booking.planDate)}</td>
                            <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                {booking.status}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-center relative">
                            <span onClick={(e) => {setCurrActPkgBooking(currActPkgBooking === index ? null : index); e.stopPropagation();}} className="material-symbols-outlined text-md p-2 rounded-full hover:bg-black/20 text-accent cursor-pointer">
                                more_vert
                            </span>
                            {currActPkgBooking === index && (
                            <div ref={currActPkgBookingRef} className="absolute top-full right-0 z-20 rounded-md bg-white shadow-lg w-max">
                                <ul  >
                                    <li className="flex rounded-t-md justify-start gap-2 items-center px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer"><span className="material-symbols-outlined text-md cursor-pointer">
                                        visibility
                                        </span>
                                        View Details</li>
                                    <li className="flex justify-start gap-2 items-center px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer relative group/item">
                                        <span  className="material-symbols-outlined text-md cursor-pointer">
                                            chevron_left
                                        </span>
                                        Change Status
                                        <div className="absolute top-0 right-[101%] z-20 rounded-md bg-white shadow-lg w-max overflow-hidden group-hover/item:block hidden">
                                            <ul className="">                                                
                                                <li onClick={(e) => {handleCusBkngStsUpdate(booking._id, "Pending"); e.stopPropagation();}} className={`text-start px-6 py-2   ${booking.status !== "Cancelled" || "Completed" ? "cursor-pointer text-accent hover:bg-accent hover:text-secondary" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}>Pending</li>
                                                {/* <li onClick={(e) => {handleCusBkngStsUpdate(booking._id, "On Request"); e.stopPropagation();}} className={`text-start px-6 py-2   ${booking.status !== "Cancelled" || "Completed" ? "cursor-pointer text-accent hover:bg-accent hover:text-secondary" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}>On Request</li> */}
                                                <li onClick={(e) => {handleCusBkngStsUpdate(booking._id, "Approved"); e.stopPropagation();}} className={`text-start px-6 py-2   ${booking.status !== "Cancelled" || "Completed" ? "cursor-pointer text-accent hover:bg-accent hover:text-secondary" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}>Approved</li>
                                                <li onClick={(e) => {handleCusBkngStsUpdate(booking._id, "Completed"); e.stopPropagation();}} className={`text-start px-6 py-2   ${booking.status !== "Cancelled" || "Completed" ? "cursor-pointer text-accent hover:bg-accent hover:text-secondary" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}>Completed</li>
                                                <li onClick={(e) => {handleCusBkngStsUpdate(booking._id, "Cancelled"); e.stopPropagation();}} className={`text-start px-6 py-2   ${booking.status !== "Cancelled" || "Completed" ? "cursor-pointer text-accent hover:bg-accent hover:text-secondary" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}>Cancelled</li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="flex rounded-b-md justify-start gap-2 items-center px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer">
                                        <span className="material-symbols-outlined text-md cursor-pointer">
                                            delete
                                        </span>
                                        Delete
                                    </li>
                                </ul>
                            </div>
                            )}
                            </td>
                        </tr>
                            )))) : (
                            <tr>
                                
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No package bookings found.
                                </td>
                            </tr>
                        )}                        
                        </tbody>
                    </table>
                    </div>
                    {/* Pagination */}
                            <nav
                            aria-label="Table navigation"
                            className="flex items-center justify-between p-4 "
                            >
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Showing{" "}
                                <span className="font-semibold text-text-light dark:text-text-dark">
                                {pageStartIndexPkg + 1} - {pageEndIndexPkg}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-text-light dark:text-text-dark">
                                {filteredPkgBookings.length} Packages
                                </span>
                            </span>
                            <ul className="inline-flex items-center -space-x-px">
                                <li onClick={() => {if(pagePkg > 1) setPagePkg(pagePkg - 1)}}>
                                <a
                                    className="px-3 cursor-pointer py-2 ml-0 leading-tight text-gray-500 bg-card-light border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    
                                >
                                    Previous
                                </a>
                                </li>
                                {Array.from({ length: Math.ceil(filteredPkgBookings.length / 10) }, (_, index) => (
                                <li 
                                    onClick={() => setPagePkg(index + 1)}
                                    key={index}>
                                <a
                                    className={`cursor-pointer px-3 py-2 leading-tight text-gray-500 bg-card-light border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${pagePkg === index + 1 ? "bg-accent text-secondary hover:bg-accent/90 hover:text-white" : ""}`}
                                    
                                >
                                    {index + 1}
                                </a>
                                </li>
                                ))}
                                
                                <li onClick={() => {if(pagePkg < Math.ceil(filteredPkgBookings.length / 10)) setPagePkg(pagePkg + 1)}}>
                                <a
                                    className="px-3 cursor-pointer py-2 leading-tight text-gray-500 bg-card-light border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    
                                >
                        
                                </a>
                                </li>
                            </ul>
                            </nav>
                </div>
                </div>
                <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark mb-4">
                    Custom Tour Bookings
                </h2>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1 min-w-[280px]">
                        <label className="flex flex-col h-12 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-text-light/70 dark:text-text-dark/70 flex bg-background-light dark:bg-black/20 items-center justify-center pl-4 rounded-l-lg border border-gray-300 dark:border-gray-600 border-r-0">
                            <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark bg-background-light dark:bg-black/20 focus:outline-0 focus:ring-1 focus:ring-primary h-full placeholder:text-text-light/70 dark:placeholder:text-text-dark/70 px-4 rounded-l-none text-base font-normal leading-normal border border-gray-300 dark:border-gray-600"
                            placeholder="Search custom tour bookings..."
                            value={searchBookingsCus}
                            onChange={(e) => setSearchBookingsCus(e.target.value)}
                            />
                        </div>
                        </label>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <select className="form-select rounded-lg border-gray-300 dark:border-gray-600 bg-background-light dark:bg-black/20 focus:ring-1 focus:ring-primary focus:border-primary">
                        <option>Any Status</option>
                        <option>Quote Sent</option>
                        <option>Confirmed</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                        </select>
                    </div>
                    </div>
                    <div className="">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-text-light/70 dark:text-text-dark/70">
                        <tr>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Inquiry ID
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Customer Name
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Inquiry Date
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Travel Dates
                            </th>
                            <th className="px-6 py-3 font-medium" scope="col">
                            Status
                            </th>
                            <th className="px-6 py-3 font-medium text-center" scope="col">
                            
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCusBookings !== 0 ? ( filteredCusBookings.slice(pageStartIndexCus, pageEndIndexCus).map((booking, index) => (
                            booking.planType === 'custom' && (
                        <tr onClick={() => setCurrViewingCusBooking(booking)} key={index} className="cursor-pointer border-b dark:border-gray-700 hover:bg-primary/5">
                            <td className="px-6 py-4 font-medium">#INQ{booking._id.slice(-5)}</td>
                            <td className="px-6 py-4">{userNames[booking.userId] || "Loading..."}</td>
                            <td className="px-6 py-4">{getDate(booking.createdAt)}</td>
                            <td className="px-6 py-4">{getDate(booking.planDate)} to {getDate(addDays(booking.planDate, findCusTourDetailsForId(booking.planId._id)?.dailyPlan?.length))}</td>
                            <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                {booking.status}
                            </span>
                            </td>
                            <td className="relative px-6 py-4 text-center">
                            <span onClick={(e) => {setCurrActCusBooking(currActCusBooking === index ? null : index); e.stopPropagation();}} className="material-symbols-outlined text-md p-2 rounded-full hover:bg-black/20 text-accent cursor-pointer">
                                more_vert
                            </span>
                            {currActCusBooking === index && (
                            <div ref={currActCusBookingRef} className="absolute top-full right-0 z-20 rounded-md bg-white shadow-lg w-max ">
                                <ul  >
                                    <li className="flex rounded-t-md justify-start gap-2 items-center px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer"><span className="material-symbols-outlined text-md cursor-pointer">
                                        visibility
                                        </span>
                                        View Details</li>
                                    <li className="flex justify-start gap-2 items-center px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer relative group/item">
                                        <span className="material-symbols-outlined text-md cursor-pointer">
                                            chevron_left
                                        </span>
                                        Change Status
                                        <div className="absolute top-0 right-[105%] z-20 rounded-md bg-white shadow-lg w-max overflow-hidden group-hover/item:block hidden">
                                            <ul className="">
                                                <li onClick={(e) => {handlePkgBkngStsUpdate(booking._id, "Pending"); e.stopPropagation();}} className="text-start px-6 py-2 text-accent hover:bg-accent hover:text-secondary cursor-pointer">Pending</li>
                                                {/* <li onClick={(e) => {handlePkgBkngStsUpdate(booking._id, "On Request"); e.stopPropagation();}} className="text-start px-6 py-2 text-accent hover:bg-accent hover:text-secondary cursor-pointer">On Request</li> */}
                                                <li onClick={(e) => {handlePkgBkngStsUpdate(booking._id, "Approved"); e.stopPropagation();}} className="text-start px-6 py-2 text-accent hover:bg-accent hover:text-secondary cursor-pointer">Approved</li>
                                                <li onClick={(e) => {handlePkgBkngStsUpdate(booking._id, "Completed"); e.stopPropagation();}} className="text-start px-6 py-2 text-accent hover:bg-accent hover:text-secondary cursor-pointer">Completed</li>
                                                <li onClick={(e) => {handlePkgBkngStsUpdate(booking._id, "Cancelled"); e.stopPropagation();}} className="text-start px-6 py-2 text-accent hover:bg-accent hover:text-secondary cursor-pointer">Cancelled</li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="flex rounded-b-md justify-start gap-2 items-center px-4 py-2 hover:bg-accent hover:text-secondary cursor-pointer">
                                        <span className="material-symbols-outlined text-md cursor-pointer">
                                            delete
                                        </span>
                                        Delete
                                    </li>
                                </ul>
                            </div>
                            )}
                            </td>
                        </tr>
                            
                        )))):(
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No custom tour bookings found.
                                </td>
                            </tr>
                        )}
                        
                        </tbody>
                    </table>
                    </div>
                    {/* Pagination */}
                            <nav
                            aria-label="Table navigation"
                            className="flex items-center justify-between p-4 "
                            >
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Showing{" "}
                                <span className="font-semibold text-text-light dark:text-text-dark">
                                {pageStartIndexCus + 1} - {pageEndIndexCus}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-text-light dark:text-text-dark">
                                {filteredCusBookings.length} Bookings
                                </span>
                            </span>
                            <ul className="inline-flex items-center -space-x-px">
                                <li onClick={() => {if(pageCus > 1) setPageCus(pageCus - 1)}}>
                                <a
                                    className="px-3 cursor-pointer py-2 ml-0 leading-tight text-gray-500 bg-card-light border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    
                                >
                                    Previous
                                </a>
                                </li>
                                {Array.from({ length: Math.ceil(filteredCusBookings.length / 10) }, (_, index) => (
                                <li 
                                    onClick={() => setPageCus(index + 1)}
                                    key={index}>
                                <a
                                    className={`cursor-pointer px-3 py-2 leading-tight text-gray-500 bg-card-light border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${pageCus === index + 1 ? "bg-accent text-secondary hover:bg-accent/90 hover:text-white" : ""}`}
                                    
                                >
                                    {index + 1}
                                </a>
                                </li>
                                ))}
                                
                                <li onClick={() => {if(pageCus < Math.ceil(filteredCusBookings.length / 10)) setPageCus(pageCus + 1)}}>
                                <a
                                    className="px-3 cursor-pointer py-2 leading-tight text-gray-500 bg-card-light border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    
                                >
                                    Next
                                </a>
                                </li>
                            </ul>
                            </nav>
                </div>
                </div>
            </div>

            {(currViewingCusBooking || currViewingPkgBooking) && (
            <div onClick={() =>{setCurrViewingCusBooking(null); setCurrViewingPkgBooking(null);}} className="cursor-pointer flex justify-center items-center fixed top-0 left-0 w-screen h-screen z-50 bg-black/10 backdrop-blur-[5px]">
            <div className="min-w-full">{currViewingCusBooking ? (
                <CusTourDetails booking={currViewingCusBooking} isAdmin={true} />
                ) : (
                <CusTourDetails booking={currViewingPkgBooking} isAdmin={true} />
                )}
            </div> 
            </div>
            )}
            </main>

    )
    
}