import { Footer, Header } from "./home";
import React, {useEffect, useState, useRef}from "react";
import { useNavigate } from "react-router-dom";

function DestinationDetails() {
    const [user, setUser] = useState(null);
        
    useEffect(() => {
      async function checkSession() {
        try {
          const response = await fetch("/api/users/check-session", {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Session data:", data);
            if (data.loggedIn) {
              setUser(data.user);
            } else {
              navigate("/login");
            }
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      }
      checkSession();
    }, []);
    const navigate = useNavigate();

    const [destination, setDestination] = useState(null)

    const queryParams = new URLSearchParams(window.location.search);
    const destinationId = queryParams.get('id');

    useEffect(() => {
        async function fetchDestination() {
            try {
                const response = await fetch(
                  `/api/destinations/get-by/${destinationId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setDestination(data.destination);
                } else {
                    console.error('Failed to fetch destination details');
                }
            } catch (error) {
                console.error('Error fetching destination details:', error);
            }
        }
        fetchDestination();
    }, [destinationId]);

    const [imageGroups, setImageGroups] = useState([]);
        
    useEffect(() => {
      const allImages = destination?.images || [];
      const groupedImages = chunkImages(allImages, 6);
      setImageGroups(groupedImages);
    }, [destination]);

    const chunkImages = (images, size) => {
      const chunks = [];
      for (let i = 0; i < images.length; i += size) {
        chunks.push(images.slice(i, i + size));
      }
      return chunks;
    };
    

    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-[#333333] dark:text-gray-200">
        <div className="relative w-full">
          {/* TopNavBar */}
          <Header user={user} />
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            {/* HeroSection */}
            <section className="mb-16">
              <div
                className="w-full min-h-[500px] flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 text-center"
                data-alt="A lush green tea plantation in Ella, Sri Lanka, with misty mountains in the background."
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url(${
                    destination !== null && "/uploads/" + destination.images[0]
                  })`,
                }}
              >
                <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter">
                  {destination ? destination.name : "Loading..."}
                </h1>
                <h2 className="text-white/90 text-base md:text-lg font-normal max-w-3xl">
                  {destination ? destination.summary : "Loading Summary..."}
                </h2>
              </div>
            </section>
            {/* BodyText Introduction */}
            <section className="mb-16">
              <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto">
                {destination
                  ? destination.description
                  : "Loading Description..."}
              </p>
            </section>
            <div className="p-4">
              <h2 className="text-[#131811] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4 pt-5">
                Gallery
              </h2>
              {destination?.images &&
                destination?.images.length > 0 &&
                imageGroups &&
                imageGroups.length > 0 &&
                imageGroups.map((group, grpIndex) => (
                  <div
                    key={grpIndex}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  >
                    <div className="col-span-2 row-span-2">
                      <img
                        alt="Majestic Sigiriya Rock Fortress"
                        className="h-full w-full object-cover rounded-lg"
                        src={`/uploads/${group[0]}`}
                      />
                    </div>
                    {group.slice(1).map((img, index) => (
                      <div>
                        <img
                          alt=""
                          className="h-full w-full object-cover rounded-lg"
                          src={`/uploads/${img}`}
                        />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            {/* Tabs (Information Panel) */}
            <section className="mb-16">
              <div className="border-b border-gray-200/80 dark:border-gray-700/80">
                <nav className="flex -mb-px gap-8">
                  <a
                    className="flex items-center justify-center border-b-2 border-[#2d5a2f] dark:border-primary text-[#2d5a2f] dark:text-primary py-3"
                    href="#"
                  >
                    <p className="text-sm font-bold tracking-wide">Overview</p>
                  </a>
                  <a
                    className="flex items-center justify-center border-b-2 border-transparent text-gray-500 hover:text-[#7a5c58] hover:border-[#7a5c58]/50 dark:text-gray-400 dark:hover:text-primary dark:hover:border-primary/50 py-3"
                    href="#"
                  >
                    <p className="text-sm font-bold tracking-wide">
                      History &amp; Culture
                    </p>
                  </a>
                  <a
                    className="flex items-center justify-center border-b-2 border-transparent text-gray-500 hover:text-[#7a5c58] hover:border-[#7a5c58]/50 dark:text-gray-400 dark:hover:text-primary dark:hover:border-primary/50 py-3"
                    href="#"
                  >
                    <p className="text-sm font-bold tracking-wide">
                      Things to Do
                    </p>
                  </a>
                </nav>
              </div>
              <div className="pt-8">
                <p className="text-base leading-relaxed">
                  Ella's fame stems from its breathtaking natural beauty. It is
                  most famous for the stunning views from Ella Rock and Little
                  Adam's Peak, the iconic Nine Arch Bridge, and the surrounding
                  verdant tea plantations. The town itself has a vibrant,
                  bohemian atmosphere, with a great selection of cafes and
                  restaurants serving both local and international cuisine. It's
                  a key stop on the scenic Kandy to Ella train ride, often
                  described as one of the most beautiful train journeys in the
                  world.
                </p>
              </div>
            </section>
            {/* Iconography List (Practical Information) */}
            <section className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <span className="material-symbols-outlined text-[#7a5c58] text-3xl mt-1">
                    calendar_month
                  </span>
                  <div>
                    <h3 className="font-bold text-[#2d5a2f] dark:text-primary">
                      Best Time to Visit
                    </h3>
                    <p className="text-sm leading-normal mt-1">
                      The dry season, from January to March, offers the best
                      weather for hiking and sightseeing.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <span className="material-symbols-outlined text-[#7a5c58] text-3xl mt-1">
                    train
                  </span>
                  <div>
                    <h3 className="font-bold text-[#2d5a2f] dark:text-primary">
                      Getting There
                    </h3>
                    <p className="text-sm leading-normal mt-1">
                      Take the scenic train from Kandy or Nuwara Eliya for an
                      unforgettable journey. Buses and private cars are also
                      available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-background-light dark:bg-background-dark rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <span className="material-symbols-outlined text-[#7a5c58] text-3xl mt-1">
                    restaurant
                  </span>
                  <div>
                    <h3 className="font-bold text-[#2d5a2f] dark:text-primary">
                      Local Tips
                    </h3>
                    <p className="text-sm leading-normal mt-1">
                      Try a traditional "kottu roti" at a local cafe and wake up
                      early to catch the sunrise from a viewpoint.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            {/* Interactive Map & Cards */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-[#2d5a2f] dark:text-primary mb-6 text-center">
                Explore Nearby
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                  <div className="p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold">Little Adam's Peak</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      An easy to moderate hike with rewarding panoramic views.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold">Ella Rock</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      A more challenging trek for stunning vistas over the Ella
                      Gap.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold">Uva Halpewatte Tea Factory</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Learn about the tea-making process from leaf to cup.
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 min-h-[400px] rounded-xl overflow-hidden">
                  <iframe
                    allowFullScreen=""
                    data-location="Ella, Sri Lanka"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31687.175510006323!2d81.03450987621184!3d6.867156947094254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae465955bc1f89f%3A0x8640477166e4e84!2sElla!5e0!3m2!1sen!2slk!4v1692182852296!5m2!1sen!2slk"
                    style={{ border: 0 }}
                    width="100%"
                  />
                </div>
              </div>
            </section>
            {/* Testimonial Slider */}
            <section className="mb-16 text-center">
              <h2 className="text-3xl font-bold text-[#2d5a2f] dark:text-primary mb-8">
                What Our Travelers Say
              </h2>
              <div className="relative max-w-2xl mx-auto">
                <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <p className="italic text-lg mb-4">
                    "Our trip to Ella was magical, and it wouldn't have been the
                    same without the expert guidance from Sri Lanka Tours. The
                    views from Ella Rock were a highlight of our entire journey.
                    Highly recommended!"
                  </p>
                  <p className="font-bold text-[#7a5c58]">— Alex &amp; Jamie</p>
                  <div className="flex justify-center text-[#c78f4f] mt-2">
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                    <span className="material-symbols-outlined">star</span>
                  </div>
                </div>
              </div>
            </section>
            {/* Call-to-Action (CTA) Section */}
            <section className="text-center py-16 bg-primary/20 dark:bg-primary/10 rounded-xl">
              <h2 className="text-3xl font-bold text-[#2d5a2f] dark:text-primary mb-4">
                Ready to Explore Ella?
              </h2>
              <p className="max-w-xl mx-auto mb-8">
                View our curated tour packages that feature the stunning
                landscapes and unique culture of Ella.
              </p>
              <button className="flex mx-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[#2d5a2f] hover:bg-opacity-90 text-white text-base font-bold tracking-wide transition-all">
                <span>View Our Tours</span>
              </button>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    );
}

export default DestinationDetails;