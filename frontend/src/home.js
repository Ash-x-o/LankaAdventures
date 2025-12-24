import React, { use, useEffect,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      async function checkSession() {
        try {
          const response = await fetch("/api/users/check-session", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for authentication
          });
          const data = await response.json();
          if (response.ok) {
            if (data.user) {
              setUser(data.user);
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      checkSession();
    }, []);

    const [tourPackages, setTourPackages] = useState([]);
    useEffect(() => {
        const fetchTourPackages = async () => {
            try {
                const response = await fetch('/api/tours/all-published', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setTourPackages(data.tours);
                } else {
                    console.error('Failed to fetch tour packages');
                }
            } catch (error) {
                console.error('Error fetching tour packages:', error);
            }
        };
        fetchTourPackages();
    }, []);

    const [destinations, setDestinations] = useState([]);
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await fetch(
                  "/api/destinations/all-published",
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }
                );
                if (response.ok) {
                    const data = await response.json();
                    setDestinations(data.destinations);
                } else {
                    console.error('Failed to fetch destinations');
                }
            } catch (error) {
                console.error('Error fetching destinations:', error);
            }
        };
        fetchDestinations();
    }, []);


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
        const response = await fetch("/api/users/all-reviewed-useres", {
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
    if(reviewedUsers.length === 0) return null;
    const user = reviewedUsers.find((user) => user._id === userId);
    if(req === "name"){
        return user ? user.userName : "Unknown User";
    } else if(req === "img"){
      return user && user.profileImg ? `/uploads/${user.profileImg}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    }
    
  };  
  
  
      const returnRatingStars = (id) => {
        const pkgReviews = reviews.filter((review) => review.planId._id === id);
        if (pkgReviews.length === 0) return 0.0;
        const avgRating =
          pkgReviews.reduce((sum, review) => sum + review.rating, 0) / pkgReviews.length;
        return avgRating.toFixed(1);
      };


    return (
      <div className="font-display group/design-root">
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>
          Lanka Adventures - Your Unforgettable Sri Lankan Adventure
        </title>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <style
          type="text/tailwindcss"
          dangerouslySetInnerHTML={{
            __html:
              "\n        body {\n            @apply font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark;\n        }\n    ",
          }}
        />
        <div className="layout-container flex h-full grow flex-col">
          <Header user={user} />
          <main className="flex-1">
            {/* Hero Section */}
            <section className="relative flex h-[75vh] min-h-[480px] w-full items-center justify-center">
              <div className="absolute inset-0 z-0 h-full w-full">
                <video
                  autoPlay=""
                  className="h-full w-full object-cover"
                  loop=""
                  muted=""
                  playsInline=""
                  poster="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                >
                  <source
                    src="https://assets.mixkit.co/videos/preview/mixkit-train-passing-through-a-green-landscape-in-sri-lanka-43186-large.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 p-4 text-center text-white">
                <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                  Your Unforgettable Sri Lankan Adventure Awaits
                </h1>
                <p className="text-lg font-normal leading-normal md:text-xl">
                  Discover curated, authentic experiences designed just for you.
                </p>
                <button
                  onClick={() => navigate("/tour_search")}
                  className="mt-2 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-accent text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
                >
                  <span className="truncate">Explore Our Tours</span>
                </button>
              </div>
            </section>
            {/* Featured Packages Section */}
            <section className="py-16 sm:py-24">
              <div className="mx-auto max-w-7xl px-6">
                <h2 className="mb-10 text-center text-3xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
                  Discover Our Signature Tours
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {/* Card 1 */}
                  {tourPackages &&
                    tourPackages.length !== 0 &&
                    tourPackages.slice(0, 6).map((tour) => (
                      <div
                        onClick={() =>
                          navigate("/package_details?id=" + tour._id)
                        }
                        key={tour.id}
                        className=" cursor-pointer flex flex-col overflow-hidden rounded-lg bg-white dark:bg-background-dark/50 shadow-lg transition-shadow hover:shadow-xl"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            alt="Ancient ruins in Sri Lanka"
                            className="h-56 w-full object-cover hover:scale-105 transition-transform duration-300"
                            src={`/uploads/${tour.images[0]}`}
                          />
                          <div className="absolute bottom-3 left-3 bg-deep-forest-green/80 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                            {returnRatingStars(tour._id) !== 0.0 && (
                              <i className="fa fa-star text-yellow-400"></i>
                            )}
                            {returnRatingStars(tour._id) === 0.0
                              ? "No Reviews"
                              : returnRatingStars(tour._id)}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary">
                              {tour.name}
                            </h3>
                            <p className="mt-3 text-base text-text-subtle-light dark:text-text-subtle-dark">
                              {tour.summary}
                            </p>
                          </div>
                          <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm font-medium text-text-light dark:text-text-dark">
                              {tour.dailyPlan.length} Days - from Rs.{" "}
                              {tour.price}
                            </p>
                            <a
                              className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-opacity-90"
                              href="#"
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </section>
            {/* Featured Destinations Grid */}
            {destinations && destinations.length !== 0 && (
              <section className="bg-white py-16 dark:bg-background-dark/50 sm:py-24">
                <div className="mx-auto max-w-7xl px-6">
                  <h2 className="mb-10 text-center text-3xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
                    Explore Iconic Destinations
                  </h2>
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-4 md:gap-6">
                    <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-lg">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        data-alt="Sigiriya Rock Fortress"
                        src={`/uploads/${destinations[1]?.images[0]}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h3 className="text-2xl font-bold">
                          {destinations[1]?.name}
                        </h3>
                        <p className="mt-1 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {destinations[1]?.summary}
                        </p>
                      </div>
                    </div>
                    <div className="group relative col-span-1 overflow-hidden rounded-lg">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        data-alt="Nine Arch Bridge in Ella"
                        src={`/uploads/${destinations[2]?.images[0]}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-xl font-bold">
                          {destinations[2]?.name}
                        </h3>
                        <p className="mt-1 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {destinations[2]?.summary}
                        </p>
                      </div>
                    </div>
                    <div className="group relative col-span-1 overflow-hidden rounded-lg">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        data-alt="Galle Fort Lighthouse"
                        src={`/uploads/${destinations[3]?.images[0]}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-xl font-bold">
                          {destinations[3]?.name}
                        </h3>
                        <p className="mt-1 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {destinations[3]?.summary}
                        </p>
                      </div>
                    </div>
                    <div className="group relative col-span-2 overflow-hidden rounded-lg">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        data-alt="A beach in Mirissa with palm trees"
                        src={`/uploads/${destinations[4]?.images[0]}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h3 className="text-2xl font-bold">
                          {destinations[4]?.name}
                        </h3>
                        <p className="mt-1 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {destinations[4]?.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            {/* Testimonials Carousel */}
            <section className="py-16 sm:py-24">
              <div className="mx-auto max-w-7xl px-6">
                <h2 className="mb-10 text-center text-3xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
                  What Our Travelers Say
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {reviews &&
                    reviews.length !== 0 &&
                    reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-white p-8 shadow-md dark:bg-background-dark/50"
                      >
                        <div className="flex items-center">
                          <img
                            alt="Photo of Emily Carter"
                            className="h-12 w-12 rounded-full object-cover"
                            src={getUserFromReview(review.userId, "img")}
                          />
                          <div className="ml-4">
                            <h4 className="font-bold text-text-light dark:text-text-dark">
                              {getUserFromReview(review.userId, "name")}
                            </h4>
                            <div className="flex items-center text-accent">
                              {Array.from({ length: 5 }, (_, i) => (
                                <i
                                  key={i}
                                  className={`fa fa-star text-xl ${
                                    i < review.rating ? "text-yellow-500 " : ""
                                  } `}
                                ></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-text-subtle-light dark:text-text-subtle-dark">
                          "{review.reviewText}"
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    );
}

export default Home;

export function Header({admin, user}) {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if(user || admin){
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [user, admin]);

    const navigate = useNavigate();
    const handleSignInClick = () => {
        navigate('/login');
    };

    const handleDashboardClick = () => {
        if(user && user.role === 'admin'){
            navigate('/admin_dashboard');
        } else {
            navigate('/customer_dashboard');
        }
    };

    const [notificationOpend, setNotificationOpened] = useState(false);
    const notifiPanelRef = useRef();

    const handleNotifiClick = () => {
        setNotificationOpened(!notificationOpend);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifiPanelRef.current && !notifiPanelRef.current.contains(event.target)) {
                setNotificationOpened(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if(user || admin){
            const fetchNotifications = async () => {
                try {
                    const response = await fetch(
                      `/api/notifications/notifications-by-user/${user ? user._id : admin ? admin._id : ''}`,
                      {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        // Handle the fetched notifications data
                        setNotifications(data.notifications);
                    } else {
                        console.error("Failed to fetch notifications");
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            };

            fetchNotifications();
        }
    }, [user, admin]);


    function timeAgo(dateString) {
      const now = new Date();
      const past = new Date(dateString);

      const seconds = Math.floor((now - past) / 1000);

      if (seconds < 60) return `${seconds} seconds ago`;

      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minutes ago`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hours ago`;

      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} days ago`;

      const weeks = Math.floor(days / 7);
      if (weeks < 4) return `${weeks} weeks ago`;

      const months = Math.floor(days / 30);
      if (months < 12) return `${months} months ago`;

      const years = Math.floor(days / 365);
      return `${years} years ago`;
    }

    const getIcon = (type) => {
      switch(type) {
        case 'tour booking':
            return 'calendar_month';
        case 'payment':
            return 'payments';
        case 'account':
            return 'account_circle';
        default:
            return 'notifications';
      }
    };

    const changeNotifiStatus = async (notification) => {
        try {
            const response = await fetch(
                `/api/notifications/mark-as-read/${notification._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
                navigateToNotifi(notification.type);
            }
        } catch (error) {
            console.error("Error changing notification status:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                `/api/notifications/mark-all-as-read/${user ? user._id : admin ? admin._id : ''}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error("Error changing notification status:", error);
        }
    };

    const navigateToNotifi = (type) => {
        switch(type) {
            case 'tour booking':
                if(user && user.role === 'admin')
                    navigate('/admin_dashboard?section=tourBookings');
                else
                    navigate('/customer_dashboard');
                break;
            case 'payment':
                if(user && user.role === 'admin')
                    navigate("/admin_dashboard?section=finance");
                else
                navigate('/customer_dashboard');
                break;
            case 'account':
                if(user && user.role === 'admin')
                    navigate('/admin_dashboard?section=settings');
                else
                navigate('/customer_dashboard');
                break;
            default:
                break;
        }
    };

    const hasUnreadNotifications = () =>{ 
        if(!notifications && notifications.length === 0) return false;
        return notifications.some(notification => !notification.isRead);
    };


    return (
      <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-solid border-primary/20 rounded-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between whitespace-nowrap px-6 py-4">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-8">
              <span className="material-symbols-outlined text-3xl text-deep-forest-green dark:text-off-white">
                explore
              </span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">
              Lanka Adventures
            </h2>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-8">
              <a
                className="text-sm font-medium leading-normal text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary"
                href="/"
              >
                Home
              </a>
              <a
                className="text-sm font-medium leading-normal text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary"
                href="/tour_search"
              >
                Tours
              </a>
              <a
                className="text-sm font-medium leading-normal text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary"
                href="/destinations"
              >
                Destinations
              </a>
              <a
                className="text-sm font-medium leading-normal text-text-light hover:text-primary dark:text-text-dark dark:hover:text-primary"
                href="/about_us"
              >
                About Us
              </a>
            </nav>

            {loggedIn ? (
              // <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
              //     onClick={handleSignInClick}>
              //     <span className="truncate">Sign Out</span>
              // </button>
              <div className="flex gap-4 items-center">
                <div
                  className="relative flex flex-col items-center gap-1 cursor-pointer"
                  onClick={() => handleNotifiClick()}
                >
                  <i
                    className="fa fa-bell-o text-[16px]"
                    aria-hidden="true"
                  >{hasUnreadNotifications() && <span className="w-2 h-2 bg-primary rounded-full absolute top-0 right-0"></span>}</i>
                  {notificationOpend && (
                    <div
                      ref={notifiPanelRef}
                      onClick={(e) => e.stopPropagation(e)}
                      className="absolute py-4 flex flex-col top-full min-w-96 flex justify-between items-center text-sm right-2 shadow-lg bg-white rounded"
                    >
                      <div className="px-4 flex justify-between w-full border-b pb-2">
                        <h1 className="text-xs flex items-center ">
                          <i
                            className="fa fa-bell-o mr-1"
                            aria-hidden="true"
                            style={{ fontSize: "12px" }}
                          ></i>
                          Notifications
                        </h1>
                        <h1
                          onClick={() => markAllAsRead()}
                          className="text-xs flex items-center text-primary"
                        >
                          <span
                            className="material-symbols-outlined text text-sm"
                            style={{ fontSize: "16px" }}
                          >
                            done_all
                          </span>
                          Mark all as read
                        </h1>
                      </div>
                      <div className="w-full">
                        <ul className="w-full">
                          {notifications && notifications.length !== 0 ? (
                            notifications.map((notification) => (
                              <li
                                onClick={() => changeNotifiStatus(notification)}
                                className={`flex items-center px-4 text-xs py-2 border-t ${
                                  notification.isRead
                                    ? ""
                                    : "bg-primary/20 hover:bg-primary/30"
                                } hover:bg-primary/10 cursor-pointer`}
                                key={notification._id}
                              >
                                <div className="flex justify-center items-center bg-primary/10 rounded-full h-6 w-6 p-6">
                                  <span className="text-center material-symbols-outlined">
                                    {getIcon(notification.type)}
                                  </span>
                                </div>
                                <p
                                  className={`ml-2 break-words whitespace-normal ${
                                    notification.isRead ? "" : "font-bold"
                                  }`}
                                >
                                  {notification.message}
                                  <p className="text text-[10px] text-gray-500">
                                    {timeAgo(notification.date)}
                                  </p>
                                </p>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center px-4 text-xs py-2 border-t hover:bg-primary/10 cursor-pointer ">
                              No new notifications
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="flex flex-col items-center gap-1 cursor-pointer"
                  onClick={() => handleDashboardClick()}
                >
                  <i class="fa fa-user-circle-o text-[16px]" aria-hidden="true" ></i>

                  {/* <span className="text-xs font-medium leading-normal text-text-light dark:text-text-dark">
                            {admin ? admin.userName : user ? user.userName : 'User'}
                            </span> */}
                </div>
              </div>
            ) : (
              <button
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
                onClick={handleSignInClick}
              >
                <span className="truncate">Sign In</span>
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button className="flex items-center justify-center rounded-full p-2 text-text-light dark:text-text-dark hover:bg-primary/20">
              <span className="material-symbols-outlined" data-icon="menu">
                menu
              </span>
            </button>
          </div>
        </div>
      </header>
    );
}

export function Footer() {
  const navigate = useNavigate();
    return (
        <footer className="bg-primary/10 dark:bg-primary/20 text-text-subtle-light dark:text-text-subtle-dark">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                <div className="col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-3 text-primary">
                    <div className="size-7">
                        <svg
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            clipRule="evenodd"
                            d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                            fill="currentColor"
                            fillRule="evenodd"
                        />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">
                        Lanka Adventures
                    </h2>
                    </div>
                    <p className="mt-4 text-sm">
                    Crafting bespoke journeys to the heart of Sri Lanka. Let's create
                    your next unforgettable story.
                    </p>
                    <div className="mt-6 flex space-x-4">
                    <a className="hover:text-primary" href="/">
                        <svg
                        aria-hidden="true"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path
                            clipRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            fillRule="evenodd"
                        />
                        </svg>
                    </a>
                    <a className="hover:text-primary" href="#">
                        <svg
                        aria-hidden="true"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                    </a>
                    <a className="hover:text-primary" href="#">
                        <svg
                        aria-hidden="true"
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        >
                        <path
                            clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2 12.25a4.25 4.25 0 108.5 0 4.25 4.25 0 00-8.5 0zm.25-4.25a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm-2.5 4.25a6.75 6.75 0 1013.5 0 6.75 6.75 0 00-13.5 0z"
                            fillRule="evenodd"
                        />
                        </svg>
                    </a>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase text-text-light dark:text-text-dark">
                    Quick Links
                    </h3>
                    <ul className="mt-4 space-y-2">
                    <li>
                        <a className="text-sm hover:text-primary" href="/">
                        Home
                        </a>
                    </li>
                    <li>
                        <a className="text-sm hover:text-primary" href="/tour_search">
                        Tours
                        </a>
                    </li>
                    <li>
                        <a className="text-sm hover:text-primary" href="/destinations">
                        Destinations
                        </a>
                    </li>
                    <li>
                        <a className="text-sm hover:text-primary" href="/about">
                        About Us
                        </a>
                    </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase text-text-light dark:text-text-dark">
                    Contact
                    </h3>
                    <ul className="mt-4 space-y-2">
                    <li>
                        <a
                        className="text-sm hover:text-primary"
                        href="mailto:hello@lankaadventures.com"
                        >
                        hello@lankaadventures.com
                        </a>
                    </li>
                    <li>
                        <a
                        className="text-sm hover:text-primary"
                        href="tel:+94112345678"
                        >
                        +94 112 345 678
                        </a>
                    </li>
                    <li>
                        <span className="text-sm">Colombo, Sri Lanka</span>
                    </li>
                    </ul>
                </div>
                <div className="col-span-2 md:col-span-4 lg:col-span-1">
                    <h3 className="text-sm font-bold uppercase text-text-light dark:text-text-dark">
                    Newsletter
                    </h3>
                    <p className="mt-4 text-sm">
                    Get travel inspiration and special offers.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-accent text-secondary rounded" onClick={() => navigate('/login')}>Sign Up</button>
                </div>
                </div>
                <div className="mt-12 border-t border-primary/20 pt-8 text-center text-sm">
                <p>© 2024 Lanka Adventures. All Rights Reserved.</p>
                </div>
            </div>
            </footer>
    )
}