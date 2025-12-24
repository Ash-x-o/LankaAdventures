import Reac, {use, useEffect, useState} from "react";
import { Footer, Header } from "./home";
import { useNavigate } from "react-router-dom";
import db_bg_1 from "./images/db_bg_2.png";
import TigerBg from "./images/tiger_bg.png";
import EleBg from "./images/elephant_bg.png";


function AboutUs() {

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


    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white overflow-x-hidden">
        {/* Top Navigation */}
        <div className="relative w-full bg-white dark:bg-background-dark border-b border-neutral-light dark:border-[#2a361f]">
          <Header user={user} />
        </div>
        {/* Hero Section */}
        <div className="relative w-full">
          <div className="px-4 md:px-10 lg:px-40 py-5 flex justify-center">
            <div className="w-full max-w-7xl">
              <div
                className="rounded-xl overflow-hidden relative min-h-[560px] flex items-center justify-center bg-cover bg-center"
                data-alt="Stunning aerial view of Sigiriya rock fortress in Sri Lanka surrounded by lush green jungle"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXEQyY1XomdSivVvueBxbAXS6yoSVxd-_d28ILKK-rPg32VDjpqG6IVkBThEo71w3M1985FYhtQ4sl98lBd34FDAvFlF3scbFnRkW8-XanBBI1UVxtadiyftQeD5MEOUbdgd9KY9gCJayTLPQ6A8k37sZjS_OkAEEfoNHHw2tssCkZjWsSjaerrlJAR1eeH4ifURowYLVQhcMgyql84BkyG0jhIbW55YahDSN5lNTsv6Wr05DwqUXDPXJCFtVRjo6OMiofEBnzAW0")',
                }}
              >
                <div className="relative z-10 flex flex-col gap-4 text-center max-w-[800px] px-4">
                  <span className="text-primary font-bold tracking-widest uppercase text-sm md:text-base">
                    Established 2010
                  </span>
                  <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
                    Discover the Soul of Ceylon
                  </h1>
                  <p className="text-gray-100 text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
                    We are more than a travel agency. We are storytellers,
                    conservationists, and your trusted companions on a journey
                    to the heart of Sri Lanka.
                  </p>
                  <div className="flex gap-4 justify-center mt-4">
                    <button className="flex h-12 px-6 items-center justify-center rounded-lg bg-accent text-white font-bold hover:bg-opacity-90 transition">
                      Start Your Journey
                    </button>
                    <button className="flex h-12 px-6 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold hover:bg-white/20 transition">
                      Meet Our Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mission & Vision Cards */}
        <section className="py-16 px-4 md:px-10 lg:px-40 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1 flex flex-col gap-6">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark dark:text-white leading-tight">
                  Our Mission &amp; Vision
                </h2>
                <p className="text-secondary-text dark:text-gray-400 text-lg leading-relaxed">
                  We strive to be more than just a travel agency; we are your
                  gateway to the heart of the island. Our approach blends
                  authentic local experiences with world-class service
                  standards.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-4 rounded-xl border border-neutral-light dark:border-[#2a361f] bg-background-light dark:bg-[#222c18] p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">explore</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-dark dark:text-white mb-2">
                        Our Mission
                      </h3>
                      <p className="text-sm text-secondary-text dark:text-gray-400">
                        To curate unforgettable, personalized journeys that
                        connect travelers with the authentic culture, nature,
                        and people of Sri Lanka.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-neutral-light dark:border-[#2a361f] bg-background-light dark:bg-[#222c18] p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-dark dark:text-white mb-2">
                        Our Vision
                      </h3>
                      <p className="text-sm text-secondary-text dark:text-gray-400">
                        To become the leading sustainable tour operator in South
                        Asia, setting the benchmark for eco-friendly and
                        community-driven tourism.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[400px] shrink-0">
                <div
                  className="rounded-xl overflow-hidden h-[500px] w-full shadow-xl"
                  data-alt="Traditional Sri Lankan stilt fishermen sitting on poles in the ocean during sunset"
                >
                  <img
                    alt="Traditional Fishermen"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSAYnijcp--XA6g7bF2VLxp1XUUG-dHaP82CfvjVMO-SewuTS8Ip4MSPqRNch3YXFc5xPirFh_6Dd7cYVP7MsqSDJOwrD9Jlbc3xOiOoYBY1qjcO3OxWHeXcRC_FXNcGy9xVih2dkV7krDgSQYty4TB4oWYATsDt-kN46vW47yB3pc73HHXLpxLa4DkguHMIFu5PO29KosrJ-q0h6FUS-ZhSeUtczEA1MntlPV1h5KHn0iMAb_52qViD9w_0mxIf7aEXpwI2PMtLE"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="py-12 bg-accent/10 dark:bg-[#1f2916]">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-6">
                <p className="text-4xl font-black text-primary mb-2">12+</p>
                <p className="text-neutral-dark dark:text-gray-200 font-medium">
                  Years of Experience
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <p className="text-4xl font-black text-primary mb-2">5k+</p>
                <p className="text-neutral-dark dark:text-gray-200 font-medium">
                  Happy Travelers
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <p className="text-4xl font-black text-primary mb-2">850+</p>
                <p className="text-neutral-dark dark:text-gray-200 font-medium">
                  Tours Completed
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <p className="text-4xl font-black text-primary mb-2">45</p>
                <p className="text-neutral-dark dark:text-gray-200 font-medium">
                  Local Guides
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Company History Timeline */}
        <section className="py-20 px-4 md:px-10 lg:px-40 bg-white dark:bg-background-dark">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-neutral-dark dark:text-white mb-4">
                Our Journey Through Time
              </h2>
              <p className="text-secondary-text dark:text-gray-400">
                From a small office in Kandy to an island-wide network.
              </p>
            </div>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-accent/10 dark:bg-[#2a361f] -translate-x-1/2" />
              {/* Timeline Item 1 */}
              <div className="relative flex flex-col md:flex-row items-center mb-12 group">
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-12 text-left md:text-right">
                  <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-2">
                    2010
                  </span>
                  <h3 className="text-xl font-bold text-neutral-dark dark:text-white">
                    Founded in Kandy
                  </h3>
                  <p className="text-secondary-text dark:text-gray-400 text-sm mt-2">
                    Started with just two guides and a passion for sharing the
                    hill country's secrets.
                  </p>
                </div>
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 size-10 rounded-full bg-white dark:bg-background-dark border-4 border-primary flex items-center justify-center z-10 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">
                    flag
                  </span>
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block" />
              </div>
              {/* Timeline Item 2 */}
              <div className="relative flex flex-col md:flex-row items-center mb-12 group">
                <div className="md:w-1/2 md:pr-12 hidden md:block" />
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 size-10 rounded-full bg-white dark:bg-background-dark border-4 border-primary flex items-center justify-center z-10 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">
                    public
                  </span>
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-12 text-left">
                  <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-2">
                    2013
                  </span>
                  <h3 className="text-xl font-bold text-neutral-dark dark:text-white">
                    First International Tour
                  </h3>
                  <p className="text-secondary-text dark:text-gray-400 text-sm mt-2">
                    Expanded operations to welcome guests from Europe and Asia,
                    launching our signature 'Cultural Triangle' package.
                  </p>
                </div>
              </div>
              {/* Timeline Item 3 */}
              <div className="relative flex flex-col md:flex-row items-center mb-12 group">
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-12 text-left md:text-right">
                  <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-2">
                    2018
                  </span>
                  <h3 className="text-xl font-bold text-neutral-dark dark:text-white">
                    Sustainability Award
                  </h3>
                  <p className="text-secondary-text dark:text-gray-400 text-sm mt-2">
                    Recognized nationally for our 'Zero Plastic' initiative and
                    support of local artisan communities.
                  </p>
                </div>
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 size-10 rounded-full bg-white dark:bg-background-dark border-4 border-primary flex items-center justify-center z-10 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">
                    eco
                  </span>
                </div>
                <div className="md:w-1/2 md:pl-12 hidden md:block" />
              </div>
              {/* Timeline Item 4 */}
              <div className="relative flex flex-col md:flex-row items-center group">
                <div className="md:w-1/2 md:pr-12 hidden md:block" />
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 size-10 rounded-full bg-white dark:bg-background-dark border-4 border-primary flex items-center justify-center z-10 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">
                    map
                  </span>
                </div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-12 text-left">
                  <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-2">
                    2023
                  </span>
                  <h3 className="text-xl font-bold text-neutral-dark dark:text-white">
                    Expanded to 50+ Tours
                  </h3>
                  <p className="text-secondary-text dark:text-gray-400 text-sm mt-2">
                    Now covering every corner of the island, from the northern
                    peninsula to the southern surf breaks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Sustainability Section */}
        <section className="py-20 bg-neutral-dark text-white relative overflow-hidden">
          {/* Background Pattern/Image Overlay */}
          <div
            className="absolute inset-0 opacity-100 bg-cover bg-center "
            data-alt="Dark green tea plantation texture background"
            style={{
              backgroundImage: `url(${db_bg_1})`,
            }}
          />
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-primary">
                  <span className="material-symbols-outlined text-sm">
                    forest
                  </span>
                  <span>Eco-Conscious Travel</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black leading-tight">
                  Preserving Paradise for Future Generations
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  We believe responsible tourism is the only way forward. Every
                  booking contributes to our "Green Lanka" fund, which supports
                  reforestation projects in the Sinharaja Rain Forest and
                  protects marine life along the southern coast.
                </p>
                <ul className="space-y-4 pt-4">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      check_circle
                    </span>
                    <span>100% Carbon Neutral Tours available</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      check_circle
                    </span>
                    <span>Supporting local artisan communities directly</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">
                      check_circle
                    </span>
                    <span>Strict "No Plastic" policy on excursions</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 mt-8">
                    <div
                      className="relative  rounded-xl overflow-hidden aspect-[4/5]"
                      data-alt="Close up of green tea leaves with morning dew"
                    >
                      <img
                        className="absolute w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkf-UU6IcH54OnZ0WdmWCxYJTQcF0WdxsAPKNm4Hk9EIidkB6bikCigg7Kw0bLCEsa1NsTigqqQIb1tnL8mRyzo5oMyPeUME2pR0R_XLi7rbrgWV2_IoHYkUsLdq2E5K1U4V8E7rdf2p5wY5gQOFMrTU4iaaNV7RKtPg7bh4jz29rmaxW494g85aV8Wuojskhr-vjWx0YmJk6uTT5r71zpc8KHQ88200dhLs-WVzBsvruwzCMx1qwbSkaXGeU9Lj2rjvFgOipVLZ0"
                      />
                      <img
                        className="absolute w-full h-full object-cover opacity-50"
                        src={EleBg}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div
                      className="relative rounded-xl overflow-hidden aspect-[4/5]"
                      data-alt="Baby elephant being washed in a river ethically"
                    >
                      <img
                        className="absolute w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuATZlNGPLSUo7kYu6w5t-iDL8bdBdrh811ZcMFJhhBhCaw6W2OqqWBTECDOAZzgIO7hfEx0bYJnvXwupbZwyyocDGKZgxtk3pbgCMm4yNXZoYAk-GU_cinOymgXG50qwDeWcCx0Z8MurfhXbtO2SbjAkjlAnTAIKx_f0uPi1ropbwFu7yCQA3xizJy_Zsibhj2Gt1SEYLo_IyLjgTH5VYe4B8oP39N2aVVEPMNoBDXT7gIed8awVPi-kkQFnpdsOIAy_31yY1sdeiA"
                      />
                      <img
                        className="absolute w-full h-full object-cover opacity-50"
                        src={TigerBg}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Team Section */}
        <section className="py-20 px-4 md:px-10 lg:px-40 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold text-neutral-dark dark:text-white mb-2">
                  Meet Our Guides
                </h2>
                <p className="text-secondary-text dark:text-gray-400">
                  The locals who know Sri Lanka best.
                </p>
              </div>
              {/* <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                View All Team Members{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="group">
                <div className="rounded-xl overflow-hidden aspect-square mb-4 bg-gray-100 relative">
                  <img
                    alt="Portrait of Head Guide Lahiru"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    data-alt="Smiling Sri Lankan man with short dark hair wearing a casual shirt"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLHh_pL-sUw_bxko2oVk5EdycMNXYQ8Oav_I0KjOsq6dEcKxmOR5Jh4-g3xHJR5yDA4IHc1gwDbbHSkltljaudSHyjIaQVZw4Npupg83vj-N499suWKNXaUEKRAg0FiKCozmFn1FyCZxlR43_jiDJUbIYvURwxneLIwL1woMtw4Qc36xm5e5c-0ebkD0ISzQwLD2ATI66U_51UiFCd0KgKUGtqT_Om_hRtsvsg7HUsBdxz9_R3FcobsKGb6d_AlvWwrwcP3ajeuZA"
                  />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white">
                  Lahiru Perera
                </h3>
                <p className="text-sm text-secondary-text font-medium mb-2">
                  Head Guide
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  15 years experience in wildlife tracking and bird watching.
                </p>
              </div>
              {/* Team Member 2 */}
              <div className="group">
                <div className="rounded-xl overflow-hidden aspect-square mb-4 bg-gray-100 relative">
                  <img
                    alt="Portrait of Cultural Expert Amara"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    data-alt="Young Sri Lankan woman smiling warmly with greenery in background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3I3IV5voIAFFvd4EwdMH8fZ2jnDalSPWOkXJbVisnK_0o_yZ_oLQYxkrk6I6p2t3ZeuuVgCaFuOsCDY-fJ3Ow6TKxRQXC1Snf879f_gBpsEcWMeUwE6INYrz0j5v62D5elWPoUI7jbAivt0QQM0_7HmjfQLpT02xQnZUNCVSSVBD_8MozzUae2ZIgN1khF306fZGp-1-8cWFhhAn-VKcTjgG1nk0HDgJdFD4z1lCCZqdRzyY6tU-CwA8nUNNQkSWLCElEMFaPxtc"
                  />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white">
                  Amara Silva
                </h3>
                <p className="text-sm text-secondary-text font-medium mb-2">
                  Cultural Expert
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Specializes in ancient history and Buddhist philosophy.
                </p>
              </div>
              {/* Team Member 3 */}
              <div className="group">
                <div className="rounded-xl overflow-hidden aspect-square mb-4 bg-gray-100 relative">
                  <img
                    alt="Portrait of Adventure Lead Kasun"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    data-alt="Man with sunglasses looking adventurous"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_F9f2J12MYx3CpCo1hSmEl5qEvranmDP0EmocAlB-g0thmeJ9jDLFKwk3X7iXzHW_XD3IQB84yOlCneqIuWo2rAhU4WbcrBRJwDtV140KP4NpUV_Yk2IB0OiBCSqnuh9Gl-hjgjuYf8grx5q-fTtMPF-66JHEpX1vXbRjnJjxVuspB6zHbOdd-ZmA7UoPfYRqzfVzID1vBPWCmpOCcxEkWE7o0iJRExhSjAkZ_fdY6njWt8RTjDdO95tpvQeTl6PhbM4PBpqvJVc"
                  />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white">
                  Kasun Jayawardena
                </h3>
                <p className="text-sm text-secondary-text font-medium mb-2">
                  Adventure Lead
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Certified hiking instructor and surfing enthusiast.
                </p>
              </div>
              {/* Team Member 4 */}
              <div className="group">
                <div className="rounded-xl overflow-hidden aspect-square mb-4 bg-gray-100 relative">
                  <img
                    alt="Portrait of Operations Manager Nimali"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    data-alt="Woman with professional attire smiling confidently"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0P-UTAl96jm-NIbWFRH8CMMOYVfucQEIZ2nDGYzmqHyF6j_p7sUsQB2a57uEIBw8XRheX-msW47ClgLdGdNRmnxaIkqGK4Lfx8EYWci8SL6bA0hyn3WOl4K7R-yApb14krbYfIxCynJLiMZtIVo-MKZBwt4UBjH-dmXpuFEstSNcHtqnn4pthnS_hS4s_iyCdEIZrPgpGou9WeLKVlRRe2UbrgqNUM7hayv54lxzCv1c66IhlFORA3Rp8FayYA9peiNpws4Umf90"
                  />
                </div>
                <h3 className="text-lg font-bold text-neutral-dark dark:text-white">
                  Nimali Fernando
                </h3>
                <p className="text-sm text-secondary-text font-medium mb-2">
                  Operations Manager
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ensures your logistics are seamless from arrival to departure.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <Footer />
      </div>
    );
}

export default AboutUs;