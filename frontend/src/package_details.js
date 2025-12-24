import React, { useEffect, useState } from "react"; 
import { Footer, Header } from "./home";
import { useNavigate } from "react-router-dom";
import { use } from "react";

function PackageDetails() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
        
           useEffect(() => {
            async function checkSession() {
                try {
                const response = await fetch('/api/users/check-session', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                                
        
                    const data = await response.json();
                    console.log("Session data:", data);
                    if(data.loggedIn){                    
                        setUser(data.user);
                    } else {
                        navigate('/login');
                    }
                    
                } else {
                    navigate('/login');
                }
                } catch (error) {
                console.error('Error checking session:', error);
                }
            }
            checkSession();
        }, []);


    const queryParams = new URLSearchParams(window.location.search);
    const packageId = queryParams.get("id");

    const [pkg, setPkg] = useState(null);

    useEffect(() => {
        // Fetch package details from backend API
        async function fetchPackageDetails() {
            try {
                const response = await fetch(
                    `/api/tours/get-tour-by/${packageId}`
                );
                const data = await response.json();
                setPkg(data.tour);
            } catch (error) {
                console.error("Error fetching package details:", error);
            }
        }
        fetchPackageDetails();
    }, [packageId]);


    const retIcon = (categories) => {
        switch (categories[0]) {
            case "Cultural":
                return "temple_hindu";
            case "Nature":
                return "park";
            case "Adventure":
                return "terrain";
            case "Beach":
                return "beach_access";
            case "Wildlife":
                return "pets";
            case "Luxury":
                return "villa";
            case "Historical":
                return "castle";
            case "Religious":
                return "church";
            
            default:
                return "explore";
        }
    };

    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        // Fetch destinations details from backend API
        if (!pkg) return;
        async function fetchDestinations() {
            try {
                const response = await fetch("/api/destinations/all", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include", // Include cookies for authentication
                });
                if (response.ok){
                    const data = await response.json();
                    const packageDestinationIds = pkg.destinations.map((d) => d._id.toString());
                    console.log("ids", packageDestinationIds);
                    const filtered = data.destinations.filter((dest) =>
                        packageDestinationIds.includes(dest._id.toString())
                    );

                    setDestinations(filtered);
                    console.log("Filtered destinations:", filtered);
                }
                
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        }
        fetchDestinations();
    }, [pkg]);

    useEffect(() => {
        console.log(destinations);
    }, [destinations]);
        
    const [startDate, setStartDate] = useState(null);
    const [travelers, setTravelers] = useState(0);

    const [startDateError, setStartDateError] = useState(false);
    const [travelersError, setTravelersError] = useState(false);


    const handleBookNow = async () => {
        // Validate inputs
        if (!startDate) {
            setStartDateError(true);
            return;
        }
        if (!travelers || travelers < pkg?.minGroupSize || travelers > pkg?.maxGroupSize) {
            console.log("Travelers error:", travelers);
            setTravelersError(true);
            return;
        }

        try{
            const response = await fetch('/api/tour-bookings/book-tour', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    planId: pkg,
                    userId: user._id,
                    planType:"package",
                    refModel : "Tour",
                    planDate : startDate,
                    groupSize : travelers,
                }),
            });
            if (response.ok) {
                try{
                    const resNotifi = await fetch('/api/notifications/add-notification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user._id,
                            type: 'tour booking',
                            message: `Your booking for the tour "${pkg.name}" has been received! We will contact you soon with further details`,
                            date: new Date(),
                        }),
                    });
                    if(resNotifi.ok){
                        console.log('Notification sent successfully');
                        navigate("/tour_search");
                    }

                } catch (error) {
                    console.error('Error sending notification:', error);
                }
                
            }else{                
                throw new Error('Failed to book the tour');
            }
            // Handle successful booking (e.g., show a confirmation message)
        } catch (error) {
            console.error('Error booking the tour:', error);
            // Handle error (e.g., show an error message)
        }
    };

    const [currWindow, setCurrWindow] = useState(0);

    const handleWindowClick = (index, section) => {
      setCurrWindow(index);
      document.getElementById(section)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };


    const [reviews, setReviews] = useState([]);
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch("/api/reviews/all-reviews", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setReviews(data.reviews);
          } else {
            console.error("Failed to fetch reviews");
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
      fetchReviews();
    }, []);

  const [reviewedUsers, setReviewedUsers] = useState([]);

  useEffect(() => {

    const getReviewedUsers = async () => {
      try {
        const response = await fetch(`/api/reviews/reviews-by-plan/${pkg._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setReviewedUsers(data.users);
        } else {
          console.error("Failed to fetch reviewed users");
        }
      } catch (error) {
        console.error("Error fetching reviewed users:", error);
      }
    };
    getReviewedUsers();
  }, []);

  const getUserFromReview = (userId, req) => {
    
    const user = reviewedUsers.find((user) => user._id === userId);
    if(req === "name"){
        return user ? user.userName : "Unknown User";
    } else if(req === "img"){
      return user && user.profileImg ? `/uploads/${user.profileImg}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    }
    
  };  

    return (
      <>
        <div className="relative flex min-h-screen w-full flex-col bg-background-light group/design-root dark:bg-background-dark overflow-x-hidden font-display">
          <div className="layout-container flex h-full grow flex-col">
            <Header user={user} />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5">
              <div className="mx-auto max-w-6xl">
                <div className="@container">
                  <div className="@[480px]:p-4">
                    <div
                      className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4 text-center"
                      data-alt="A lush green tea plantation in the hills of Sri Lanka under a clear blue sky"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url(${
                          "/uploads/" + pkg?.images[0]
                        })`,
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                          {pkg?.name}
                        </h1>
                        <h2 className="text-white/90 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal max-w-2xl mx-auto">
                          {pkg?.summary}
                        </h2>
                      </div>
                      <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-accent text-secondary text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]">
                        <span className="truncate">Book This Tour</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm py-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex gap-2 p-3 flex-wrap justify-center">
                    <div
                      onClick={() => handleWindowClick(0, "overview")}
                      className={`flex h-8 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-full ${
                        currWindow === 0
                          ? "bg-primary/20 dark:bg-primary/30"
                          : "bg-white dark:bg-white/10"
                      } px-4`}
                    >
                      <p className="text-[#131811] dark:text-white text-sm font-medium leading-normal">
                        Overview
                      </p>
                    </div>
                    <div
                      onClick={() => handleWindowClick(1, "itinerary")}
                      className={`flex h-8 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-full ${
                        currWindow === 1
                          ? "bg-primary/20 dark:bg-primary/30"
                          : "bg-white dark:bg-white/10"
                      } px-4`}
                    >
                      <p className="text-[#131811] dark:text-white/80 text-sm font-medium leading-normal">
                        Itinerary
                      </p>
                    </div>
                    <div
                      onClick={() => handleWindowClick(2, "gallery")}
                      className={`flex h-8 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-full ${
                        currWindow === 2
                          ? "bg-primary/20 dark:bg-primary/30"
                          : "bg-white dark:bg-white/10"
                      } px-4`}
                    >
                      <p className="text-[#131811] dark:text-white/80 text-sm font-medium leading-normal">
                        Gallery
                      </p>
                    </div>
                    <div
                      onClick={() => handleWindowClick(3, "inclusions")}
                      className={`flex h-8 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-full ${
                        currWindow === 3
                          ? "bg-primary/20 dark:bg-primary/30"
                          : "bg-white dark:bg-white/10"
                      } px-4`}
                    >
                      <p className="text-[#131811] dark:text-white/80 text-sm font-medium leading-normal">
                        Inclusions
                      </p>
                    </div>
                    <div
                      onClick={() => handleWindowClick(4, "pricing")}
                      className={`flex h-8 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-full ${
                        currWindow === 4
                          ? "bg-primary/20 dark:bg-primary/30"
                          : "bg-white dark:bg-white/10"
                      } px-4`}
                    >
                      <p className="text-[#131811] dark:text-white/80 text-sm font-medium leading-normal">
                        Pricing
                      </p>
                    </div>
                    <div
                      onClick={() => handleWindowClick(5, "reviews")}
                      className={`flex h-8 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-full ${
                        currWindow === 5
                          ? "bg-primary/20 dark:bg-primary/30"
                          : "bg-white dark:bg-white/10"
                      } px-4`}
                    >
                      <p className="text-[#131811] dark:text-white/80 text-sm font-medium leading-normal">
                        Reviews
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
                      <div className="flex flex-1 gap-3 rounded border border-[#dee6db] dark:border-gray-700 bg-white dark:bg-white/5 p-4 flex-col">
                        <span className="material-symbols-outlined text-[#131811] dark:text-primary">
                          schedule
                        </span>
                        <div className="flex flex-col gap-1">
                          <h2 className="text-[#131811] dark:text-white text-base font-bold leading-tight">
                            {pkg?.dailyPlan?.length} Days
                          </h2>
                          <p className="text-[#6b8961] dark:text-gray-400 text-sm font-normal leading-normal">
                            Duration
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 gap-3 rounded border border-[#dee6db] dark:border-gray-700 bg-white dark:bg-white/5 p-4 flex-col">
                        <span className="material-symbols-outlined text-[#131811] dark:text-primary">
                          group
                        </span>
                        <div className="flex flex-col gap-1">
                          <h2 className="text-[#131811] dark:text-white text-base font-bold leading-tight">
                            {pkg?.maxGroupSize === 1
                              ? "Solo Traveler"
                              : pkg?.maxGroupSize === 2
                              ? "Couple"
                              : pkg?.maxGroupSize <= 5
                              ? `Small Group`
                              : `Large Group (Max ${pkg?.maxGroupSize})`}
                          </h2>
                          <p className="text-[#6b8961] dark:text-gray-400 text-sm font-normal leading-normal">
                            Travel Style
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 gap-3 rounded border border-[#dee6db] dark:border-gray-700 bg-white dark:bg-white/5 p-4 flex-col">
                        <span className="material-symbols-outlined text-[#131811] dark:text-primary">
                          map
                        </span>
                        <div className="flex flex-col gap-1">
                          <h2 className="text-[#131811] dark:text-white text-base font-bold leading-tight">
                            {pkg?.destinations?.length} Destinations
                          </h2>
                          <p className="text-[#6b8961] dark:text-gray-400 text-sm font-normal leading-normal">
                            Key Locations
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 gap-3 rounded border border-[#dee6db] dark:border-gray-700 bg-white dark:bg-white/5 p-4 flex-col">
                        <span className="material-symbols-outlined text-[#131811] dark:text-primary">
                          {pkg && retIcon(pkg?.categories)}
                        </span>
                        <div className="flex flex-col gap-1">
                          <h2 className="text-[#131811] dark:text-white text-base font-bold leading-tight">
                            {pkg?.categories?.[0]} &amp;{" "}
                            {pkg?.categories?.length > 1
                              ? pkg?.categories?.slice(1).join(", ")
                              : ""}
                          </h2>
                          <p className="text-[#6b8961] dark:text-gray-400 text-sm font-normal leading-normal">
                            Tour Type
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h2
                        id="overview"
                        className="text-[#131811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
                      >
                        Tour Overview
                      </h2>
                      <p className="text-[#131811]/80 dark:text-white/80 text-base leading-relaxed">
                        {pkg?.overview}
                      </p>
                    </div>
                    <div className="p-4">
                      <h2
                        id="itinerary"
                        className="text-[#131811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
                      >
                        Daily Itinerary
                      </h2>
                      <div className="space-y-6 border-l-2 border-primary/30 ml-3 pl-8">
                        {pkg?.dailyPlan?.map((dayPlan, index) => (
                          <div className="relative">
                            <div className="absolute -left-[38px] top-1 size-4 bg-primary rounded-full ring-8 ring-background-light dark:ring-background-dark" />
                            <h3 className="font-bold text-lg text-[#131811] dark:text-white">
                              Day {index + 1}: {dayPlan.actTitle}
                            </h3>
                            <p className="text-[#131811]/80 dark:text-white/70 mt-1 text-sm">
                              {dayPlan.actDescription}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Carousel (Image/Video Gallery) */}
                    <section id="gallery" className="mb-16">
                      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-4 -mx-4 px-4">
                        <div className="flex items-stretch gap-4">
                          {destinations &&
                            destinations.map((des, index) => (
                              <div className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-80">
                                <div
                                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                  data-alt="View from Little Adam's Peak overlooking lush green valleys."
                                  style={{
                                    backgroundImage: `url("${
                                      "/uploads/" + des.images[0]
                                    }")`,
                                  }}
                                />
                                <div>
                                  <p className="font-medium text-[#7a5c58]">
                                    {des.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {des.summary}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </section>
                    <div id="inclusions" className="p-4">
                      <h2 className="text-[#131811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 pt-5">
                        What's Included
                      </h2>
                      <div className="">
                        <ul className="space-y-3 grid grid-cols-2 gap-3">
                          {pkg &&
                            pkg?.includes &&
                            pkg?.includes.map((include, index) => (
                              <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary mt-0.5">
                                  check_circle
                                </span>
                                <span className="text-accent dark:text-white/80">
                                  {include}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                    <div id="reviews" className="p-4">
                      <h2 className="text-[#131811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 pt-5">
                        Traveler Reviews
                      </h2>
                      <div className="space-y-6">
                        {reviews
                          .filter((review) => review.planId === pkg?._id)
                          .map((review, index) => (
                            <div key={index} className="bg-white dark:bg-white/5 rounded-lg border border-[#dee6db] dark:border-gray-700 p-5">
                              <div className="flex items-center gap-4">
                                <img
                                  alt="Profile picture of Sarah K."
                                  className="w-12 h-12 rounded-full object-cover"
                                  src={getUserFromReview(review.userId, "img")}
                                />
                                <div>
                                  <h4 className="font-bold text-[#131811] dark:text-white">
                                    {getUserFromReview(review.userId, "name")}
                                  </h4>
                                  <div className="flex items-center text-primary">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <i
                                        key={i}
                                        className={`fa fa-star text-xl ${
                                          i < review.rating
                                            ? "text-yellow-500 "
                                            : ""
                                        } `}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="mt-3 text-[#131811]/80 dark:text-white/80 text-sm leading-relaxed">
                                "{review.reviewText}"
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div id="pricing" className="lg:col-span-1">
                    <div className="sticky top-24">
                      <div className="bg-white dark:bg-white/5 rounded border border-[#dee6db] dark:border-gray-700 p-6">
                        <p className="text-sm font-medium text-[#6b8961] dark:text-gray-400">
                          Starting from
                        </p>
                        <p className="text-3xl font-bold text-[#131811] dark:text-white mt-1">
                          {pkg?.price}{" "}
                          <span className="text-base font-normal text-[#6b8961] dark:text-gray-400">
                            Rs / person
                          </span>
                        </p>
                        <div className="mt-6 space-y-4">
                          <div>
                            <label
                              className="block text-sm font-medium text-[#131811] dark:text-white/90"
                              htmlFor="tour-date"
                            >
                              Select Date
                            </label>
                            <input
                              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-[#131811] dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              id="tour-date"
                              type="date"
                              value={startDate || ""}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={(e) => setStartDate(e.target.value)}
                              onFocus={() => setStartDateError(false)}
                            />
                            {startDateError && (
                              <div className="text-xs text-red-600 mt-1 italic">
                                Please select a valid start date.
                              </div>
                            )}
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium text-[#131811] dark:text-white/90"
                              htmlFor="travelers"
                            >
                              Travelers
                              <span className="text-xs text-primary ml-2">
                                (Must be between {pkg?.minGroupSize} and{" "}
                                {pkg?.maxGroupSize})
                              </span>
                            </label>
                            <input
                              className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark text-[#131811] dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              type="number"
                              id="travelers"
                              value={travelers}
                              onChange={(e) =>
                                setTravelers(parseInt(e.target.value, 10))
                              }
                              onFocus={() => setTravelersError(false)}
                            />
                            {travelersError && (
                              <div className="text-xs text-red-600 mt-1 italic">
                                Please enter a valid number of travelers between{" "}
                                {pkg?.minGroupSize} and {pkg?.maxGroupSize}.
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={handleBookNow}
                          className="mt-6 w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-accent text-secondary text-base font-bold leading-normal tracking-[0.015em]"
                        >
                          <span className="truncate">Book Now</span>
                        </button>
                        <p className="text-xs text-center text-[#6b8961] dark:text-gray-500 mt-3">
                          You won't be charged yet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </>
    );
}

export default PackageDetails;