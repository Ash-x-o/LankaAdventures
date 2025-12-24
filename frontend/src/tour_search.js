import React,{use, useEffect, useRef, useState} from "react";
import { Header ,Footer} from "./home";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function TourSearch() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
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
          console.log("Session data:", data.user);
          if (response.ok) {
            if (data.user) {
              setUser(data.user);
            } else {
              navigate("/login");
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      checkSession();
    }, []);

    const handlePkgClick = (pkg) => {
        // Navigate to package details page
        navigate("/package_details?id=" + pkg._id);
    };

    const [allTourPackages, setAllTourPackages] = useState([]);

    const fetchAllTourPackages = async () => {
        try {
            const response = await fetch("/api/tours/all-published", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAllTourPackages(data.tours);
            } else {
                console.error("Failed to fetch tour packages");
            }
        } catch (error) {
            console.error("Error fetching tour packages:", error);
        }
    };
    useEffect(() => {
        fetchAllTourPackages();
    }, []);

    const [allDestinations, setAllDestinations] = useState([]);
    const fetchAllDestinations = async () => {
        try {
            const response = await fetch("/api/destinations/all", {
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

    useEffect(() => {
        fetchAllDestinations();
    }, []);

    const getDestinationNameById = (id) => {
        const destination = allDestinations.find((dest) => dest._id === id);
        return destination ? destination.name : "Unknown";
    };

     const getIconFromCategory = (category) => {
        switch (category) {
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

    const [searchVal, setSearchVal] = useState("");
    const [filteredPackages, setFilteredPackages] = useState(allTourPackages);
    const filteredPkgInit =  useRef(false);

    useEffect(() => {
        if (!filteredPkgInit.current && allTourPackages && allTourPackages.length > 0) {
            console.log("Initializing filtered packages");
            setFilteredPackages(allTourPackages);
            filteredPkgInit.current = true;
        }
    }, [allTourPackages]);

    const handleSearchChange = () => {
        if (searchVal.trim() === "") {
            setFilteredPackages(allTourPackages);
            return;
        }
        const dest = allDestinations.find((d) => d.name.toLowerCase().includes(searchVal.toLowerCase()));
        const filtered = allTourPackages.filter((pkg) =>
            dest ? pkg.destinations.includes(dest._id) : false
        );
        setFilteredPackages(filtered);
    };

    useEffect(() => {
        handleSearchChange();
    }, [searchVal]);
    
    const [minVal, setMinVal] = useState(1);
    const [maxVal, setMaxVal] = useState(15);

    const [interests, setInterests] = useState([]);

    const [categories, setCategories] = useState([]);

    const arrangeCategories = () => {
        const uniqueCategories = new Set();
        allTourPackages.forEach((pkg) => {
            pkg.categories.forEach((cat) => uniqueCategories.add(cat));
            setCategories(Array.from(uniqueCategories));
        });
    };

    useEffect(() => {
        arrangeCategories();
    }, [allTourPackages]);

    const applyFilters = () => {

        const filtered = allTourPackages.filter((pkg) =>
            pkg.dailyPlan.length >= minVal && pkg.dailyPlan.length <= maxVal
            && (interests.length === 0 || interests.some(interest => pkg.categories.includes(interest)))
        );

        setFilteredPackages(filtered);
    };

    const resetFilters = () => {
        setMinVal(1);
        setMaxVal(15);
        setInterests([]);
        setFilteredPackages(allTourPackages);
        setSearchVal("");
    };
    
    const [numPages, setNumPages] = useState(1);

    useEffect(() => {
        const pages = Math.ceil(filteredPackages.length / 6);
        setNumPages(pages);
    }, [filteredPackages]);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastIndex, setLastIndex] = useState(6);
    const [firstIndex, setFirstIndex] = useState(0);

    useEffect(() => {
        const lastIdx = currentPage * 6;
        const firstIdx = lastIdx - 6;
        setLastIndex(lastIdx);
        setFirstIndex(firstIdx);
    }, [currentPage]);

    const [sortBy, setSortBy] = useState("popularity");

    useEffect(() => {
        let sortedPackages = [...filteredPackages];
        switch (sortBy) {
            case "popularity":
                sortedPackages.sort((a, b) => b.purchasesCount - a.purchasesCount);
                break;
            case "priceLowToHigh":
                sortedPackages.sort((a, b) => a.price - b.price);
                break;
            case "priceHighToLow":
                sortedPackages.sort((a, b) => b.price - a.price);
                break;
            case "duration":
                sortedPackages.sort((a, b) => a.dailyPlan.length - b.dailyPlan.length);
                break;
            default:
                break;
        }
        setFilteredPackages(sortedPackages);
    }, [sortBy]);    

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
      const fetchrating = async (id) => {
        try {
          const response = await fetch(`/api/reviews/all-reviews/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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
      fetchrating();
    }, []);
      


    const returnRatingStars = (id) => {
      const pkgReviews = reviews.filter((review) => review.planId._id === id);
      if (pkgReviews.length === 0) return 0.0;
      const avgRating =
        pkgReviews.reduce((sum, review) => sum + review.rating, 0) / pkgReviews.length;
      return avgRating.toFixed(1);
    };
      
    const isBestSeller = (pkg) => {
      const maxSeller = Math.max(...allTourPackages.map((p) => p.purchasesCount));
      return pkg.purchasesCount === maxSeller && maxSeller > 0;
    };


    return (
      <div className="font-display bg-off-white dark:bg-background-dark text-dark-charcoal dark:text-off-white">
        <Header user={user} />

        <div className="relative flex w-full min-h-screen">
          {/* SideNavBar / Filter Panel */}

          <aside className="sticky top-0 h-screen flex flex-col w-96 bg-background-light dark:bg-background-dark shadow-lg p-6 shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                  data-alt="LankaScapes logo with a stylized palm tree"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBW1H4HUZqUjIXZmTHIlGcyvnLFhCf6c9Sf6gXLFoQSHTTF6oygbogVUa2gwyf4o_AXEyOcpJqlKzs2EwiABxcIhRo8L_GN5fIuezp2hJ57fsITXpPN-_7wWveErmn1RuKccFg0RzRQv33ODh3VAL8YRTx71qu6oKUICThQYPxjS8N05obQ1yqGPCSknNiSiK_HaTPl93fjM0_BomxpJxCww0nr6O5etVVcEblKoFcbuA6p4o5sQHFqHjwF8pItabsWQ2PjkwMzG7k")',
                  }}
                />
                <div className="flex flex-col">
                  <h1 className="text-deep-forest-green dark:text-primary text-xl font-bold leading-normal">
                    LankaScapes
                  </h1>
                  <p className="text-earthy-brown dark:text-gray-300 text-sm font-normal leading-normal">
                    Travel &amp; Tours
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8 mt-8 flex-grow overflow-y-auto pr-2">
              {/* PageHeading inside sidebar */}
              <p className="text-deep-forest-green dark:text-primary text-3xl font-black leading-tight tracking-[-0.033em]">
                Find Your Sri Lankan Adventure
              </p>
              {/* SearchBar */}
              <div className="flex flex-col gap-2">
                <label className="text-deep-forest-green dark:text-gray-200 text-sm font-bold">
                  Destination or Keyword
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-400">
                    search
                  </span>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full dark:text-white focus:outline-0 focus:ring-0 border-2 border-accent/20 focus:border-accent bg-white dark:bg-gray-700 h-12 placeholder:text-earthy-brown/70 dark:placeholder:text-gray-400 pl-10 pr-4 text-base font-normal leading-normal"
                    placeholder="Kandy, Ella, Yala..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                </div>
              </div>

              {/* Slider */}
              <div className="flex flex-col gap-3">
                <label className="text-deep-forest-green dark:text-gray-200 text-sm font-bold">
                  Tour Duration (Days)
                </label>
                <div className="flex h-[38px] w-full p-2">
                  <Slider
                    range
                    min={1}
                    max={15}
                    values={[minVal, maxVal]}
                    trackStyle={{ backgroundColor: "#064e3b", height: 6 }}
                    handleStyle={{
                      borderColor: "#064e3b",
                      height: 16,
                      width: 16,

                      marginTop: -5,
                      backgroundColor: "#064e3b",
                    }}
                    railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
                    onChange={([min, max]) => {
                      setMinVal(min);
                      setMaxVal(max);
                    }}
                    marks={{
                      0: "0",
                      1: "1",
                      2: "2",
                      3: "3",
                      4: "4",
                      5: "5",
                      6: "6",
                      7: "7",
                      8: "8",
                      9: "9",
                      10: "10",
                      11: "11",
                      12: "12",
                      13: "13",
                      14: "14",
                      15: "15",
                    }}
                    markStyle={{ backgroundColor: "#6b7280" }}
                  />
                </div>
              </div>
              {/* Category Checkboxes */}
              <div className="flex flex-col gap-3">
                <label className="text-deep-forest-green dark:text-gray-200 text-sm font-bold">
                  Interests / Tour Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
                      <input
                        className="form-checkbox rounded text-deep-forest-green dark:text-primary focus:ring-deep-forest-green/50 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        type="checkbox"
                        value={category}
                        checked={interests.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, category]);
                          } else {
                            setInterests(
                              interests.filter((i) => i !== category)
                            );
                          }
                        }}
                      />
                      <span className="text-dark-charcoal dark:text-gray-300 text-sm">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {/* Filter Buttons */}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => applyFilters()}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-4 bg-deep-forest-green dark:bg-primary text-white dark:text-background-dark text-base font-bold leading-normal tracking-wide hover:opacity-90"
              >
                <span className="truncate">Apply Filters</span>
              </button>
              <button
                onClick={() => resetFilters()}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-transparent text-earthy-brown dark:text-gray-300 text-sm font-medium leading-normal hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              >
                <span className="truncate">Reset</span>
              </button>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-10 ">
              <section className="relative bg-deep-forest-green/90 dark:bg-deep-forest-green/50 rounded-lg p-8 mb-8 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAD_jWBs5zSWvlKBSDsvXrUxQFdeejKda6ElRzwrARoQS8kX9PSLwmjew2KAyJCmqFmXY8MnKVqNaEwLvQQKsDGLUuC1CEzgsYHPZmTT-MHNoPXFMBjZKDAFAIS0pZ4HATRzvxa0poD--mL1K5JuHwJ6cpVeDq8riDSIplPZRkYQLPPYPCY5PvLatLTo4DsfTnUTLm96QoHFu4O2bOjIubKcbKxdpW2TxcEHxNKzXKFgJkQbMCAUsPKKtwW8pjTE_S6pAFnx62qqg")',
                  }}
                />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                  <div className="text-off-white">
                    <h2 className="text-2xl font-bold mb-2">
                      Can't find the perfect tour?
                    </h2>
                    <p className="text-lg text-off-white/80">
                      Craft your own unique Sri Lankan journey from scratch with
                      our itinerary builder.
                    </p>
                  </div>
                  <a
                    className="flex-shrink-0 flex items-center justify-center gap-2 min-w-[84px] cursor-pointer overflow-hidden rounded-full h-12 px-6 bg-earthy-brown text-white text-base font-bold leading-normal tracking-wide hover:bg-warm-sand transition-colors duration-300 shadow-lg"
                    href="/custom_tour"
                  >
                    <span className="material-symbols-outlined">
                      edit_calendar
                    </span>
                    <span className="truncate">Build Your Itinerary</span>
                  </a>
                </div>
              </section>

              {/* Results Header */}
              <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold text-accent dark:text-off-white">
                  Showing {filteredPackages.length} tours in{" "}
                  <span className="text-deep-forest-green dark:text-primary">
                    Sri Lanka
                  </span>
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select className="form-select appearance-none rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark-charcoal dark:text-gray-300 pl-4 pr-10 py-2 focus:outline-none outline-none focus:ring-0 ring-0 focus:border-accent">
                      <option className="hover:bg-accent">
                        Sort by: Popularity
                      </option>
                      <option className="hover:bg-accent">
                        Sort by: Price (Low to High)
                      </option>
                      <option className="hover:bg-accent">
                        Sort by: Price (High to Low)
                      </option>
                      <option className="hover:bg-accent">
                        Sort by: Duration
                      </option>
                    </select>
                    {/* <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-earthy-brown dark:text-gray-400 pointer-events-none">
                      expand_more
                    </span> */}
                  </div>
                  {/* <button
                    className="p-2 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-deep-forest-green dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Switch to map view"
                  >
                    <span className="material-symbols-outlined">map</span>
                  </button> */}
                </div>
              </header>
              {/* Tour Package Grid */}
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* Tour Card 1 */}
                {filteredPackages && filteredPackages.length !== 0 ? (
                  filteredPackages.slice(firstIndex, lastIndex).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-background-light dark:bg-background-dark rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col group"
                      onClick={() => handlePkgClick(pkg)}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          data-alt="A scenic train crossing the Nine Arch Bridge in Ella, Sri Lanka"
                          style={{
                            backgroundImage: `url("/uploads/${pkg.images[0]}")`,
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        {isBestSeller(pkg) && (
                        <div className="absolute top-3 right-3 bg-warm-sand/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                          BEST SELLER
                        </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-deep-forest-green/80 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                          {returnRatingStars(pkg._id) !== 0.0 &&
                          <i className="fa fa-star text-yellow-400"></i>
                          }
                          {returnRatingStars(pkg._id) === 0.0
                            ? "No Reviews"
                            : returnRatingStars(pkg._id)}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-deep-forest-green dark:text-primary mb-2">
                          {pkg.name}
                        </h3>
                        <p className="text-earthy-brown dark:text-gray-400 text-sm mb-4">
                          {pkg.destinations
                            .map((destId) => getDestinationNameById(destId))
                            .join(" → ")}
                        </p>
                        <div className="flex items-center justify-between text-sm text-dark-charcoal dark:text-gray-300 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-earthy-brown dark:text-gray-400">
                              schedule
                            </span>{" "}
                            {pkg.dailyPlan.length} Days
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-earthy-brown dark:text-gray-400">
                              {getIconFromCategory(pkg.categories[0])}
                            </span>{" "}
                            {pkg.categories[0]}
                          </span>
                          <span className="font-bold text-lg text-deep-forest-green dark:text-primary">
                            Rs.{pkg.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-dark-charcoal dark:text-gray-300 text-lg col-span-full">
                    No tours found matching your criteria.
                  </p>
                )}
              </div>
              {/* Pagination */}
              <nav className="flex items-center justify-center mt-12 space-x-2">
                <button
                  onClick={() => {
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className="flex items-center justify-center size-10 rounded-full text-earthy-brown dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                {Array.from({ length: Math.min(4, numPages) }, (_, i) => {
                  const page = i + 1; // ✅ absolute page number

                  return (
                    <button
                      key={page}
                      className={`flex items-center justify-center size-10 rounded-full font-bold ${
                        currentPage === page
                          ? `bg-accent text-white hover:opacity-90`
                          : `text-accent hover:bg-accent/10`
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Ellipsis */}
                {numPages > 4 && (
                  <span className="text-slate-gray dark:text-gray-400">
                    ...
                  </span>
                )}

                {/* Last page */}
                {numPages > 4 && (
                  <button
                    className={`flex items-center justify-center size-10 rounded-full font-bold ${
                      currentPage === numPages
                        ? `bg-accent text-white hover:opacity-90`
                        : `text-accent hover:bg-accent/10`
                    }`}
                    onClick={() => setCurrentPage(numPages)}
                  >
                    {numPages}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (currentPage < numPages) setCurrentPage(currentPage + 1);
                  }}
                  className="flex items-center justify-center size-10 rounded-full text-earthy-brown dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    );
}
export default TourSearch;