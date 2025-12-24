import React, { use, useEffect, useRef, useState } from "react";
import { Header } from "./home";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import TigerBg from "./images/tiger_bg.png";
// import "react-calendar/dist/Calendar.css"; // import default styles

import marker from "./images/marker.png";


function CustomTour() {

    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);

    const queryParams = new URLSearchParams(window.location.search);
    const bookingId = queryParams.get("bid");
    const adminView = queryParams.get("admin");
    const userIdParam = queryParams.get("user");

    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if(adminView && userIdParam && bookingId){
            const fetchBooking = async () => {
                try {
                    const response = await fetch(`/api/tour-bookings/get-booking-by/${bookingId}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setBooking(data.booking);
                    } else {
                        console.error("Failed to fetch booking data");
                    }
                } catch (error) {
                    console.error("Error fetching booking data:", error);
                }
            };
            fetchBooking();
        }
    }, [adminView, userIdParam, bookingId]);

    const [pkgTour, setPkgTour] = useState(null);

    useEffect(() => {
        if(booking && adminView && userIdParam){
            if(booking.planType === "custom") return;
            const getPkgForBooking = async () => {
                try {
                    const response = await fetch(`/api/tours/get-tour-by/${booking.planId._id}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setPkgTour(data.tour);                        
                    } else {
                        console.error("Failed to fetch tour data for booking");
                    }
                } catch (error) {
                    console.error("Error fetching tour data for booking:", error);
                }
            };
            getPkgForBooking();
        }
    }, [booking, adminView, userIdParam]);

    useEffect(() => {
        if(pkgTour){
            setTourName(pkgTour.name);
            const destinations = pkgTour.destinations;
            setDailyPlan([destinations]);
            setTourDate(new Date(booking.planDate));
            setBudget(pkgTour.price);
        }
    }, [pkgTour]);

    const [cusTour, setCusTour] = useState(null);

    useEffect(() => {
        if(booking && adminView && userIdParam){
            if(booking.planType === "package") return;
            const getCusTourForBooking = async () => {
                try {
                    const response = await fetch(`/api/custom-tours/tour-by/${booking.planId._id}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCusTour(data.customTour);
                    } else {
                        console.error("Failed to fetch custom tour data for booking");
                    }
                } catch (error) {
                    console.error("Error fetching custom tour data for booking:", error);
                }
            };
            getCusTourForBooking();
        }
    }, [booking, adminView, userIdParam]);


    useEffect(() => {
        if(cusTour){
            setTourName(cusTour.tourName);
            setTourDate(new Date(booking.planDate));   
            setDesFromIds(cusTour.dailyPlan);
            setBudget(cusTour.budget);
            setSpecialRequests(cusTour.specialRequests);
        }
    }, [cusTour]);

    const setDesFromIds = (dailyPlanIds) => {
        dailyPlanIds.forEach((day, dayIndex) => {
            const destinations = [];
            for(const destId of day){
                const dest = allDestinations.find(d => d._id === destId);
                if(dest){
                    destinations.push(dest);
                }
            }
            setDailyPlan(prev => {{
                const updated = [...prev];
                updated[dayIndex] = destinations;
                return updated;
            }});
        });        
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
                        if(data.user.role === "admin" && adminView && userIdParam){
                            setAdmin(data.user);
                        }else if(data.user.role === "user" && !adminView){
                            setUser(data.user);
                        }
                        else{
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
        if(adminView && userIdParam){
            // Fetch user data based on userIdParam
            const fetchUserById = async (userId) => {
                try {
                    const response = await fetch(`/api/users/get-user-by/${userId}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                    } else {
                        console.error("Failed to fetch user data for admin view");
                    }
                } catch (error) {
                    console.error("Error fetching user data for admin view:", error);
                }
            };
            fetchUserById(userIdParam);

        }
    }, [adminView, userIdParam]);
    
    

    const userId = user ? user._id : null;

    const [dailyPlan, setDailyPlan] = useState([[]]); 


    const [allDestinations, setAllDestinations] =useState([]);
    useEffect(() => {
        const fetchAllDestinations = async () => {
            try {
                const response = await fetch("/api/destinations/all-published", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllDestinations(data.destinations);
                } else {
                    console.error("Failed to fetch destinations");
                }
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        };

        fetchAllDestinations();
    }, []);

    const [searchReq, setSearchReq] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(["All"]);
    const [filteredDestinations, setFilteredDestinations] = useState(allDestinations && allDestinations.slice(0,5));
    const [categoryList, setCategoryList] = useState([]);
    const onLoadDestiSet = useRef(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/destinations/category-list", {
                    method: "GET",
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategoryList([...categoryList, ...data.categories]);
                } else {
                    console.error("Failed to fetch categories");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if(onLoadDestiSet.current && allDestinations.length === 0) return;
        setFilteredDestinations(allDestinations.slice(0,5));
        onLoadDestiSet.current = true;        
    }, [allDestinations]);

    

    const searchDestinations = () => {
        setFilteredDestinations(
            allDestinations.filter((destination) => {
                // 1️⃣ Match search query in name or description
                const matchesSearch =
                    destination.name.toLowerCase().includes(searchReq.toLowerCase()) ||
                    destination.description.toLowerCase().includes(searchReq.toLowerCase());

                // 2️⃣ Match categories
                const matchesCategory =
                    categoryFilter.includes("All") || // if "All" is selected, include all
                    destination.categories.some((cat) => categoryFilter.includes(cat));

                return matchesSearch && matchesCategory;
            })
        );
    };
    useEffect(() => {
        searchDestinations();
    }, [categoryFilter, searchReq, allDestinations]);
    
    const handleInsertDestination = (destination) => {
        const alreadyExists = dailyPlan[dailyPlan.length - 1].some(item => item._id === destination._id);  // CHANGED
        if (alreadyExists) return  // CHANGED

        const updatedDailyPlan = [...dailyPlan];
        const lastIndex = updatedDailyPlan.length - 1; // get last index
        updatedDailyPlan[lastIndex].push(destination);  // push to last array
        setDailyPlan(updatedDailyPlan);
    };

    const handleDeleteActivity = (dayIndex, activityIndex) => {
    setDailyPlan(prevPlan => {
        const updated = [...prevPlan];          // copy outer array
        updated[dayIndex] = [...updated[dayIndex]]; // copy inner array
        updated[dayIndex].splice(activityIndex, 1); // remove the activity
        return updated;
    });
};

    const clickAddDay = () => {
        if(dailyPlan[dailyPlan.length - 1].length === 0) return; // max 14 days
        setDailyPlan([...dailyPlan, []]);
    }

    const [draggedDestination, setDraggedDestination] = useState(null);

    const handleDragStart = (destination) => {
        setDraggedDestination(destination);
    };
    const handleDrop = (dayIndex) => {
        if (!draggedDestination) return;
        

        setDailyPlan(prev => {
            let copy = [...prev];

            // Ensure day 0 exists
            if (!copy[dayIndex]) copy[dayIndex] = [];

            // ⭐ CHANGED: Prevent adding if the same destination already exists
            const alreadyExists = copy[dayIndex].some(item => item._id === draggedDestination._id);  // CHANGED
            if (alreadyExists) return prev;  // CHANGED

            // Add new activity
            copy[dayIndex] = [...copy[dayIndex], draggedDestination];
            return copy;
        });

        setDraggedDestination(null);
    };

    // CHANGED: handle moving inside & between days
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // CHANGED: if dropped outside area, skip
        if (!destination) return;

        const sourceDay = parseInt(source.droppableId.split("-")[1]);      // CHANGED
        const destDay = parseInt(destination.droppableId.split("-")[1]);   // CHANGED

        const newPlan = [...dailyPlan];

        // CHANGED: take the dragged item out
        const [movedActivity] = newPlan[sourceDay].splice(source.index, 1);

        // CHANGED: insert into the new location
        newPlan[destDay].splice(destination.index, 0, movedActivity);

        // CHANGED: update state
        setDailyPlan(newPlan);
    };

    const removeDay = (dayIndex) => {
        setDailyPlan(prevPlan => {
            const updated = [...prevPlan];
            updated.splice(dayIndex, 1); // remove the day
            return updated;
        });
    };
   
    // handle map 
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
        console.log("Daily Plan updated:", dailyPlan);
    }, [dailyPlan]);

    useEffect(() => {
        const locs = [];
        dailyPlan.forEach((day) => {
            day.forEach((activity) => {
                if (activity.location && activity.location.lat && activity.location.lon) {
                    locs.push({
                        name: activity.name,
                        lat: activity.location.lat,
                        lon: activity.location.lon,
                    });
                }
            });
        });
        
        setLocations(locs);
        
    }, [dailyPlan]);

    
    useEffect(() => {
        console.log("Locations updated:", locations);
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



    const [tourDate, setTourDate] = useState(null);

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
    
    const isBeforeToday = (date) => {
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date.getTime() < today.getTime();
    };

    const [tourName, setTourName] = useState("");
    const [numTravelers, setNumTravelers] = useState(1);
    const [specialRequests, setSpecialRequests] = useState("");
    const [budget, setBudget] = useState(0);

    const [tourNameError, setTourNameError] = useState(false);
    const [numTravelersError, setNumTravelersError] = useState(false);
    const [budgetError, setBudgetError] = useState(false);

    const handleTourSubmit = async () => {
        if(dailyPlan.length === 0 || dailyPlan.every(day => day.length === 0)){
            alert("Please add at least one activity to your itinerary before finalizing the tour.");
            
            return;
        }
        if(!tourName || numTravelers <= 0){
            alert("Please fill in all required fields before finalizing the tour.");
            if(tourName.trim() === "") setTourNameError(true);
            if(numTravelers <= 0) setNumTravelersError(true);
            return;
        }
        const destinationIds = dailyPlan.map(day => day.map(activity => activity._id));

        // Prepare tour data
        const tourData = {
            userId: userId,
            dailyPlan: destinationIds,
            tourName: tourName,
            budget: budget,
            specialRequests: specialRequests,
            // Add other tour details as needed
        };
        if(!cusTour){
            try {
            const response = await fetch("/api/custom-tours/create-custom-tour", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tourData),
            });
            if (response.ok) {
                const data = await response.json();
                alert("Tour created successfully!");
                const resBooking = await fetch(`/api/tour-bookings/book-tour`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        planId: data.customTour._id,
                        refModel: "CustomTour",
                        planType: "custom",
                        planDate: tourDate,
                        bookedAdmin: admin ? admin._id : null,
                        groupSize: numTravelers,
                        status : bookingId && adminView && userIdParam ? 'On Review' : "Pending"
                        
                    }),
                });
                if (resBooking.ok) {
                    const bookingData = await resBooking.json();
                    console.log("Tour booked successfully:", bookingData.booking);
                    if(bookingId && adminView && userIdParam && pkgTour){
                        try{
                            const res = await fetch(`/api/tour-bookings/update-booking-status/${bookingId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    bookingId: bookingId,
                                    status: 'Replaced',
                                }),
                            });
                            if(res.ok){
                                console.log("Original booking marked as Replaced");
                                try{
                                    let message;
                                    if(pkgTour){
                                        message = `Your booking for the tour "${pkgTour.name}" has been replaced with a new custom tour "${tourName}".`;
                                    }else if(pkgTour === null && adminView && userIdParam){
                                        message = `We placed a new custom tour "${tourName}" booking request. Please check your dashboard for details.`;
                                    }else{
                                        message = `Your booking for the custom tour "${tourName}" has been received! Please check your dashboard for details.`;
                                    }

                                    const resNotifi = await fetch(`/api/notifications/add-notification`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            userId: userId,
                                            type: 'tour booking',
                                            message: message,
                                            date: new Date(),
                                        }),
                                    });
                                    if(resNotifi.ok){
                                        console.log('Notification sent successfully');
                                        navigate(`/admin_dashboard`);
                                    }
                                } catch (error) {
                                    console.error('Error sending notification:', error);
                                }
                                

                            } else {
                                console.error("Failed to update original booking status");
                            }
                        } catch (error) {
                            console.error("Error updating original booking status:", error);
                            
                        }
                    }
                } else {
                    console.error("Failed to book tour");
                }
                
            } else {
                console.error("Failed to create tour");
                alert("Failed to create tour. Please try again.");
            }
            } catch (error) {
                console.error("Error creating tour:", error);
                alert("An error occurred while creating the tour. Please try again.");
            }
        }else{
            try {
                const response = await fetch(`/api/custom-tours/update-custom-tour/${cusTour._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(tourData),
                });
                if (response.ok) {
                    alert("Tour updated successfully!");
                    try{
                        const res = await fetch(`/api/tour-bookings/update-booking/${bookingId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                groupSize: numTravelers,
                                planDate: tourDate,
                            }),
                        });
                        if(res.ok){
                            console.log("Booking updated successfully");
                            try{
                                const resNotifi = await fetch(`/api/notifications/add-notification`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        userId: userId,
                                        type: "tour booking",
                                        message: `Your booking for the custom tour "${tourName}" has been updated successfully!`,
                                        date: new Date(),
                                    }),
                                });
                                if (resNotifi.ok) {
                                    console.log("Notification sent successfully");
                                    navigate(`/customer_dashboard`);
                                } else {
                                    console.error("Failed to send notification");
                                }
                            } catch (error) {
                                console.error("Error sending notification:", error);
                            }
                            
                        } else {
                            console.error("Failed to update booking");
                        }
                    } catch (error) {
                        console.error("Error updating booking:", error);

                    }
                    
                } else {
                    console.error("Failed to update tour");
                    alert("Failed to update tour. Please try again.");
                }
            } catch (error) {
                console.error("Error updating tour:", error);
                alert("An error occurred while updating the tour. Please try again.");  
            }
        }
    };

    const [overlayVisible, setOverlayVisible] = useState(false);
    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    };

    
    return (
      <div className="relative p-0 m-0 w-screen h-screen font-display text-[#131811]">
        <div className="">
          <Header admin={admin} user={user} />
        </div>
        <div className="w-screen h-screen flex flex-col ">
          {/* Left Sidebar (Discover Panel) */}
          <div
            onClick={toggleOverlay}
            className={`absolute top-0 left-0 z-50 w-screen h-screen overflow-y-auto backdrop-blur-sm bg-black/20 ${
              overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            } transition-opacity duration-300`}
            id="overlay"
          >
            <aside
              onClick={(e) => e.stopPropagation()}
              className={`${
                overlayVisible
                  ? "transform-[translateX(0)]"
                  : "transform-[translateX(-100%)]"
              } w-1/4 transition-transform duration-300 h-screen overflow-y-auto col-span-12 md:col-span-3 bg-off-white rounded-r-lg p-4 flex flex-col gap-4 `}
            >
              {/* PageHeading */}
              <div className="flex min-w-72 flex-col gap-2">
                <h1 className="text-deep-forest-green text-3xl font-black leading-tight tracking-[-0.033em]">
                  Build Your Sri Lankan Adventure
                </h1>
                <p className="text-stone-gray text-base font-normal leading-normal">
                  Create a personalized travel itinerary by selecting activities
                  and destinations.
                </p>
              </div>
              {/* SearchBar */}
              <div className="py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-full h-full">
                    <div className="text-stone-gray flex border border-r-0 border-stone-gray/20 bg-sandy-beige items-center justify-center pl-4 rounded-l-full">
                      <span
                        className="material-symbols-outlined"
                        onClick={() => searchDestinations()}
                      >
                        search
                      </span>
                    </div>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-deep-forest-green focus:outline-0 focus:ring-2 focus:ring-terracotta-orange/50 border border-l-0 border-stone-gray/20 bg-sandy-beige h-full placeholder:text-stone-gray px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                      placeholder="Find destinations or activities"
                      defaultValue=""
                      value={searchReq}
                      onChange={(e) => setSearchReq(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchDestinations();
                        }
                      }}
                    />
                  </div>
                </label>
              </div>
              {/* Chips */}
              <div className="flex gap-2 p-1 flex-wrap">
                <div
                  key={"All"}
                  className={`flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-deep-forest-green pl-4 pr-4 ${
                    categoryFilter.includes("All")
                      ? "bg-opacity-100 text-secondary hover:bg-accent/90"
                      : "bg-opacity-20 text-accent hover:bg-accent/30"
                  } hover:bg-opacity-100 transition-opacity`}
                  onClick={() => {
                    setCategoryFilter(["All"]);
                  }}
                >
                  <p className="text-sm font-medium leading-normal">All</p>
                </div>
                {categoryList.map((category, index) => (
                  <div
                    key={index}
                    className={`flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-full bg-deep-forest-green pl-4 pr-4 ${
                      categoryFilter.includes(category)
                        ? "bg-opacity-100 text-secondary hover:bg-accent/90"
                        : "bg-opacity-20 text-accent hover:bg-accent/30"
                    } hover:bg-opacity-100 transition-opacity`}
                    onClick={() => {
                      if (category === "All") {
                        setCategoryFilter(["All"]);
                      } else {
                        if (categoryFilter.includes(category)) {
                          setCategoryFilter(
                            categoryFilter.filter((cat) => cat !== category)
                          );
                        } else {
                          setCategoryFilter([
                            ...categoryFilter.filter((cat) => cat !== "All"),
                            category,
                          ]);
                        }
                      }
                    }}
                  >
                    <p className="text-sm font-medium leading-normal">
                      {category}
                    </p>
                  </div>
                ))}
              </div>
              {/* Activity/Destination Cards */}
              <div className="flex flex-col gap-4">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((destination, index) => (
                    <div
                      key={destination.id}
                      draggable
                      onDragStart={() => handleDragStart(destination)}
                      className="flex flex-col gap-3 p-3 rounded-lg bg-sandy-beige border border-stone-gray/20 cursor-grab"
                    >
                      <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                        data-alt="A large, ancient rock fortress rising dramatically from the plains, with lush green jungle surrounding it."
                        style={{
                          backgroundImage:
                            'url("/uploads/' +
                            destination.images[destination.coverIndex] +
                            '")',
                        }}
                      />
                      <div>
                        <p className="text-deep-forest-green text-base font-bold leading-normal">
                          {destination.name}
                        </p>
                        <p
                          className="text-stone-gray text-sm font-normal leading-normal"
                          style={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {destination.description}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          handleInsertDestination(destination);
                        }}
                        className="flex items-center justify-center w-full h-9 rounded-full bg-deep-forest-green text-off-white text-sm font-medium hover:bg-opacity-90 transition-opacity"
                      >
                        Add to Itinerary
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-stone-gray text-sm font-normal leading-normal">
                    No destinations found.
                  </p>
                )}
              </div>
            </aside>
          </div>
          {/* MainContent */}

          <main className=" flex-grow flex gap-6 ">
            {/* Center Panel (Itinerary Builder) */}

            <div className="relative w-2/3 col-span-12 md:col-span-5 bg-off-white rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="absolute w-full h-full">
                <img
                  className=" w-auto h-1/2 mt-32 transform -scale-x-100"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom,transparent 0%,black 20%,black 80%,transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom,transparent 0%,black 20%, black 80%, transparent 100%)",
                    WebkitMaskComposite: "intersect",
                    maskComposite: "intersect",
                  }}
                  src={TigerBg}
                ></img>
              </div>
              <div className="z-10">
                <h1 className="text-deep-forest-green text-2xl font-bold">
                  Basic Information
                </h1>
                <div className="flex  gap-4">
                  <div className="w-full">
                    <div className="flex flex-col justify-between">
                      <h2 className="text-deep-forest-green text-lg font-bold">
                        Tour Name
                      </h2>
                      <input
                        className="form-input border border-1 border-gray-500/20 focus:border-gray-500/30 rounded outline-none ring-0 focus:ring-0 focus:outline-none "
                        placeholder="Enter tour name"
                        defaultValue=""
                        value={tourName}
                        onChange={(e) => setTourName(e.target.value)}
                        onFocus={() => setTourNameError(false)}
                      />
                      {tourNameError && (
                        <p className="text-red-500 text-xs italic">
                          Please enter a tour name.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col justify-between">
                      <h2 className="text-deep-forest-green text-lg font-bold">
                        Number of Travelers
                      </h2>
                      <input
                        className="form-input border border-1 border-gray-500/20 focus:border-gray-500/30 rounded outline-none ring-0 focus:ring-0 focus:outline-none "
                        placeholder="Enter number of travelers"
                        defaultValue=""
                        type="number"
                        value={numTravelers}
                        onChange={(e) => setNumTravelers(e.target.value)}
                        onFocus={() => setNumTravelersError(false)}
                      />
                    </div>
                    {numTravelersError && (
                      <p className="text-red-500 text-xs italic">
                        Please enter a valid number of travelers.
                      </p>
                    )}
                    {admin && adminView && userIdParam && booking && (
                      <div className="flex flex-col justify-between">
                        <h2 className="text-deep-forest-green text-lg font-bold">
                          Budget Per Person (Rs)
                        </h2>
                        <input
                          className="form-input"
                          placeholder="Enter budget per person"
                          defaultValue=""
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          onFocus={() => setBudgetError(false)}
                        />
                        {budgetError && (
                          <p className="text-red-500 text-xs italic">
                            Please enter a valid budget.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="">
                      <button
                        onClick={toggleOverlay}
                        className="m-4 p-2 rounded-lg bg-deep-forest-green text-off-white text-sm font-medium hover:bg-opacity-90 transition-opacity"
                      >
                        Search Destinations
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <h1 className="text-deep-forest-green text-lg font-bold">
                      Select Starting Date
                    </h1>
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      {/* component */}
                      <div className="flex items-center justify-center">
                        <div className="w-full rounded-lg overflow-hidden">
                          {/* Header */}
                          <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800">
                            <button
                              onClick={handlePrevMonth}
                              className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
                            >
                              ◀
                            </button>
                            <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                              {currentDate.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                            <button
                              onClick={handleNextMonth}
                              className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded"
                            >
                              ▶
                            </button>
                          </div>

                          {/* Weekdays */}
                          <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-700 text-center py-2">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                              (d) => (
                                <div
                                  key={d}
                                  className="text-gray-600 dark:text-gray-300 font-medium"
                                >
                                  {d}
                                </div>
                              )
                            )}
                          </div>

                          {/* Days */}
                          <div className="grid grid-cols-7 gap-1 p-2 bg-white dark:bg-gray-800">
                            {daysArray.map((day, idx) => {
                              return (
                                <div
                                  key={idx}
                                  className="flex flex-col items-center min-h-[60px] p-1 cursor-pointer"
                                >
                                  {day && (
                                    <div
                                      onClick={() => {
                                        const dateObj = new Date(
                                          currentDate.getFullYear(),
                                          currentDate.getMonth(),
                                          day
                                        );
                                        dateObj.setHours(0, 0, 0, 0);

                                        if (isBeforeToday(dateObj)) return;

                                        setTourDate(dateObj);
                                      }}
                                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                        isBeforeToday(
                                          new Date(year, month, day)
                                        )
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:bg-secondary "
                                      } ${
                                        tourDate && tourDate.getDate() === day
                                          ? "bg-accent text-secondary hover:bg-accent/80"
                                          : "bg-transparent text-gray-800 dark:text-gray-100"
                                      }`}
                                    >
                                      <span className="text-sm font-medium">
                                        {day}
                                      </span>
                                    </div>
                                  )}
                                  {/* Render event dots */}
                                  <div className="flex flex-col mt-1 space-y-1">
                                    {tourDate &&
                                      tourDate < day &&
                                      tourDate + dailyPlan.length > day && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mx-auto"></div>
                                      )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-gray-500 text-sm">
                        The Tour Starts On {tourDate && tourDate.getDate()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h2 className="text-deep-forest-green text-2xl font-bold">
                    Your Itinerary
                  </h2>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setDailyPlan([[]]);
                      }}
                      className="flex items-center justify-center h-9 px-4 rounded-full bg-sandy-beige border border-stone-gray/20 text-deep-forest-green text-sm font-medium hover:bg-deep-forest-green/10 transition-colors"
                    >
                      Remove All
                    </button>
                    <button
                      onClick={clickAddDay}
                      className="flex items-center justify-center h-9 px-4 rounded-full bg-deep-forest-green text-off-white text-sm font-medium hover:bg-opacity-90 transition-opacity"
                    >
                      Add Day
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  {/* Day 1 */}
                  <DragDropContext
                    onDragEnd={handleDragEnd} // CHANGED: added dragEnd handler
                  >
                    {dailyPlan &&
                      dailyPlan.map((day, dayIndex) => (
                        // CHANGED: Make each day a Droppable container
                        <Droppable
                          droppableId={`day-${dayIndex}`}
                          key={dayIndex}
                        >
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="flex flex-col gap-3"
                            >
                              {" "}
                              <div className="flex justify-between items-center">
                                <h3 className="text-terracotta-orange text-lg font-bold">
                                  Day {dayIndex + 1}
                                </h3>
                                <span
                                  onClick={() => removeDay(dayIndex)}
                                  className="text-stone-gray text-xs font-normal underline cursor-pointer italic"
                                >
                                  {" "}
                                  Remove Day{" "}
                                </span>
                              </div>
                              {/* CHANGED: Every activity is now draggable */}
                              {day.map((activity, activityIndex) => (
                                <Draggable
                                  key={
                                    activity._id ||
                                    `${dayIndex}-${activityIndex}`
                                  } // CHANGED: stable key
                                  draggableId={activity._id}
                                  index={activityIndex}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps} // CHANGED
                                      {...provided.dragHandleProps} // CHANGED
                                      className={`flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-gray/20 transition-all duration-200
                                                                ${
                                                                  snapshot.isDragging
                                                                    ? "shadow-2xl scale-[1.02]"
                                                                    : "shadow"
                                                                }  // CHANGED
                                                            `}
                                    >
                                      <div
                                        className="w-24 h-16 bg-center bg-no-repeat bg-cover rounded"
                                        style={{
                                          backgroundImage:
                                            'url("/uploads/' +
                                            activity.images[
                                              activity.coverIndex
                                            ] +
                                            '")',
                                        }}
                                      />
                                      <div className="flex-grow">
                                        <p className="text-deep-forest-green font-medium">
                                          {activity.name}
                                        </p>
                                        <p className="text-stone-gray text-sm">
                                          {activity.categories[0]} - Approx.{" "}
                                          {activity.exploreTime} hrs
                                        </p>
                                      </div>

                                      {/* CHANGED: drag icon works as handle */}
                                      <span className="material-symbols-outlined cursor-grab">
                                        drag_indicator
                                      </span>

                                      <button
                                        onClick={() =>
                                          handleDeleteActivity(
                                            dayIndex,
                                            activityIndex
                                          )
                                        }
                                        className="text-stone-gray hover:text-terracotta-orange transition-colors"
                                      >
                                        <span className="material-symbols-outlined">
                                          delete
                                        </span>
                                      </button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {/* CHANGED: placeholder required for DnD */}
                              {provided.placeholder}
                              <div
                                className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed border-stone-gray/30 text-stone-gray"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(dayIndex)}
                              >
                                <p>Drag an activity here or click 'Add'</p>
                              </div>
                            </div>
                          )}
                        </Droppable>
                      ))}
                  </DragDropContext>
                </div>

                <div className="flex flex-col justify-between">
                  <h2 className="text-deep-forest-green text-2xl font-bold">
                    Special Requests
                  </h2>
                  <input
                    className="form-input border border-1 border-gray-500/20 focus:border-gray-500/30 rounded outline-none ring-0 focus:ring-0 focus:outline-none "
                    placeholder="Enter special requests"
                    defaultValue=""
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Right Sidebar (Map & Summary) */}
            <aside className="sticky right-0 top-0 w-1/3 col-span-12 md:col-span-4 bg-off-white rounded-lg p-4 flex flex-col gap-4">
              <div className="flex-grow bg-stone-gray/20 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="flex justify-center rounded w-full ml-4 border border-border-color overflow-hidden ">
                  <div id="map" className="w-full h-[40vh]  z-0"></div>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-sandy-beige p-4 rounded-lg border border-stone-gray/20">
                <div className="w-full flex justify-between items-center mb-2">
                  <h3 className="text-deep-forest-green text-lg font-bold">
                    Trip Summary
                  </h3>
                  <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-accent text-off-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity">
                    <span className="truncate" onClick={getDirections}>
                      Get Directions
                    </span>
                  </button>
                </div>
                <div className="flex justify-between items-center text-deep-forest-green">
                  <p>Trip Duration:</p>
                  <p className="font-bold">{dailyPlan.length}</p>
                </div>
                <div className="flex justify-between items-center text-deep-forest-green">
                  <p>Travel Distance:</p>
                  <p className="font-bold">
                    ~{distance ? `${distance} km` : "Calculating..."}
                  </p>
                </div>
                <div className="flex justify-between items-center text-deep-forest-green">
                  <p>Estimated Travel Time:</p>
                  <p className="font-bold">
                    ~{duration ? `${duration} hours` : "Calculating..."}
                  </p>
                </div>
                <div className="text-deep-forest-green">
                  <p>Your Route:</p>
                  <p className="text-stone-gray text-xs text-gray-600">
                    {locations.length > 0
                      ? locations.map((loc, index) => (
                          <span key={index}>
                            {loc.name}
                            {index < locations.length - 1 ? " -> " : ""}
                          </span>
                        ))
                      : "No route available"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleTourSubmit}
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-accent text-off-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity"
              >
                <span className="truncate">Finalize Your Dream Trip</span>
              </button>
            </aside>
          </main>
        </div>
      </div>
    );
}

export default CustomTour;