import React, { use, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

import marker from "./images/marker.png";
import { Header } from "./home";



export default function CustomerDashboard() {
    const [currSection, setCurrSection] = useState('dashboard');

    const switchSection = (section) => {
        setCurrSection(section);
    };
    
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
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
                console.log("Session data:", data);
                if(response.ok){
                    if(data.loggedIn){
                        if(data.user.role === 'admin'){
                            navigate('/admin_dashboard');
                        } else if(data.user.role === 'user'){
                            setUser(data.user);
                        }else{
                            navigate('/login');
                        }
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


    async function handleLogout() {
        try {
            const res = await fetch('/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if(res.ok){
                navigate('/login');
            }else{
                alert("Logout failed");
            }
        } catch (err) {
            console.error("Logout failed", err);
        }
    }

    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Sunday = 0
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Create array of all days in the month including blank spaces for alignment
    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= lastDate; i++) {
        daysArray.push(i);
    }

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    
    const [cusTours, setCusTours] = useState([]);
    const [pkgTours, setPkgTours] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);
    
    
    useEffect(() => {
        if(!user) return;
        const fetchTours = async () => {
            try {
                const response = await fetch(`/api/custom-tours/tours-by-user/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setCusTours(data.customTours);
                } else {
                    console.error("Failed to fetch tours");
                }
            } catch (error) {
                console.error("Error fetching tours:", error);
            }
        };

        fetchTours();
    }, [user]);

   

    useEffect(() => {
        if(!user) return;
        const fetchPackageTours = async () => {
            try {
                const response = await fetch(`/api/tours/get-all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setPkgTours(data.tours);
                } else {
                    console.error("Failed to fetch package tours");
                }
            } catch (error) {
                console.error("Error fetching package tours:", error);
            }
        };

        fetchPackageTours();
    }, [user]);


    const [bookings, setBookings] = useState([]);
    
    useEffect(() => {
        if(!user) return;
        const fetchBookings = async () => {
            try {
                const response = await fetch(`/api/tour-bookings/bookings-by-user/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data.bookings);
                    // Process bookings if needed
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, [user]);

    const isToursOnDate = (day, month, year) => {
        if (!day) return false;
        
        return bookings.some(booking => {
            let lengthOfTour;
            if(booking?.planType === 'custom'){
                const cusTour = cusTours.find(t => t?._id === booking?.planId?._id);
                lengthOfTour = cusTour ? cusTour.dailyPlan.length : 0;
            } else if (booking?.planType === 'package') {
                const pkgTour = pkgTours.find(t => t?._id === booking?.planId?._id);
                lengthOfTour = pkgTour ? pkgTour.dailyPlan.length : 0;
            } else {
                lengthOfTour = 0;
            }

            const bookingDate = new Date(booking.planDate);

            if(bookingDate.getMonth() === month && bookingDate.getFullYear() === year){
                if(bookingDate.getDate() <= day && day <= bookingDate.getDate() + lengthOfTour -1 && booking.status !== "Completed" && booking.status !== "Cancelled" && booking.status !== "Replaced"){
                    return true;
                }
            }    
            
            return false ;
        });
    };


    const isToday = (day, month, year) => {
        const today = new Date();
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    const [toursForDay, setToursForDay] = useState([]);
    useEffect(() => {
        const selected = selectedDate;
        console.log("Selected date changed to:", selected);
        // Filter tours for the selected day
        const toursForDay = bookings.filter(t => {
            const tourDateStr = new Date(t.planDate).toISOString().split("T")[0];
            return tourDateStr === selected && (t.status !== "Completed" && t.status !== "Cancelled" && t.status !== "Replaced");
        });

        setToursForDay(toursForDay);
    }, [selectedDate, bookings]);

    const giveMonthName = (monthIndex) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthIndex];
    };

    const ordinalSuffix = (i) => {
        const j = i % 10, k = i % 100;
        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    };

    const setTourDetails = (booking) => {
                
        const suffix = ordinalSuffix(new Date(booking.planDate).getDate())
        const month = giveMonthName(new Date(booking.planDate).getMonth())
        const year = new Date(booking.planDate).getFullYear()
        return `${suffix} ${month}, ${year}`;
    }

    
    const getBookingStatus = (booking) => {
        if(bookings.length === 0 ||  pkgTours.length === 0 || cusTours.length === 0) return
        return booking.status;
    }

    const getBookingName = (booking) => {
        if(bookings.length === 0 ||  pkgTours.length === 0 || cusTours.length === 0) return
        if(booking?.planType === 'custom'){
            const cusTour = cusTours?.find(t => t?._id === booking?.planId?._id);
            return cusTour ? cusTour.tourName : "Custom Tour";
        }else if(booking?.planType === 'package'){
            const pkgTour = pkgTours?.find(t => t?._id === booking?.planId?._id);
            return pkgTour ? pkgTour.name : "Package Tour";
        }
    }

    const getImageUrlForBooking = (booking) => {
        if(bookings.length === 0 ||  pkgTours.length === 0 || cusTours.length === 0 || destinations.length === 0 || !booking) return
        if(booking?.planType === 'custom'){
            const cusTour = cusTours.find(t => t?._id === booking?.planId?._id);
            const destinationId = cusTour.dailyPlan[0][0]
            const destination = getDestination(destinationId);
            const url = "/uploads/" + (destination ? destination.images[0] : "");
            return url;
            

        }else if(booking?.planType === 'package'){
            const pkgTour = pkgTours?.find(t => t?._id === booking?.planId?._id);
            const destinationId = pkgTour?.destinations[0];
            const destination = getDestination(destinationId);
            const url = "/uploads/" + (destination ? destination.images[0] : "");
            return url;
        }
    }

    const [destinations, setDestinations] = useState([]);

    const getDestination = (destinationId) => {
        return destinations.find(dest => dest._id === destinationId);
    }
        
            
    useEffect(() => {
        const fetchDestinations = async () => {
            try{
                const response = await fetch(`/api/destinations/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDestinations(data.destinations);
            } catch (error) {
                console.error('Error fetching destination:', error);
                return null;
            }
        };
        fetchDestinations();
    }, []);

    const setInitFilteredBookings = () => {
        if(bookings.length === 0) return [];
        const upcomingBookings = bookings.filter(booking => booking.status !== "Completed" && booking.status !== "Cancelled");
        return upcomingBookings;
    }

    const [currentWindow, setCurrentWindow] = useState("upcoming");  
    const [filteredBookings, setFilteredBookings] = useState([setInitFilteredBookings()]);  

    const initBookingsSet = useRef(false);
    
    useEffect(() => {
        if(!initBookingsSet.current && bookings.length > 0){
            setFilteredBookings(setInitFilteredBookings());
            initBookingsSet.current = true;
        }
    }, [bookings]);

    useEffect(() => {
        if(currentWindow === "upcoming"){
            const upcomingBookings = bookings.filter(booking => booking.status === "Pending" || booking.status === "Confirmed" || booking.status === "On Review" || booking.status === "Approved" || booking.status === "Payment Done" || booking.status === "On Request");
            setFilteredBookings(upcomingBookings);
        } else if(currentWindow === "completed"){
            const completedBookings = bookings.filter(booking => booking.status === "Completed");
            
            setFilteredBookings(completedBookings);
        } else if(currentWindow === "cancelled"){
            const cancelledBookings = bookings.filter(booking => booking.status === "Cancelled" || booking.status === "Replaced");
            setFilteredBookings(cancelledBookings);
        }
    }, [currentWindow]);

    const [viewingBooking, setViewingBooking] = useState(null);

    const getBookingDate =(booking) => {
        let lengthOfTour;
        if(booking?.planType === 'custom'){
            const cusTour = cusTours.find(t => t?._id === booking?.planId?._id);
            lengthOfTour = cusTour ? cusTour.dailyPlan.length : 0;
        }else{
            const pkgTour = pkgTours.find(t => t?._id === booking?.planId?._id);
            lengthOfTour = pkgTour ? pkgTour.dailyPlan.length : 0;
        }

        const start = new Date(booking.planDate);

        const end = new Date(booking.planDate);
        end.setDate(start.getDate() + (lengthOfTour - 1));

        const options = { month: 'long', day: 'numeric' };

        const startFormatted = start.toLocaleDateString('en-US', options);
        const endFormatted = end.toLocaleDateString('en-US', options);
        const year = start.getFullYear();

        return `${startFormatted} - ${endFormatted}, ${year}`;


    }


    return (
        <div className="relative bg-background-light dark:bg-background-dark font-display">
            <Header user={user} />
        <div className="relative flex min-h-screen w-full flex-col">
            <div className="flex h-full w-full flex-1">
                {/* Side Navigation Bar */}
                <aside className="flex w-64 h-screen sticky top-0 left-0 flex-col gap-y-6 bg-white dark:bg-[#1f2916] shadow-lg p-4 font-display">
                <div className="flex items-center gap-3">
                    <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    data-alt="User avatar image"
                    style={{
                        backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDEoYnCclEnK6hM1RWCOckqrHC4s99lLK3a9FE2512IeuOajT3BF7Tl4xItutbWADk-uP4QINbkYToFugXF3LJPh-muYnwrfTZVvdctQt0a7rFZNFg2rLMsGoWhNlq03Ndbtn_rbTV5sixQFHhOGBCH44gjPcnjN9Hcwd9FsMQFhw1I1HZo1xd8NnIKLyJqR22nkFHKimUDMZ_7WnT2S_HZeI0_mymeLPzi5V87tGuJ_5Ud0Fju9OZRWsr7DSCvzSxPz-rhhpP18SU")'
                    }}
                    />
                    <div className="flex flex-col">
                    <h1 className="text-[#141811] dark:text-white text-base font-medium leading-normal">
                        Emilia Clarke
                    </h1>
                    <p className="text-[#758863] dark:text-gray-400 text-sm font-normal leading-normal">
                        emilia.c@email.com
                    </p>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    <a
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 rounded  ${currSection === 'dashboard' ? 'font-bold bg-accent text-secondary hover:bg-accent/90' : 'font-medium bg-secondary/20 text-accent dark:bg-primary/30'}`}
                    onClick={() => switchSection('dashboard')}
                    >
                    <span className={`material-symbols-outlined text-2xl ${currSection === 'dashboard' ? 'text-secondary' : 'text-accent '}`}>
                        grid_view
                    </span>
                    <p className="text-sm font-medium leading-normal">Dashboard</p>
                    </a>
                    <a
                    className={`flex  cursor-pointer items-center gap-3 px-3 py-2 rounded  ${currSection === 'settings' ? 'font-bold bg-accent text-secondary hover:bg-accent/90' : 'font-medium bg-secondary/20 text-accent dark:bg-primary/30'}`}
                    onClick={() => switchSection('settings')}
                    >
                    <span className={`material-symbols-outlined text-2xl ${currSection === 'settings' ? 'text-secondary' : 'text-accent '}`}>
                        settings
                    </span>
                    <p className="text-sm font-medium leading-normal">
                        Settings
                    </p>
                    </a>
                    <a
                    className="flex cursor-pointer items-center gap-3 px-3 py-2 rounded hover:bg-primary/10 dark:hover:bg-primary/20"
                    onClick={handleLogout}
                    >
                    <span className="material-symbols-outlined text-[#141811] dark:text-white text-2xl">
                        logout
                    </span>
                    <p className="text-sm font-medium leading-normal">
                        Log out
                    </p>
                    </a>
                    
                </nav>
                </aside>
                {/* Main Content Area */}
                <main className="flex flex-1 flex-col p-8">
                {currSection === 'dashboard' && (
                <div className="flex flex-col gap-8">
                    {/* Page Heading */}
                    <header>
                    <p className="text-[#141811] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                        Welcome back, Emilia!
                    </p>
                    <p className="text-[#758863] dark:text-gray-400 text-base font-normal leading-normal">
                        Here's a look at your upcoming adventures.
                    </p>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* My Bookings Section */}
                        <section>
                        <h2 className="text-[#141811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                            My Bookings
                        </h2>
                        {/* Tabs */}
                        <div>
                            <div className="flex border-b border-[#e0e5dc] dark:border-background-dark/20 gap-8">
                            <a
                                className={`cursor-pointer flex flex-col items-center justify-center border-b-[3px] ${currentWindow === "upcoming" ? "border-b-primary text-primary" : "border-b-transparent text-[#758863] dark:text-gray-400"} pb-[13px] pt-4`}
                                onClick={() => setCurrentWindow("upcoming")}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                                Upcoming
                                </p>
                            </a>
                            <a
                                className={` cursor-pointer flex flex-col items-center justify-center border-b-[3px] ${currentWindow === "completed" ? "border-b-primary text-primary" : "border-b-transparent text-[#758863] dark:text-gray-400"} pb-[13px] pt-4`}
                                onClick={() => setCurrentWindow("completed")}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                                Completed
                                </p>
                            </a>
                            <a
                                className={` cursor-pointer flex flex-col items-center justify-center border-b-[3px] ${currentWindow === "cancelled" ? "border-b-primary text-primary" : "border-b-transparent text-[#758863] dark:text-gray-400"} pb-[13px] pt-4`}
                                onClick={() => setCurrentWindow("cancelled")}
                            >
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                                Cancelled
                                </p>
                            </a>
                            </div>
                        </div>
                        {/* Booking Cards */}
                        <div className="flex flex-col gap-4 mt-6">
                            {filteredBookings.length !== 0 ? (filteredBookings.map((b, index) => (
                            <div key={index} className="relative flex flex-col sm:flex-row items-stretch justify-between gap-4 rounded bg-white dark:bg-[#1f2916] p-4 shadow-sm">
                                <div className="absolute top-6 left-6 z-10 rounded px-2 py-1 bg-secondary text-accent text-xs font-medium leading-normal">                                    
                                    {getBookingStatus(b)}
                                </div>
                            <div
                                className="w-full sm:w-1/3 bg-center bg-no-repeat aspect-video sm:aspect-square bg-cover rounded flex-1"
                                data-alt="Lush green tea plantations in Ella, Sri Lanka"
                                style={{
                                backgroundImage:
                                    `url("${getImageUrlForBooking(b)}")`,
                                }}
                            />
                            <div className="flex flex-[2_2_0px] flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                <p className="text-[#141811] dark:text-white text-base font-bold leading-tight">
                                    {getBookingName(b)}
                                </p>
                                <p className="text-[#758863] dark:text-gray-400 text-sm font-normal leading-normal">
                                    {getBookingDate(b)}
                                </p>
                                </div>
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-8 px-4 bg-primary text-white text-sm font-medium leading-normal w-fit hover:bg-primary/90"
                                    onClick={() => setViewingBooking(b)}>
                                <span className="truncate">View Details</span>
                                </button>
                            </div>
                            </div>
                            ))) : (
                            <p className="text-gray-500 dark:text-gray-400">No bookings found in this category.</p> 
                            )}
                            
                        </div>
                        </section>
                    </div>
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        {/* Calendar Section */}
                        <div className="flex items-center justify-center py-8 px-4">
                            <div className="max-w-sm w-full shadow-lg rounded-lg overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800">
                                <button onClick={handlePrevMonth} className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">
                                    ◀
                                </button>
                                <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                    {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                                </div>
                                <button onClick={handleNextMonth} className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">
                                    ▶
                                </button>
                                </div>

                                {/* Weekdays */}
                                <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-700 text-center py-2">
                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                                    <div key={d} className="text-gray-600 dark:text-gray-300 font-medium">
                                    {d}
                                    </div>
                                ))}
                                </div>

                                {/* Days */}
                                <div className="grid grid-cols-7 gap-1 p-2 bg-white dark:bg-gray-800">
                                {daysArray.map((day, idx) => {
                                    

                                    return (
                                    <div 
                                        onClick={() => setSelectedDate(new Date(year, month, day + 1).toISOString().split("T")[0])}
                                        key={idx} className="flex flex-col items-center min-h-[60px] p-1 cursor-pointer">
                                        {day && (
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full  ${selectedDate === new Date(year, month, day + 1).toISOString().split("T")[0] ? "bg-accent text-white hover:bg-accent/80 " : isToday(day, month, year)  ? "bg-primary/50" : "bg-transparent text-gray-800 hover:bg-secondary "} `}>
                                            <span className="text-sm font-medium dark:text-gray-100">{day}</span>
                                        </div>
                                        )}
                                        {/* Render event dots */}
                                        <div className="flex flex-col mt-1 space-y-1">
                                            { isToursOnDate(day + 1 , month, year) &&
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent mx-auto"></div>
                                            }
                                        </div>
                                    </div>
                                    );
                                })}
                                </div>

                                {/* Event details for selected day */}
                                <div className="p-5 bg-gray-50 dark:bg-gray-700">
                                {toursForDay.length > 0 ? (
                                    toursForDay.map((b, index) => (
                                        <div key={index} className="mb-4">
                                            <p className="font-medium text-lg text-gray-800 dark:text-gray-100">
                                                    {getBookingName(b)}                                                    
                                                </p>
                                            

                                            <div className="border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                                    {setTourDetails(b)}
                                                </p>
                                                <p className="font-medium text-xs text-gray-500 dark:text-gray-300 mb-1">
                                                    Status: {getBookingStatus(b)}                                                
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        No tours booked for this date.
                                    </p>
                                )}
                                </div>
                            </div>
                            </div>
                    </div>
                    </div>
                </div>
                )}
                {currSection === 'settings' && <Settings user={user} setUser={setUser} />}
                </main>
            </div>
        </div>
        {viewingBooking && (
        <div
            
            className="fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] backdrop-blur-[5px] z-10"></div>
        )}
        {viewingBooking && (
        <div onClick={() => setViewingBooking(null)} className="fixed top-0 left-0 w-screen h-screen z-20">
            <CusTourDetails booking={viewingBooking} isAdmin={false} />
        </div>
        )}
        </div>                        
    );
}

