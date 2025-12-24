import React, { use, useState,useEffect } from "react";
import { Footer, Header } from "./home";
import { useNavigate } from "react-router-dom";
import EleBg from './images/elephant_bg.png'

function Destinations() {
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
    
    const [destinations, setDestinations] = useState([])

    const [categoryList, setCategoryList] = useState([]);
    const [regionList, setRegionList] = useState([]);

    const [searchRequest, setSearchRequest] = useState("");
    const [categoryFilters, setCategoryFilters] = useState([]);
    const [regionFilter, setRegionFilter] = useState("All Regions");

    const [filteredDestinations, setFilteredDestinations] = useState(destinations);
    const [filterDesSet, setFilterDesSet] = useState(false);

    // get all destinations

    const fetchDestinations = async () => {
        // Fetch destinations from an API or database
        const response = await fetch('/api/destinations/all', { method: 'GET' })
        if (response.ok) {
            const data = await response.json()
            setDestinations(data.destinations)
            if(!filterDesSet){
                setFilteredDestinations(data.destinations)
                setFilterDesSet(true);
            }
        }
        
        
    }

    useEffect(() => {
        fetchDestinations();
    }, []);

    // get all categories
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

    //get all regions
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

        const handleCheckboxChange = (category) => {
            if(categoryFilters.includes(category)){
                setCategoryFilters(categoryFilters.filter((cat) => cat !== category));
            } else {
                setCategoryFilters([...categoryFilters, category]);
            }
        }

        
        const handleSearch = () => {
        const query = searchRequest.toLowerCase();

        const filtered = destinations.filter((des) => {
            const matchesName = des.name.toLowerCase().includes(query);

            const matchesRegion =
                regionFilter === 'All Regions' || des.region === regionFilter;

           const matchesCategory =
                categoryFilters.length === 0 ||  // no filters selected
                categoryFilters.some(cat => des.categories.includes(cat));

            

            return matchesName && matchesRegion && matchesCategory ;
        });

        setFilteredDestinations(filtered);
    };

    useEffect(() => {
        console.log("Destinations updated:", filteredDestinations);
    }, [destinations]);

    const [numPages, setNumPages] = useState(1);
    
    useEffect(() => {
      const pages = Math.ceil(filteredDestinations.length / 6);
      setNumPages(pages);
    }, [filteredDestinations]);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastIndex, setLastIndex] = useState(6);
    const [firstIndex, setFirstIndex] = useState(0);

    useEffect(() => {
      const lastIdx = currentPage * 6;
      const firstIdx = lastIdx - 6;
      setLastIndex(lastIdx);
      setFirstIndex(firstIdx);
    }, [currentPage]);
    
    
    return (
      <div className="bg-light-beige dark:bg-background-dark text-slate-gray dark:text-gray-300 font-display">
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Sri Lanka Adventures - Destinations</title>
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
          dangerouslySetInnerHTML={{
            __html:
              "\n    body {\n      font-family: 'Be Vietnam Pro', sans-serif;\n    }\n  ",
          }}
        />
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            {/* TopNavBar */}
            <Header user={user} />
            {/* HeroSection */}
            <div className="w-full">
              <div
                className="flex min-h-[400px] md:min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-4 text-center"
                data-alt="A lush, green tea plantation in the hills of Sri Lanka under a blue sky."
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtaDNG0_oTQJF4HpmSfhTXzZ9NWFxf18Kyg3JgnoluUXWv1sUvwV71f-Y84PqiMy743XsmcKPgcsSV8zIYRRhzORgSjPFzM7Gd2-Gxw_x9CqXIGoUUsjxwJ7wjyHqWG-QN7A94Y5fTb_s3VVlrvRjtQgrRVuhOYEbNuGKSN3vsahPgtfd3Fq-G5NI1x3ytDUiD7UpjUkngc5quscAHEZenU7IXw4MPA4a7EG6zMr144QvVuKbZ_UDqn2_ATi9UkRp4YexW6dWQQPw")',
                }}
              >
                <div className="flex flex-col gap-2">
                  <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
                    Explore the Wonders of Sri Lanka
                  </h1>
                  <h2 className="text-white text-sm md:text-lg font-normal leading-normal max-w-2xl mx-auto">
                    From ancient ruins to pristine beaches, find your next
                    adventure here.
                  </h2>
                </div>
              </div>
            </div>
            {/* Featured Destinations Carousel */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-forest-green dark:text-primary text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-4">
                Featured Destinations
              </h2>
              <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4">
                <div className="flex items-stretch p-4 gap-4">
                  {/* Carousel Card 1 */}
                  {destinations.length > 0 &&
                    destinations.slice(0, 4).map((destination) => (
                      <div className="flex h-full flex-1 flex-col gap-4 rounded bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-shadow duration-300 min-w-64">
                        <div
                          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-t flex flex-col"
                          data-alt="The ancient Sigiriya Rock Fortress rising above the jungle canopy."
                          style={{
                            backgroundImage: `url("/uploads/${destination.images[0]}")`,
                          }}
                        />
                        <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                          <div>
                            <p className="text-slate-gray dark:text-gray-200 text-base font-bold leading-normal">
                              {destination.name}
                            </p>
                            <p className="text-slate-gray/70 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-3">
                              {destination.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/* Main Content: Filters + Destination Grid */}
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filter Panel */}
              <aside className="lg:col-span-1 lg:sticky top-28 h-fit">
                <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-md space-y-6">
                  <h3 className="text-xl font-bold text-forest-green dark:text-primary">
                    Find a Destination
                  </h3>
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-light-beige dark:bg-slate-700 focus:ring-2 focus:ring-earthy-brown dark:focus:ring-primary focus:border-transparent"
                      placeholder="Search destinations..."
                      type="text"
                      value={searchRequest}
                      onChange={(e) => setSearchRequest(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <span
                      onClick={() => handleSearch()}
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      search
                    </span>
                  </div>
                  {/* Category Filters */}
                  <div>
                    <h4 className="font-bold text-slate-gray dark:text-gray-300 mb-3">
                      Categories
                    </h4>
                    <div className="space-y-2">
                      {categoryList.map((category, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            className="w-4 h-4 rounded  text-primary bg-neutral-secondary-medium border-default-medium focus:ring-primary dark:focus:ring-primary ring-offset-neutral-primary focus:ring-2"
                            type="checkbox"
                            onChange={() => handleCheckboxChange(category)}
                          />{" "}
                          <span>{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Region Selector */}
                  <div>
                    <h4 className="font-bold text-slate-gray dark:text-gray-300 mb-3">
                      Regions
                    </h4>
                    <select
                      onChange={(e) => setRegionFilter(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded bg-light-beige dark:bg-slate-700 focus:ring-2 focus:ring-earthy-brown dark:focus:ring-primary focus:border-transparent"
                    >
                      <option value="All Regions">All Regions</option>
                      {regionList.map((region, index) => (
                        <option key={index} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </aside>
              {/* Destination Grid */}
              <section className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Destination Card 1 */}
                  {filteredDestinations
                    .slice(firstIndex, lastIndex)
                    .map((destination) => (
                      <div
                        onClick={() =>
                          navigate(`/destination_details?id=${destination._id}`)
                        }
                        key={destination.id}
                        className="group hover:scale-101 transition-all duration-300 flex flex-col rounded bg-white dark:bg-slate-800 shadow-md  overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                      >
                        <div
                          className="w-full h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300 overflow-hidden "
                          data-alt={destination.name}
                          style={{
                            backgroundImage: `url("/uploads/${
                              destination.images[destination.coverIndex]
                            }")`,
                          }}
                        />
                        <div className="p-4 flex flex-col flex-grow">
                          <h4 className="text-lg font-bold text-slate-gray dark:text-gray-200">
                            {destination.name}
                          </h4>
                          <p className="text-sm text-slate-gray/80 dark:text-gray-400 mt-1 flex-grow">
                            {destination.summary}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {destination.categories.map((category, index) => (
                              <span
                                key={index}
                                className="text-xs font-semibold bg-earthy-brown/20 text-earthy-brown dark:bg-primary/20 dark:text-primary/90 px-2 py-1 rounded-full"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                          <button className="w-full mt-4 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-accent/10 dark:bg-primary/20 text-accent dark:text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-accent hover:text-secondary transition-all duration-300 dark:hover:bg-primary/30">
                            Learn More
                          </button>
                        </div>
                      </div>
                    ))}
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
                      if (currentPage < numPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className="flex items-center justify-center size-10 rounded-full text-earthy-brown dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </nav>
              </section>
            </main>
            {/* CTA Section */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div
                className="bg-white dark:bg-slate-800 rounded p-8 md:p-12 text-center shadow-xl"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${EleBg})` }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-[-0.015em]">
                  Ready to go?
                </h2>
                <p className="mt-2 text-white text-base md:text-lg font-normal leading-normal max-w-2xl mx-auto">
                  Now that you've explored the destinations, let us craft the
                  perfect journey for you. Browse our curated tour packages.
                </p>
                <button className="mt-6 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-5 bg-forest-green text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-forest-green/90 dark:bg-primary dark:text-background-dark dark:hover:bg-primary/90 mx-auto">
                  <span className="truncate">Browse Our Sri Lanka Tours</span>
                </button>
              </div>
            </section>
          </div>
          <Footer />
        </div>
      </div>
    );
}

export default Destinations;
