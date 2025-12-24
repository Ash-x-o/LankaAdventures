import React, { useRef, useEffect, useState } from "react"; // CHANGED: consolidated imports
import { Header } from "./home";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"; // CHANGED

function PaymentPortal() {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);

    const navigate = useNavigate();

    const searchParams = new URLSearchParams(window.location.search);
    const adminView = searchParams.get('admin');
    const bid = searchParams.get('bid');

    const [booking, setBooking] = useState(null);
    const [pkgBooking, setPkgBooking] = useState(null);
    const [cusBooking, setCusBooking] = useState(null);

    // card-related states (you referenced these earlier) -> keep for UI/backwards compatibility
    const [cardNumber, setCardNumber] = useState(""); // CHANGED (kept but not used for Stripe)
    const [expiryDate, setExpiryDate] = useState(""); // CHANGED
    const [cvc, setCvc] = useState(""); // CHANGED
    const [cardholderName, setCardholderName] = useState(""); // CHANGED

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await fetch('/api/users/check-session', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                const data = await response.json();
                console.log("Session data:", data.user);
                if (response.ok) {
                    if (data.user.role === "admin" && adminView) {
                        setAdmin(data.user);
                    } else if (data.user.role === "user" && !adminView) {
                        setUser(data.user);
                    } else {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        checkSession();
    }, [adminView, navigate]);

    useEffect(() => {
        if (bid) {
            const fetchBookingDetails = async () => {
                try {
                    const response = await fetch(`/api/tour-bookings/get-booking-by/${bid}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        console.log("Booking details:", data.booking);
                        setBooking(data.booking);
                    } else {
                        console.error('Error fetching booking details:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching booking details:', error);
                    navigate('/customer_dashboard');
                }
            };
            fetchBookingDetails();
        } else {
            navigate('/customer_dashboard');
        }
    }, [bid, navigate]);

    useEffect(() => {
        if (booking) {
            if (booking.planType === "package") {
                const fetchPackageBooking = async () => {
                    try {
                        const response = await fetch(`/api/tours/get-tour-by/${booking.planId._id}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                        });
                        const data = await response.json();
                        if (response.ok) {
                            console.log("Package details:", data.package);
                            setPkgBooking(data.package);
                        } else {
                            console.error('Error fetching package details:', data.message);
                            navigate('/customer_dashboard');
                        }
                    } catch (error) {
                        console.error('Error fetching package details:', error);
                        navigate('/customer_dashboard');
                    }
                };
                fetchPackageBooking();
            } else if (booking.planType === "custom") {
                const fetchCustomBooking = async () => {
                    try {
                        const response = await fetch(`/api/custom-tours/tour-by/${booking.planId._id}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                        });
                        const data = await response.json();
                        if (response.ok) {
                            console.log("Custom tour details:", data.customTour);
                            setCusBooking(data.customTour);
                        } else {
                            console.error('Error fetching custom tour details:', data.message);
                            navigate('/customer_dashboard');
                        }
                    } catch (error) {
                        console.error('Error fetching custom tour details:', error);
                        navigate('/customer_dashboard');
                    }
                };
                fetchCustomBooking();
            }
        }
    }, [booking, navigate]);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState(""); // CHANGED: initialize empty — fill when user loaded
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    // update email when user becomes available (you previously used user ? user.email : "" which doesn't update)
    useEffect(() => { // CHANGED
        if (user && user.email) setEmail(user.email);
    }, [user]);

    const stripe = useStripe(); // CHANGED
    const elements = useElements(); // CHANGED

    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [saveCard, setSaveCard] = useState(false);

    const [payble, setPayble] = useState(true);
    const initRef = useRef(true);

    useEffect(() => {
        if (expiryDate) {
            if (expiryDate.length === 2) {
                setExpiryDate(expiryDate + " / ");
            }
            if (expiryDate.length > 7) {
                setExpiryDate(expiryDate.slice(0, 7));
            }
        }
    }, [expiryDate]);

    useEffect(() => {
        if (cardNumber) {
            if (cardNumber.length === 4 || cardNumber.length === 9 || cardNumber.length === 14) {
                setCardNumber(cardNumber + " ");
            }
            if (cardNumber.length > 19) {
                setCardNumber(cardNumber.slice(0, 19));
            }
        }
    }, [cardNumber]);

    // Validate required non-card fields. For card, rely on Stripe component/response.
    const validateFields = () => { // CHANGED: simplified to require contact fields and cardholderName
        if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip || !cardholderName) {
            return false;
        }
        // stripe and card element existence validated in handlePayment
        return true;
    };

    const handlePayment = async (e) => { // CHANGED: fully async + robust Stripe flow
        e.preventDefault();

        if (!validateFields()) {
            setPayble(false);
            return;
        }

        if (!stripe || !elements) {
            alert("Payment system not loaded yet. Please try again in a moment.");
            return;
        }

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                alert("Card input not found. Please refresh and try again.");
                return;
            }

            // Create payment method with card + billing details
            const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: {
                    name: cardholderName || `${firstName} ${lastName}`,
                    email: email,
                    phone: phone,
                    address: {
                        line1: address,
                        city: city,
                        state: state,
                        postal_code: zip,
                    },
                },
            });

            if (error) {
                console.error("Stripe createPaymentMethod error:", error);
                alert(error.message || "Payment failed - card rejected");
                return;
            }

            // send token/id to your backend to create charge / PaymentIntent
            const payload = {
                bookingId: booking?._id,
                userId: booking?.userId || (user && user._id),
                paymentMethodId: pm.id, // CHANGED: tokenized payment method id
                saveCard: saveCard,
                amount: (getBudget() * (booking?.groupSize || 1)) + 3000, // CHANGED: send amount for server-side handling
            };

            const response = await fetch("/api/payments/make-payment", { // CHANGED: full url to backend
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errBody = await response.text().catch(() => null);
                console.error("Payment backend error:", response.status, errBody);
                alert("Payment Failed. Please try again.");
                return;
            }

            const data = await response.json();
            // you may want to use data for transactionId or next steps
            alert("Payment Successful!");
            navigate('/customer_dashboard');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert("Payment Failed. Please try again.");
        }
    };

    const [destination, setDestination] = useState(null);

    useEffect(() => {
        if (cusBooking && booking && booking.planType === "custom") {
            getDes(cusBooking.dailyPlan[0][0]);
        }
    }, [cusBooking, booking]);

    const getImgUrl = () => {
        if (!booking) return "";
        if (booking.planType === "package" && pkgBooking) {
            return pkgBooking.images && pkgBooking.images.length > 0 ? pkgBooking.images[0] : "";
        } else if (booking.planType === "custom" && cusBooking) {
            return destination ? (destination.images && destination.images.length > 0 ? destination.images[0] : "") : "";
        }
        return "";
    };

    const getTourName = () => {
        if (!booking) return "";
        if (booking.planType === "package" && pkgBooking) {
            return pkgBooking.name;
        } else if (booking.planType === "custom" && cusBooking) {
            return cusBooking.tourName;
        }
        return "";
    };

    const getTourDays = () => {
        if (!booking) return "";
        if (booking.planType === "package" && pkgBooking) {
            return pkgBooking.dailyPlan.length;
        } else if (booking.planType === "custom" && cusBooking) {
            return cusBooking.dailyPlan.length;
        }
        return "";
    };

    const getBudget = () => {
        if (!booking) return 0;
        if (booking.planType === "package" && pkgBooking) {
            return pkgBooking.price || 0;
        } else if (booking.planType === "custom" && cusBooking) {
            return cusBooking.budget || 0;
        }
        return 0;
    };

    const getDes = async (des) => {
        try {
            const response = await fetch(`/api/destinations/get-by/${des}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (response.ok) {
                setDestination(data.destination);
            } else {
                console.error('Error fetching destination details:', data.message);
            }
        } catch (error) {
            console.error('Error fetching destination details:', error);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased selection:bg-primary/30">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">
                <Header user={user} admin={admin} />
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 lg:px-8">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#e0e5dc] dark:border-[#2f3a23] pb-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-3xl icon-filled">lock</span>
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-text-main dark:text-white">Secure Checkout</h1>
                            </div>
                            <p className="text-text-muted dark:text-gray-400 text-base max-w-xl">
                                Complete your booking for the Sri Lanka Adventure. Your payment information is encrypted and secure.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-text-muted dark:text-gray-400 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full border border-[#e0e5dc] dark:border-[#2f3a23]">
                            <span className="material-symbols-outlined text-primary text-lg">timer</span>
                            <span>Price held for 14:30</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Contact Info */}
                            <div className="rounded-xl border border-[#e0e5dc] dark:border-[#2f3a23] bg-surface-light dark:bg-surface-dark overflow-hidden">
                                <div className="flex items-center gap-4 border-b border-[#e0e5dc] dark:border-[#2f3a23] p-5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">1</div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-white">Contact Information</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-text-main dark:text-gray-200">First Name</span>
                                            <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="e.g. Alex" type="text" defaultValue="" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-text-main dark:text-gray-200">Last Name</span>
                                            <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="e.g. Morgan" type="text" defaultValue="" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-text-main dark:text-gray-200">Email Address</span>
                                            <div className="relative">
                                                <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 pl-11 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    placeholder="name@example.com" type="email" defaultValue="" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                <div className="absolute left-3 top-3.5 text-gray-400">
                                                    <span className="material-symbols-outlined text-xl">mail</span>
                                                </div>
                                            </div>
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-text-main dark:text-gray-200">Phone Number</span>
                                            <div className="relative">
                                                <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 pl-11 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    placeholder="+1 (555) 000-0000" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                                <div className="absolute left-3 top-3.5 text-gray-400">
                                                    <span className="material-symbols-outlined text-xl">call</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-bold text-text-main dark:text-gray-200">Street Address</span>
                                        <div className="relative">
                                            <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 pl-11 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="Street address, P.O. Box, Company name, etc." type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                                            <div className="absolute left-3 top-3.5 text-gray-400">
                                                <span className="material-symbols-outlined text-xl">home</span>
                                            </div>
                                        </div>
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-text-main dark:text-gray-200">City</span>
                                            <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="City" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-text-main dark:text-gray-200">State / Province</span>
                                            <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="State" type="text" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-text-main dark:text-gray-200">Zip Code</span>
                                            <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                placeholder="Zip" type="text" value={zip} onChange={(e) => setZip(e.target.value)} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Payment method block */}
                            <div className="rounded-xl border border-primary/50 dark:border-primary/50 bg-surface-light dark:bg-surface-dark shadow-[0_0_0_4px_rgba(115,207,23,0.1)] overflow-hidden">
                                <div className="flex items-center gap-4 border-b border-[#e0e5dc] dark:border-[#2f3a23] p-5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">2</div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-white">Payment Method</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="relative flex cursor-pointer items-center gap-4 rounded-xl border border-primary bg-primary/5 p-4 transition-all hover:bg-primary/10">
                                            <input defaultChecked className="cursor-pointer h-5 w-5 bg-transparent checked:bg-accent hover:text-accent focus:outline-none focus:text-accent focus:ring-0 focus:ring-offset-0"
                                                name="payment_method" type="radio" value="credit_card" onChange={(e) => setPaymentMethod(e.target.value)} />
                                            <div className="flex grow items-center justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-text-main dark:text-white text-base font-bold">Credit Card</p>
                                                    <p className="text-text-muted dark:text-gray-400 text-sm">Visa, Mastercard, or Amex</p>
                                                </div>
                                                <div className="flex gap-2 text-text-main dark:text-white opacity-70">
                                                    <span className="material-symbols-outlined">credit_card</span>
                                                </div>
                                            </div>
                                        </label>

                                        <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-[#e0e5dc] dark:border-[#2f3a23] p-4 transition-all hover:border-gray-400 dark:hover:border-gray-600">
                                            <input className="cursor-pointer h-5 w-5 bg-transparent checked:bg-accent hover:text-accent focus:outline-none focus:text-accent focus:ring-0 focus:ring-offset-0" name="payment_method" type="radio" value={"paypal"} onChange={(e) => setPaymentMethod(e.target.value)} />
                                            <div className="flex grow items-center justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-text-main dark:text-white text-base font-bold">PayPal</p>
                                                    <p className="text-text-muted dark:text-gray-400 text-sm">Fast checkout with your account</p>
                                                </div>
                                                <div className="flex gap-2 text-text-main dark:text-white opacity-70">
                                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                                </div>
                                            </div>
                                        </label>

                                        <label className="group relative flex cursor-pointer items-center gap-4 rounded-xl border border-[#e0e5dc] dark:border-[#2f3a23] p-4 transition-all hover:border-gray-400 dark:hover:border-gray-600">
                                            <input className="cursor-pointer h-5 w-5 bg-transparent checked:bg-accent hover:text-accent focus:outline-none focus:text-accent focus:ring-0 focus:ring-offset-0" name="payment_method" type="radio" value={"bank_transfer"} onChange={(e) => setPaymentMethod(e.target.value)} />
                                            <div className="flex grow items-center justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-text-main dark:text-white text-base font-bold">Bank Transfer</p>
                                                    <p className="text-text-muted dark:text-gray-400 text-sm">Direct transfer details via email</p>
                                                </div>
                                                <div className="flex gap-2 text-text-main dark:text-white opacity-70">
                                                    <span className="material-symbols-outlined">account_balance</span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Card details: CardElement used for PCI compliance */}
                            <div className="rounded-xl border border-[#e0e5dc] dark:border-[#2f3a23] bg-surface-light dark:bg-surface-dark overflow-hidden">
                                <div className="flex items-center gap-4 border-b border-[#e0e5dc] dark:border-[#2f3a23] p-5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-600 text-gray-500 font-bold text-sm">3</div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-white">Card Details</h3>
                                </div>
                                <div className="p-6 flex flex-col gap-5">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-bold text-text-main dark:text-gray-200">Cardholder Name</span>
                                        <input className="w-full rounded-lg border border-[#e0e5dc] dark:border-[#2f3a23] bg-background-light dark:bg-background-dark px-4 py-3 text-base text-text-main dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="Name as shown on card" type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} />
                                    </label>

                                    <div className="rounded border border-[#e0e5dc] p-3">
                                        <CardElement options={{ hidePostalCode: true }} /> {/* CHANGED: use Stripe CardElement */}
                                    </div>

                                    <label className="flex items-center gap-3 mt-2 cursor-pointer">
                                        <input className="h-5 w-5 rounded border-[#e0e5dc] bg-transparent text-primary focus:ring-0 focus:ring-offset-0 dark:border-gray-600" type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />
                                        <span className="text-sm font-medium text-text-muted dark:text-gray-400">Save this card for future adventures</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order summary / right column remains unchanged */}
                        <div className="lg:col-span-5 relative">
                            <div className="sticky top-24 flex flex-col gap-6">
                                <div className="rounded-xl border border-[#e0e5dc] dark:border-[#2f3a23] bg-surface-light dark:bg-surface-dark p-5 shadow-lg">
                                    <h3 className="mb-4 text-xl font-bold text-text-main dark:text-white">Order Summary</h3>
                                    <div className="mb-5 flex gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                            <img alt="Lush green tea plantation in Sri Lanka with mountains in background" className="h-full w-full object-cover" src={`/uploads/${getImgUrl()}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main dark:text-white line-clamp-2">{getTourName()}</h4>
                                            <p className="mt-1 text-sm text-text-muted dark:text-gray-400">{getTourDays()} Days • {booking?.groupSize} Guests</p>
                                        </div>
                                    </div>

                                    <hr className="border-dashed border-[#e0e5dc] dark:border-[#2f3a23] my-4" />
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between text-sm text-text-muted dark:text-gray-400">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-text-main dark:text-gray-200">Rs.{getBudget()}.00 x {booking?.groupSize}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-text-muted dark:text-gray-400">
                                            <span>Taxes &amp; Fees</span>
                                            <span className="font-medium text-text-main dark:text-gray-200">Rs.3000.00</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-primary font-medium">
                                            <span>Early Bird Discount</span>
                                            <span>Rs.0.00</span>
                                        </div>
                                    </div>

                                    <hr className="border-solid border-[#e0e5dc] dark:border-[#2f3a23] my-4" />
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-base font-bold text-text-main dark:text-gray-200">Total Due</span>
                                        <span className="text-3xl font-black text-text-main dark:text-white tracking-tight">Rs.{(getBudget() * booking?.groupSize) + 3000}.00</span>
                                    </div>

                                    <button className="group w-full rounded-lg bg-accent hover:bg-accent/90 text-secondary transition-all duration-200 py-3.5 px-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg" onClick={handlePayment}>
                                        <span className="text-text-main font-bold text-base">Pay Rs.{(getBudget() * booking?.groupSize) + 3000}.00</span>
                                        <span className="material-symbols-outlined text-text-main group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>

                                    <div className="mt-5 flex flex-col gap-2 text-center">
                                        <div className="flex items-center justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
                                            <div className="h-6 w-10 rounded bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">VISA</div>
                                            <div className="h-6 w-10 rounded bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">MC</div>
                                            <div className="h-6 w-10 rounded bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">AMEX</div>
                                        </div>
                                        <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted dark:text-gray-500 mt-2">
                                            <span className="material-symbols-outlined text-sm">lock</span> Payments are SSL encrypted and secured
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl bg-primary/10 p-4 border border-primary/20 flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary">support_agent</span>
                                    <div>
                                        <p className="text-sm font-bold text-text-main dark:text-white">Need Help?</p>
                                        <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">Contact our 24/7 support team if you have any trouble checking out.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default PaymentPortal;