export function CusTourDetails({booking, isAdmin}){
    const navigate = useNavigate();
    const [cusTour, setCusTour] = useState(null);
    const [pkgTour, setPkgTour] = useState(null);
    
    useEffect(() => {
        const fetchTourDetails = async () => {
        try{
            const response = await fetch(`/api/custom-tours/tour-by/${booking.planId._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                if(data.customTour)
                {setCusTour(data.customTour);}
                else{
                    console.error("Custom tour not found");
                    setCusTour(null);
                }
            } else {
                console.error("Failed to fetch tour details");
            }
        } catch (error) {
            console.error('Error fetching tour details:', error);
        }
    };
        fetchTourDetails();
    }, [booking]);

    useEffect(() => {
        const fetchTourDetails = async () => {
        try{
            const response = await fetch(`/api/tours/get-tour-by/${booking.planId._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                if(data.tour)
                {setPkgTour(data.tour);}
                else{
                    console.error("Package tour not found");
                    setPkgTour(null);
                }
            } else {
                console.error("Failed to fetch tour details");
            }
        } catch (error) {
            console.error('Error fetching tour details:', error);
        }
    };
        fetchTourDetails();
    }, [booking]);

    const setTourDetails = (booking) => {        
            
            const suffix = ordinalSuffix(new Date(booking.planDate).getDate())
            const month = giveMonthName(new Date(booking.planDate).getMonth())
            const year = new Date(booking.planDate).getFullYear()
            return `${suffix} ${month}, ${year}`; 
        
    }

    const giveMonthName = (monthIndex) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthIndex];
    };

    const ordinalSuffix = (i) => {
        const j = i % 10, k = i % 100;
        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    };

    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try{
                const response = await fetch(`/api/destinations/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDestinations(data.destinations);
                } else {
                    console.error("Failed to fetch destinations");
                }
            } catch (error) {
                console.error('Error fetching destinations:', error);
            }
        };

        fetchDestinations();
    }, []);

    const getDesName = (destinationId) => {
        const destination = destinations.find(dest => dest._id === destinationId);
        return destination ? destination.name : "Unknown Destination";
    }


    //map 
    const mapRef = useRef(null);
    const key = process.env.REACT_APP_TOKEN;
    
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


    const [locations, setLocations] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);

    
    useEffect(() => {
            if (!cusTour || destinations.length === 0 ) return;
            const locs = [];
           cusTour.dailyPlan.forEach((day) => {
                day.forEach((activity) => {
                    const destination = destinations.find(dest => dest._id === activity);
                    if (destination.location && destination.location.lat && destination.location.lon) {
                        locs.push({
                            name: destination.name,
                            lat: destination.location.lat,
                            lon: destination.location.lon,
                        });
                    }
                });
            });
            
            setLocations(locs);
            
        }, [cusTour, destinations]);

    useEffect(() => {
        if (!pkgTour || destinations.length === 0 ) return;
        const locs = [];
        pkgTour.destinations.forEach((destId) => {
            const destination = destinations.find(dest => dest._id === destId._id);
            if (destination && destination.location && destination.location.lat && destination.location.lon) {
                locs.push({
                    name: destination.name,
                    lat: destination.location.lat,
                    lon: destination.location.lon,
                });
            }
        });
        
        setLocations(locs);
    }, [pkgTour, destinations]);

    useEffect(() => {
        console.log("Locations state changed:", locations);
    }, [locations]);

    const directionsLoaded = useRef(false);

    useEffect(() => {
        if(!directionsLoaded.current){
            if(locations.length === 0 ) return;
            // getDirections();
            directionsLoaded.current = true;
        }
    }, [locations]);

    const getDirections = async () => {
        if (!locations.length) return;
        console.log("Fetching directions for locations:", locations);

        let coords = locations
            .map((d) => `${d.lon},${d.lat}`)
            .join(";");

        try {
            const res = await fetch(
                `https://api.locationiq.com/v1/directions/driving/${coords}?key=${key}&geometries=geojson`,
                {
                    method: "GET",
                    headers: { accept: "application/json" },
                }
            );

            const data = await res.json();
            console.log("Directions API:", data);

            if (!data || !data.routes || data.routes.length === 0) {
                console.error("No route found", data);
                return;
            }

            // Extract geometry
            const geometry = data.routes[0].geometry;
            const routeCoords = geometry.coordinates.map((c) => [c[1], c[0]]); // lat, lon

            // CLEAR old overlays (OPTIONAL)
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                    mapRef.current.removeLayer(layer);
                }
            });

            // 🔥 CUSTOM ICON FOR DESTINATIONS
            const customIcon = L.icon({
                iconUrl: marker, // your marker image import
                iconSize: [32, 32],
                iconAnchor: [16, 32], // bottom middle
                popupAnchor: [0, -32],
            });

            // Add markers
            locations.forEach((d) => {
                L.marker([d.lat, d.lon], { icon: customIcon })
                    .addTo(mapRef.current)
                    .bindPopup(`<b>${d.name}</b>`);
            });

            // Draw route
            const routePath = L.polyline(routeCoords, {
                color: "blue",
                weight: 4,
            }).addTo(mapRef.current);

            mapRef.current.fitBounds(routePath.getBounds());

            // Distance + time
            const distanceKm = (data.routes[0].distance / 1000).toFixed(2);
            const durationMin = (data.routes[0].duration / 60).toFixed(2);

            setDistance(distanceKm);
            setDuration(durationMin);

            console.log("🚗 Road distance:", distanceKm, "km");
            console.log("⏱ Travel time:", durationMin, "min");

        } catch (err) {
            console.error("Directions error:", err);
        }
    };

    const [showReqChanges, setShowReqChanges] = useState(false);  

    const reqChangeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                reqChangeRef.current &&
                !reqChangeRef.current.contains(event.target)
            ) {
                setShowReqChanges(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const [typingChangeRequest, setTypingChangeRequest] = useState("");
    const [changeRequests, setChangeRequests] = useState(booking.changeRequests || []);

    useEffect(() => {
        setChangeRequests(booking.changeRequests || []);
    }, [booking]);
    
    const addRequestToList = () => {
        if(typingChangeRequest.trim() === "") return;
        const newRequest = {
            details: typingChangeRequest,
            responded: false
        }
        const updatedRequests = [...changeRequests, newRequest];

        setChangeRequests(updatedRequests);
        setTypingChangeRequest("");
    }

    const makeSpecialRequests =  async () => {

        if(!changeRequests) return;

        try{
            const response = await fetch(`/api/tour-bookings/update-change-request/${booking._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    changeRequests: changeRequests,
                    status: "On Request"
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else{
                try{
                    const resNotifi = await fetch(`/api/notifications/add-notification`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: booking.userId,
                            type: 'tour booking',
                            message: `Your booking for the custom tour "${cusTour ? cusTour.tourName : pkgTour ? pkgTour.name : ''}" has been updated with new change requests.`,
                            date: new Date(),
                        }),
                    });
                    
                    if(resNotifi.ok){
                        
                        console.log('Notification sent successfully');
                    }
                    const resAdminNotifi = await fetch(`/api/notifications/add-notification`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: null, // or the actual admin user ID
                            type: 'tour booking',
                            message: `A booking for the custom tour #INQ"${booking._id}" has been updated with new change requests.`,
                            date: new Date(),
                            forAdmin: true
                        }),
                    });
                    if(resAdminNotifi.ok){
                        console.log('Admin notification sent successfully');
                    }else{
                        console.error('Error sending admin notification');
                    }
                } catch (error) {
                    console.error('Error sending notification:', error);
                }
                setShowReqChanges(false)
            }
        } catch (error) {
            console.error('Error updating change requests:', error);            
        }
    }

    const removeReq = (index) => {
        const updatedRequests = changeRequests.filter((_, i) => i !== index);
        setChangeRequests(updatedRequests);
    }

    const [cancellable, setCancellable] = useState(true);

    useEffect(() => {
        if(!booking) return;
        if(isAdmin && (booking.status !== "Approved" && booking.status !== "Pending" && booking.status !== "On Review" && booking.status !== "Payment Done" && booking.status !== "On Request")){
            setCancellable(false);
            return;
        }if(!isAdmin && (booking.status !== "Pending" && booking.status !== "On Review" && booking.status !== "Payment Done" && booking.status !== "On Request")){
            setCancellable(false);
            return;
        }
    }, [booking, isAdmin]);

    const handleStatusChange = async (newStatus) => {
        try{
            const response = await fetch(`/api/tour-bookings/update-booking-status/${booking._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status: newStatus}),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else{
                try{
                    let message;
                    switch (newStatus){
                        case "Cancelled":
                            message = `Your booking for the custom tour "${cusTour ? cusTour.tourName : pkgTour ? pkgTour.name : ''}" has been cancelled.`;
                            break;
                        case "Replaced":
                            message = `Your booking for the tour "${pkgTour ? pkgTour.name : ''}" has been replaced to a Custom Tour.`;
                            break;
                        case "Pending":
                            message = `Your booking for the custom tour "${cusTour ? cusTour.tourName : pkgTour ? pkgTour.name : ''}" is now pending. Wait for the approval.`;
                            break;
                        case "Approved":
                            message = `Great news! Your booking for the custom tour "${cusTour ? cusTour.tourName : pkgTour ? pkgTour.name : ''}" has been approved. Proceed to payment to confirm your spot.`;
                            break;
                        default:
                            message = `Your booking for the custom tour "${cusTour ? cusTour.tourName : pkgTour ? pkgTour.name : ''}" status has been updated to "${newStatus}".`;
                    }
                    const resNotifi = await fetch(`/api/notifications/add-notification`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: booking.userId,
                            type: 'tour booking',
                            message: message,
                            date: new Date(),
                        }),
                    });
                    if(resNotifi.ok){
                        console.log('Notification sent successfully');
                    }
                    try{
                        const resAdminNotifi = await fetch(`/api/notifications/add-notification`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: null, // or the actual admin user ID
                                type: 'tour booking',
                                message: `A booking for the custom tour #INQ"${booking._id}" has been updated with new change requests.`,
                                date: new Date(),
                                forAdmin: true
                            }),
                        });
                        if(resAdminNotifi.ok){
                            console.log('Admin notification sent successfully');
                        }else{
                            console.error('Error sending admin notification');
                        }
                    } catch (error) {
                        console.error('Error sending notification:', error);
                    }
                } catch (error) {
                    console.error('Error sending notification:', error);
                }
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    }

    const handlePayNow = () => {
        if(booking.status === "On Review") handleStatusChange("Pending");
        navigate(`/payment_portal?bid=${booking._id}`);
    }

    const [showAddReview, setShowAddReview] = useState(false);
    const addReviewRef = useRef(null);
    useEffect(() => {
        if(booking && booking.status === "Completed" && !booking.reviewAdded){ 
            console.log("Booking completed, showing review option.");
            setShowAddReview(true);
        }
    }, [booking]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (addReviewRef.current &&!addReviewRef.current.contains(event.target)) {
                setShowAddReview(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const [showAddFeedback, setShowAddFeedback] = useState(false);


    const addReview = async () => {

        if(rating === 0) return;
        try{
            const response = await fetch(`/api/reviews/add-review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: booking.userId,
                    bookingId: booking._id,
                    planId: booking.planId._id,
                    refModel: cusTour ? "CustomTour" : "Tour",
                    planType: cusTour ? "custome" : "package",
                    rating: rating,
                    reviewText: reviewText,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }else{
                console.log('Review added successfully');
                try{
                    const resReview = await fetch(`/api/tour-bookings/mark-review-added/${booking._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({reviewAdded: true}),
                    });if(resReview.ok){
                        setShowAddReview(false);
                        console.log('Marked review as added for booking');
                    }else{
                        console.error('Error marking review as added for booking');
                    }
                }catch(error){
                    console.error('Error marking review as added:', error);
                }
                
            }
            setShowAddReview(false);
        } catch (error) {
            console.error('Error adding review:', error);
        }
    }

    return (
        <div className="flex h-full min-w-full justify-center items-center ">           
                
                {/* Modal Content */}
                <div className="relative w-full max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row"  onClick={(e) => e.stopPropagation()}>
                {/* Left Column: Details */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col h-[90vh] overflow-y-auto">
                    <div className="flex-shrink-0">
                    {/* Close Button */}
                    <button className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    {/* PageHeading */}
                    <div className="flex flex-wrap justify-between gap-3 mb-4">
                        <p className="text-[#141811] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                            {cusTour ? cusTour.tourName : pkgTour ? pkgTour.name : ''}
                        </p>
                    </div>
                    {/* Stats */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
                        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-4 sm:p-6 border border-[#e0e5dc] dark:border-zinc-700">
                        <p className="text-[#758863] dark:text-zinc-400 text-sm font-medium leading-normal">
                            Travelers
                        </p>
                        <p className="text-[#141811] dark:text-white tracking-light text-xl sm:text-2xl font-bold leading-tight">
                            {booking ? booking.groupSize : ''}
                        </p>
                        </div>
                        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-4 sm:p-6 border border-[#e0e5dc] dark:border-zinc-700">
                        <p className="text-[#758863] dark:text-zinc-400 text-sm font-medium leading-normal">
                            Start Date
                        </p>
                        <p className="text-[#141811] dark:text-white tracking-light text-xl sm:text-2xl font-bold leading-tight">
                            {booking ? setTourDetails(booking) : ''}
                        </p>
                        </div>
                        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-4 sm:p-6 border border-[#e0e5dc] dark:border-zinc-700">
                        <p className="text-[#758863] dark:text-zinc-400 text-sm font-medium leading-normal">
                            Duration
                        </p>
                        <p className="text-[#141811] dark:text-white tracking-light text-xl sm:text-2xl font-bold leading-tight">
                            {cusTour ? cusTour.dailyPlan.length + ' Days' : pkgTour ? pkgTour.dailyPlan.length + ' Days' : ''}
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2">
                    {/* SectionHeader: Daily Itinerary */}
                    <h2 className="text-[#141811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pt-5 pb-3">
                        Daily Itinerary
                    </h2>
                    {/* Accordions */}
                    <div className="flex flex-col">
                        {cusTour && cusTour.dailyPlan.map((dayPlan, index) => (
                        <div
                        className="flex flex-col border-t border-t-[#e0e5dc] dark:border-zinc-700 py-2 group"
                        key={index}>
                        <div className="flex cursor-pointer items-center justify-between gap-6 py-2">
                            <p className="text-[#141811] dark:text-zinc-100 text-sm font-medium leading-normal">
                            Day {index + 1}: {
                                dayPlan.map((destId, destIndex) => (
                                    getDesName(destId) + (destIndex < dayPlan.length - 1 ? ' & ' : '')
                                ))}
                            </p>
                            <div className="text-[#141811] dark:text-zinc-300 group-open:rotate-180 transition-transform">
                            </div>
                        </div>
                        
                        </div>
                        ))}
                        { pkgTour && pkgTour.dailyPlan.map((dayPlan, index) => (
                            <div
                                className="flex flex-col border-t border-t-[#e0e5dc] dark:border-zinc-700 py-2 group"
                                key={index}>
                                <div className="flex cursor-pointer items-center justify-between gap-6 py-2">
                                    <p className="flex flex-col text-[#141811] dark:text-zinc-100 text-sm font-medium leading-normal">
                                    Day {index + 1}:
                                        <span>{dayPlan.actTitle}</span>
                                        <span className="text-xs text-accent">{dayPlan.actDescription}</span>
                                    </p>
                                    <div className="text-[#141811] dark:text-zinc-300 group-open:rotate-180 transition-transform">
                                    </div>
                                </div>
                            
                            </div>
                        ))}                       
                                               
                    </div>
                    {/* SectionHeader: Special Requests */}
                    <h2 className="text-[#141811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pt-8 pb-3">
                        Change Requests
                    </h2>
                    <div className="text-sm text-[#758863] dark:text-zinc-400 space-y-2 border border-[#e0e5dc] dark:border-zinc-700 rounded-lg p-4">
                        <p>
                            {booking && booking.changeRequests ? (booking.changeRequests.map((req, index) => (
                                <span key={index}>{req.details}-{req.responded ? 'Responded' : 'Pending'}</span>
                            ))) : 'No Change requests made.'}
                        </p>
                    </div>
                    
                    </div>
                        {isAdmin === false && booking && booking.status === "On Review" &&
                            <button onClick={() => handleStatusChange("Pending")} className="text-sm bg-accent px-4 py-2 rounded text-secondary mt-4 hover:bg-accent/80">Accept Booking</button>
                        }{isAdmin === true &&
                            <button onClick={() => handleStatusChange("Approved")} className={`text-sm  px-4 py-2 rounded  mt-4 ${booking.status === "Pending"? 'bg-accent text-secondary hover:bg-accent/90' : 'bg-gray-200 text-bray-500 cursor-not-allowed'}`} disabled={(booking.status !== "Pending")} >Approve Booking</button>
                        }
                    <div className="flex-shrink-0 mt-8 pt-6 border-t border-[#e0e5dc] dark:border-zinc-700 flex flex-col sm:flex-row gap-4">
                       
                    <button onClick={() => handleStatusChange("Cancelled")} className={`flex-1 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-bold ${!cancellable ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-white bg-accent hover:bg-accent/90 transition-colors '}`} disabled={!cancellable}>
                        Cancel Plan
                    </button>
                    {isAdmin === true ? (
                    <button onClick={() =>{
                        {/* eslint-disable-next-line no-restricted-globals */}
                        const result = confirm('Do you want to place a custom booking?');

                        if (result) {
                            window.open(
                                `/custom_tour?bid=${booking._id}&admin=true&user=${booking.userId._id}`,
                                "_blank" // opens in new tab/window
                            );
                        }
                    }} className={`flex-1 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-bold  ${booking && booking.status !== "Cancelled" && booking.status !== "Replaced" && booking.status !== "Payment Done" ? 'text-accent bg-gray-200 hover:bg-gray-300 transition-colors border border-2 border-accent/30' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        disabled={!(booking && booking.status !== "Cancelled" && booking.status !== "Completed" && booking.status !== "Replaced" && booking.status !== "Payment Done")}>
                        Make Changes
                    </button>
                    ) : (
                    <button onClick={() => setShowReqChanges(true)} className={`flex-1 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-bold text-[#141811] dark:text-zinc-200 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${booking && booking.status !== "Cancelled" && booking.status !== "Replaced" && booking.status !== "Completed" && booking.status !== "Payment Done" ? '' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        disabled={!(booking && booking.status !== "Cancelled" && booking.status !== "Completed" && booking.status !== "Replaced" && booking.status !== "Payment Done")}>
                        Request Changes
                    </button>
                    )}
                    </div>
                    {isAdmin === false && booking && booking.status !== "Payment Done" && booking.status !== "Cancelled" && booking.status !== "Completed" && booking.status !== "Replaced" &&
                    <button onClick={() => handlePayNow()} className="mt-4 text-sm text-secondary bg-accent px-4 py-2 rounded hover:bg-accent/80">
                        Pay Now
                    </button>
                    }
                    
                </div>
                {/* Right Column: Map */}
                <div className="w-full md:w-1/2 relative min-h-[300px] md:h-auto">
                    <div id="map"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    >
                    </div>
                    <div className="z-20 absolute bottom-6 left-6 right-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-zinc-700/50 shadow-lg">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2">
                        Trip Summary
                    </h3>
                    <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-300">
                        <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                            directions_car
                        </span>
                        <span>Est. Distance</span>
                        </div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                        {distance} km
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-300 mt-2">
                        <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                            schedule
                        </span>
                        <span>Est. Drive Time</span>
                        </div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                        {duration} hours
                        </span>
                    </div>
                    </div>
                </div>
                {showReqChanges &&
                <div ref={reqChangeRef} className="absolute flex flex-col justify-start top-1/2 left-1/2 w-1/2 z-20 h-1/2 overflow-y-auto bg-white shadow-2xl rounded-lg p-10 transform -translate-x-1/2 -translate-y-1/2">
                        <h2 className="text-xl font-bold mb-4">Please Enter the changes you prefer</h2>
                        <input
                            value={typingChangeRequest}
                            onChange={(e) => setTypingChangeRequest(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    e.preventDefault();
                                    addRequestToList();
                                }
                            }}
                            type="text" className="w-full ring-0 border border-[rgba(0,0,0,0.1)] rounded focus:ring-0 outline-none focus:border-[rgba(0,0,0,0.2)] " />
                        <ul className="mt-4 ">{changeRequests.map((request, index) => (
                            <li key={index} className="mb-2 flex items-center">{request.details}<span className="text-sm text-gray-500"> - {request.responded ? "Responded" : "Pending"}</span><span onClick={() => removeReq(index)} className="material-symbols-outlined text-center text-sm ml-1 text-red-400 cursor-pointer">close</span></li>
                        ))}</ul>
                        <div className="w-full flex justify-end mt-4">
                            <button onClick={() =>makeSpecialRequests() } className="bg-accent text-white px-6 py-2 rounded ml-2">Send</button>
                        </div>
                </div>
                }{showAddReview &&
                    <div ref={addReviewRef} className="absolute flex flex-col justify-start top-1/2 left-1/2 w-1/2 z-20 overflow-y-auto bg-white shadow-2xl rounded-lg p-10 transform -translate-x-1/2 -translate-y-1/2">
                        <h2 className="text-xl font-bold mb-4 text-center">Would you like to add a review?</h2>
                        <div className="w-full flex justify-center items-center mt-2 ">
                            This Tour is <span className={`ml-1 font-bold ${booking.status === "Cancelled" ? 'text-red-500' : booking.status === "Completed" ? 'text-primary' : 'text-blue-500'}`}>{booking.status}</span>
                        </div>
                        <div>
                            <h2 className="text-center mt-4">How Would You Rate Your Experience of the trip?</h2>
                            <div className="flex gap-3 justify-center mt-4">
                            {Array.from({ length: 5 }, (_, i) => (
                            <i onClick={() => setRating(i + 1)} className={`fa fa-star text-4xl cursor-pointer ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}></i>
                            ))}
                            
                            </div>
                            <div className="flex flex-col mt-4 gap-4 justify-center items-center">
                                <button onClick={() => setShowAddFeedback(true)} className="py-2 rounded w-3/4 border border-accent/20" >Write a Review</button>

                                {showAddFeedback &&
                                    <div className="mt-4">
                                        <h2 className="text-center mb-2">Please provide your feedback:</h2>
                                        <textarea
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            className="border border-accent/10 outline-none focus:outline-none focus:border-accent/10 ring-0 focus:ring-0 rounded border-2 w-96 resize-none h-40 text-sm"
                                        />
                                        <div className="w-full flex justify-end mt-2">
                                            
                                        </div>
                                    </div>
                                }
                                <button onClick={() => addReview()} className="bg-accent py-2 rounded w-3/4 text-white">Submit</button>

                            </div>

                        </div>
                    </div>  

                }
                </div>
            </div>
    )
}

function Settings({user, setUser}) {
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [profilePic, setProfilePic] = useState("")
    const [profilePicFile, setProfilePicFile] = useState(null);
    
    const [oldPassword,setOldPassword] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    
    const [passwordError, setPasswordError] = useState(false)
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const [cards, setCards] = useState([])

    

    useEffect(() =>{
        if(user){
            setUserName(user.userName)
            setEmail(user.email)
            setProfilePic(user.profileImg || "");
            setCards(user.cardDetails || []);
            setInvoiceOption(
                user && user.invoiceMail && user.invoiceMail !== "" ? "custom" : "existing"
            );
        }
        
    }, [user])

    
    

    const handleAccountDetailsChange = async () =>{
        try{
            const formData = new FormData();
            formData.append("image", profilePicFile); // raw File from <input type="file">

            const responseImg = await fetch("/api/users/upload-image", {
              method: "POST",
              body: formData,
            });

            if(responseImg.ok){
                const dataImg = await responseImg.json();
                setProfilePic(dataImg.file);
                try {
                  const response = await fetch(
                    `/api/users/update-account/${user._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userName: userName,
                        email: email,
                        profileImg: dataImg.file,
                      }),
                    }
                  );
                  if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                  } else {
                    console.error("Failed to update account details");
                  }
                } catch (error) {
                  console.error("Error updating account details:", error);
                }
            }else{
                console.error("Failed to upload profile picture");
            }
        }catch(error){
            console.error("Error uploading profile picture:", error);
        }
        
    }

    const handleUpdatePassword = async () =>{
        
        if(newPassword.length < 8){
            setPasswordError(true);
            return;
        }
        if(newPassword !== confirmPassword){
            setConfirmPasswordError(true);

            return;
        }
        try{
            const response = await fetch(`/api/users/update-password/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            })
            if(response.ok){
                alert("Password updated successfully");
                const data = await response.json();
                if(data.message === 'Old password is incorrect'){
                    alert("Incorrect old password");
                    setOldPasswordError(true);
                }
            }else{
                alert("Failed to update password");
            }
        }catch(error){
            console.error("Error updating password:", error);

        }
    }

    const [addingNewCard, setAddingNewCard] = useState(false);

    const [nameOnCard, setNameOnCard] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [cvv, setCvv] = useState("")

    const [cardError, setCardError] = useState(false)
    const [cardNumberError, setCardNumberError] = useState(false)
    const [expiryDateError, setExpiryDateError] = useState(false)
    const [cvvError, setCvvError] = useState(false)

    const handleAddCard = () =>{
        // Implement adding card functionality here
        setAddingNewCard(true);
    }
    
    const handleSaveCardDetails = async () => {
        if(!nameOnCard && !cardNumber && !expiryDate && !cvv){
            updateCardsOnServer(cards);
            return;
        }


        if(!nameOnCard || !cardNumber || !expiryDate || !cvv){
            if(!nameOnCard) setCardError(true);
            if(!cardNumber) setCardNumberError(true);
            if(!expiryDate) setExpiryDateError(true);
            if(!cvv) setCvvError(true);
            return;
        }else{
            const newCard = {
                nameOnCard: nameOnCard,
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv
            }
            setCards([...cards, newCard]);


            updateCardsOnServer([...cards, newCard]);
            setNameOnCard("");
            setCardNumber("");
            setExpiryDate("");
            setCvv("");

            setAddingNewCard(false);
        }

        
        
    }

    const updateCardsOnServer = async (updatedCards) => {
        try {
            console.log("Updating cards on server:", updatedCards);
            const response = await fetch(`/api/users/update-cards/${user._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cardDetails: updatedCards, userId: user._id }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // update global user state
            } else {
                console.error("Failed to update cards");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    useEffect(() => {
        
        if(cards && cards.length === 0){
            setAddingNewCard(true);
        }
    }, [cards, user]);

    const handleInputChange = (e, index) => {
        const { id, value } = e.target;
        const updated = [...cards];
        if (id === "expiryDate") {
            updated[index].expiryDate = value;
        }else if (id === "nameOnCard") {
            updated[index].nameOnCard = value;
        } else if (id === "cardNumber") {
            updated[index].cardNumber = value;
        } else if (id === "cvv") {
            updated[index].cvv = value;
        }
        setCards(updated);
    }
    const [invoiceOption, setInvoiceOption] = useState(
        user && user.invoiceMail && user.invoiceMail !== "" ? "custom" : "existing"
    );


    const handleInvoiceMail = (mail) => {
        if(invoiceOption === "custom"){
            user.invoiceMail = mail;
            setUser({...user});            
        }

    }
    const invoiceMailSave = () => {
        if(invoiceOption === "existing"){
            return;
        }
        try{
                const response = fetch(`/api/users/update-invoice-mail/${user._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        invoiceMail: user.invoiceMail,
                        userId: user._id
                    })
                })
                if(!response.ok){
                    console.error("Failed to update invoice mail");
                }
                
            } catch (error) {
                console.error("Error:", error);
            }
    }

    const invoiceRowRef = useRef(null);

    const [currInvoiceRow, setCurrInvoiceRow] = useState(false);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (invoiceRowRef.current && !invoiceRowRef.current.contains(event.target)) {
                setCurrInvoiceRow(null);
                invoiceMailSave();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [invoiceRowRef, invoiceMailSave]);

    const [billingHistory, setBillingHistory] = useState([]);

    useEffect(() => {
        if(!user) return;
        const billingHistory = async () => {
            try{
                const response = await fetch(`/api/payments/get-billing-history/${user._id}`);
                if(response.ok){
                    const data = await response.json();
                    setBillingHistory(data.billingHistory);
                }
            } catch (error) {
                console.error("Error fetching billing history:", error);
            }
        };
        billingHistory();
    }, [user]);

    const getDate = (date) => {
      const d = new Date(date);

      const month = d.toLocaleString("en-US", { month: "long" });
      const day = d.getDate();
      const year = d.getFullYear();

      return `${month} ${day}, ${year}`;
    };

    const deleteAccount = () => {
        const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if(confirmation){
            // Proceed with account deletion
            try{
                fetch(`/api/users/delete-account/${user._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    };


    return (
      <div className="bg-background-light  dark:bg-background-dark font-display text-text-light dark:text-text-dark">
        <div className="relative flex  h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-containerflex  h-full grow flex-col">
            <div className="flex flex-1  justify-start py-5 sm:py-10 px-4 sm:px-8">
              <div className="layout-content-container  flex w-full flex-1 flex-col lg:flex-row gap-8 ">
                {/* Right Column: Main Content */}
                <main className="flex-1">
                  <div className="flex flex-col gap-8">
                    <header>
                      <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
                        Settings
                      </p>
                    </header>
                    {/* Edit Account Details Section */}
                    <section className="bg-white rounded p-6 shadow-lg">
                      <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-5 border-b border-border-light/50 dark:border-border-dark/20">
                        Edit Account Details
                      </h2>
                      <div className="flex justify-between items-center">
                        <div  className="w-full">
                            <div className="flex flex-wrap items-end gap-6 py-6">
                                <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    User Name
                                </p>
                                <input
                                    className="form-input flex min-w-0 flex-1 overflow-hidden rounded text-text-light dark:text-text-dark focus:outline-none outline-none focus:ring-0 ring-0 border border-accent/10 border-1 focus:border-accent/20 bg-background-light dark:bg-background-dark h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                                </label>
                            </div>
                            <div className="flex flex-wrap items-end gap-6 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    Email Address
                                </p>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light dark:text-text-dark focus:outline-none outline-none focus:ring-0 ring-0 border border-accent/10 border-1 focus:border-accent/20 bg-background-light dark:bg-background-dark h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                </label>
                            </div>
                        </div>
                        <div className="w-full flex justify-end mr-32">
                            <div className="flex flex-col items-center gap-4">
                                <img src={profilePic ? `/uploads/${profilePic}` : `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y`} className="w-32 h-32 rounded-full object-cover" />
                                <label className="flex items-center justify cursor-pointer text-sm underline gap-2 hover:text-accent">
                                    <i className="fa fa-upload text-xl"></i>
                                    <span>Upload New Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setProfilePic(reader.result);
                                            setProfilePicFile(file);
                                        };
                                        if (file) reader.readAsDataURL(file);
                                        }}
                                        className="hidden" // hides default file input
                                    />
                                </label>
                            </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-6 border-t border-border-light/50 dark:border-border-dark/20 mt-6">
                        <button
                          onClick={handleAccountDetailsChange}
                          className="flex items-center justify-center gap-2 h-12 px-6 bg-accent text-white rounded text-base font-bold leading-normal transition-colors hover:bg-accent/90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </section>
                    {/* Change Password Section */}
                    <section className="bg-white rounded p-6 shadow-lg">
                      <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-5 border-b border-border-light/50 dark:border-border-dark/20">
                        Change Password
                      </h2>
                      <div className="flex flex-col gap-6 py-6">
                        <label className="flex flex-col w-full max-w-sm">
                          <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                            Current Password
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light dark:text-text-dark focus:outline-none outline-none focus:ring-0 ring-0 border border-accent/10 border-1 focus:border-accent/20 bg-background-light dark:bg-background-dark h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder="Enter your current password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                          {oldPasswordError && (
                            <span className="text-xs text-red-500 mt-2 italic">
                              Incorrect old password
                            </span>
                          )}
                        </label>
                        <label className="flex flex-col w-full max-w-sm">
                          <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                            New Password
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light dark:text-text-dark ffocus:outline-none outline-none focus:ring-0 ring-0 border border-accent/10 border-1 focus:border-accent/20 bg-background-light dark:bg-background-dark h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder="Enter a new password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          {passwordError && (
                            <span className="text-xs text-red-500 mt-2 italic">
                              Password should exceed 8 characters
                            </span>
                          )}
                        </label>
                        <label className="flex flex-col w-full max-w-sm">
                          <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                            Confirm New Password
                          </p>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-text-light dark:text-text-dark focus:outline-none outline-none focus:ring-0 ring-0 border border-accent/10 border-1 focus:border-accent/20 bg-background-light dark:bg-background-dark h-14 placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder="Confirm your new password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          {confirmPasswordError && (
                            <span className="text-xs text-red-500 mt-2 italic">
                              Passwords do not match
                            </span>
                          )}
                        </label>
                      </div>
                      <div className="flex justify-end pt-6 border-t border-border-light/50 dark:border-border-dark/20 mt-6">
                        <button
                          onClick={() => handleUpdatePassword()}
                          className="flex items-center justify-center gap-2 h-12 px-6 bg-accent text-white rounded text-base font-bold leading-normal transition-colors hover:bg-accent/90"
                        >
                          Update Password
                        </button>
                      </div>
                    </section>
                    <section className="bg-white rounded p-6 shadow-lg">
                      <div className="flex">
                        <div className="flex flex-col w-full mr-10">
                          <h1 className="text-lg font-bold">Contact email</h1>
                          <p className="text-sm text-gray-500">
                            Where should we send your Invoices
                          </p>
                        </div>
                        <div className="flex flex-col w-full">
                          <div className="flex">
                            <input
                              name="InvoiceMail"
                              type="radio"
                              onChange={() => setInvoiceOption("existing")}
                              checked={invoiceOption === "existing"}
                              className="outline-none focus:outline-none border border-accent focus:border-accent text-accent ring-0 focus:ring-0"
                            ></input>
                            <div className="flex flex-col">
                              <label className="ml-2 text-md font-medium text-text-light dark:text-text-dark">
                                Send to the existing email address
                              </label>
                              <span className="text-sm text-gray-500">
                                {user.email}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <input
                              name="InvoiceMail"
                              type="radio"
                              onChange={() => setInvoiceOption("custom")}
                              checked={invoiceOption === "custom"}
                                className="outline-none focus:outline-none border border-accent focus:border-accent text-accent ring-0 focus:ring-0"
                            ></input>
                            <label className="ml-2 text-sm font-medium text-text-light dark:text-text-dark">
                              Use a different email
                            </label>
                            <input
                              onChange={(e) =>
                                handleInvoiceMail(e.target.value)
                              }
                              value={user.invoiceMail}
                              type="email"
                              className="form-input text-xs w-full mt-2 p-2 outline-none ring-none border border-border-color/10 dark:border-border-dark/40 rounded-md text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark focus:ring-0 focus:outline-0 focus:border-border-color/10"
                              placeholder="Enter your email"
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => invoiceMailSave()}
                                className="mt-2 px-3 py-2 text-xs bg-accent text-secondary rounded-md hover:bg-accent/90"
                              >
                                save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr className="my-4"></hr>
                      <div className="">
                        <h1 className="">Billing History</h1>
                        <p className="text-sm text-gray-500 ">
                          View and download your past invoices
                        </p>
                        <table className="w-full mt-4">
                          <thead className="rounded-t p-4">
                            <tr className="text-left border-b border-border-light/50 dark:border-border-dark/20 bg-gray-100 dark:bg-background-dark/20 p-4 rounded-t">
                              <th className="pb-2">
                                <input
                                  type="checkbox"
                                  className="mr-2 text-accent ring-0 focus:ring-0 outline-none focus:outline-none border border-accent focus:border-accent rounded-sm"
                                />
                              </th>
                              <th className="pb-2">Invoice</th>
                              <th className="pb-2">Date</th>
                              <th className="pb-2">Amount</th>
                              <th className="pb-2">Status</th>
                              <th className="pb-2">Tracking & Address</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {billingHistory &&
                              billingHistory !== 0 &&
                              billingHistory.map((invoice) => (
                                <tr
                                  key={invoice.id}
                                  className="text-sm border-b border-border-light/50 dark:border-border-dark/20"
                                >
                                  <td className="py-3">
                                    <input
                                      type="checkbox"
                                      className="mr-2 text-accent ring-0 focus:ring-0 outline-none focus:outline-none border border-accent focus:border-accent rounded-sm"
                                    />
                                  </td>
                                  <td className="py-3">
                                    #INV-{invoice.id.slice(-5)}
                                  </td>
                                  <td className="py-3">
                                    {getDate(invoice.dateCreated)}
                                  </td>
                                  <td className="py-3">{invoice.amount}</td>
                                  <td className="py-3 text-green-600 font-semibold">
                                    Paid
                                  </td>
                                  <td className="py-3">
                                    <div className="flex flex-col">
                                      <span>{invoice.trackingNumber}</span>
                                      <span>{invoice.address}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 relative ">
                                    <button
                                      onClick={() => setCurrInvoiceRow(invoice)}
                                      className="text-sm text-accent px-3 py-1"
                                    >
                                      <span className="material-symbols-outlined">
                                        more_vert
                                      </span>
                                    </button>
                                    {currInvoiceRow === invoice && (
                                      <div
                                        ref={invoiceRowRef}
                                        className="absolute top-full right-1/2 bg-white shadow-lg rounded-b z-10 w-max flex flex-col"
                                      >
                                        <span className="flex justify-start px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 cursor-pointer">
                                          <span className="material-symbols-outlined mr-4">
                                            download
                                          </span>
                                          Download Invoice
                                        </span>
                                        <span className="flex justify-start px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 cursor-pointer">
                                          <span className="material-symbols-outlined mr-4">
                                            document_scanner
                                          </span>{" "}
                                          View Details
                                        </span>
                                        <span className="flex justify-start px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 cursor-pointer">
                                          <span className="material-symbols-outlined mr-4">
                                            delete
                                          </span>
                                          Delete
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </section>

                    {/* Delete Account Section */}
                    <section className="bg-white rounded p-6 shadow-lg">
                      <h2 className="text-destructive text-[22px] font-bold leading-tight tracking-[-0.015em] pb-5">
                        Delete Account
                      </h2>
                      <div className="py-6">
                        <p className="text-text-light dark:text-text-dark max-w-2xl">
                          Warning: This action is irreversible. Deleting your
                          account will permanently remove all your data,
                          including booking history and personal information.
                          This cannot be undone. Please be certain before you
                          proceed.
                        </p>
                      </div>
                      <div className="flex justify-start pt-6">
                        <button onClick={() => deleteAccount()} className="flex items-center justify-center gap-2 h-12 px-6 bg-red-500 text-white rounded text-base font-bold leading-normal transition-colors hover:bg-destructive/90">
                          Delete My Account
                        </button>
                      </div>
                    </section>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}