import React,{ useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        async function checkSession() {
            try{
                const response = await fetch('/api/users/check-session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies for authentication
                });
                
                if(response.ok){
                    const data = await response.json();
                    console.log("Session data:", data);
                    if(data.user.role === 'admin'){
                        navigate('/admin_dashboard');
                    }else if(data.user.role === 'user') {
                        navigate('/');
                    }              
                }
            }
            catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        checkSession();
    }, []);

    const [isLogin, setIsLogin] = useState(true);
    
    const handleToggle = (event) => {
        setIsLogin(event.target.value === "Log In");
        setEmail("")
        setPassword("")
        setUserName("")
        setConfirmPassword("")
        setEmailError(false)
        setPasswordError(false)
        setUserNameError(false)
        setConfirmPasswordError(false)
    };

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (userName.trim() === "" || email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
            if(userName.trim() === "") setUserNameError(true);
            if(email.trim() === "") setEmailError(true);
            if(password.trim() === "") setPasswordError(true);
            if(confirmPassword.trim() === "") setConfirmPasswordError(true);
            return;
        }else{ 
            if ( emailError || passwordError || confirmPasswordError) {
                return;
            }
            else {
                console.log("Signup data:", { userName, email, password, confirmPassword });
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userName, email, password }),
                });
                if(response.ok){
                    console.log("Signup successful");
                    navigate('/');
                }
            }
            
        }
        
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        if ( email.trim() === "" || password.trim() === "") {
            if(email.trim() === "") setEmailError(true);
            if(password.trim() === "") setPasswordError(true);
            return;
        }else{ 
            if ( emailError || passwordError) {
                return;
            }
            else {
                console.log("Login data:", { email, password });
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                if(response.ok){
                    console.log("Login successful");
                    navigate('/');
                }
                else{
                   alert(data.message)
                }
            }
        }
    }
    // const validateUserName = () => {
    //     if (userName.trim() === "") {
    //         setUserNameError(true);
    //         return false;
    //     } else {
    //         setUserNameError(false);
    //     }
    //     // Add more validation logic for email, password, and confirm password here
    //     return true;
    // }
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            setEmailError(false);  
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError(true);
            return false;
        } else {
            setEmailError(false);
        }
        return true;
    }

    const validatePassword = () => {
        if(password.trim() === "") {
            setPasswordError(false);
            return false;
        }
        if (password.length < 6) {
            setPasswordError(true);
            return false;
        } else {
            setPasswordError(false);
        }
        return true;
    }
    const comparePassword = () => {
        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            return false;
        } else {
            setConfirmPasswordError(false);
        }
        return true;
    }

    

    // useEffect(() => {
    //     if(email !== "")
    //     validateEmail();
    // }, [email]);
    // useEffect(() => {
    //     validatePassword();
    // }, [password]);
    // useEffect(() => {
    //     comparePassword(confirmPassword);
    // }, [confirmPassword]);

  return (
    <div className="font-display">
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Authentication - Lanka Adventures</title>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
            href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap"
            rel="stylesheet"
        />
        <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
            rel="stylesheet"
        />
        <style
            dangerouslySetInnerHTML={{
            __html:
                "\n        body {\n            -webkit-font-smoothing: antialiased;\n            -moz-osx-font-smoothing: grayscale;\n        }\n    "
            }}
        />
        <div
            className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-hidden"
            style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", sans-serif' }}
        >
            <div
            className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat opacity-30"
            data-alt="A subtle, soft-focus view of a Sri Lankan beach with palm trees at sunset."
            style={{
                backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoiyH-YDh6sQwnfPotAIi_B3bTCFu-ybckAVFvDr0byQDoNVKi0u7PO9dT-544Fb-yNQ5X1Lysc0kGtgg_b6DjU-2Lj5la7lgNKuAqMZFH02eSAuiW_1AAURq6vYbEj_1sfxE1UtDZGkvf6_MpKTshclMG49KzRvsJAqBDOsD-B4xDCpb869v2RSyHjDyAIqB8LIfiTG6b5DUpg5JPvvvZyd9_hOfyNDWaNRzG15DT_dklmVj88InxqV88gJBJx2MSLA19sFM9SRk")'
            }}
            ></div>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-background-light/50 to-background-light dark:from-background-dark/50 dark:to-background-dark" />
            <header className="relative z-20 w-full bg-transparent">
            <nav className="container mx-auto flex items-center justify-between px-6 py-4">
                <a className="flex items-center gap-2" href="#">
                <span className="material-symbols-outlined text-3xl text-deep-forest-green dark:text-off-white">
                    explore
                </span>
                <span className="text-2xl font-bold text-deep-forest-green dark:text-off-white">
                    Lanka Adventures
                </span>
                </a>
                <div className="hidden items-center gap-6 md:flex">
                <a
                    className="text-sm font-medium text-deep-forest-green/80 hover:text-deep-forest-green dark:text-off-white/80 dark:hover:text-off-white"
                    href="/"
                >
                    Home
                </a>
                <a
                    className="text-sm font-medium text-deep-forest-green/80 hover:text-deep-forest-green dark:text-off-white/80 dark:hover:text-off-white"
                    href="/tour_search"
                >
                    Tours
                </a>
                <a
                    className="text-sm font-medium text-deep-forest-green/80 hover:text-deep-forest-green dark:text-off-white/80 dark:hover:text-off-white"
                    href="#"
                >
                    About Us
                </a>
                <a
                    className="text-sm font-medium text-deep-forest-green/80 hover:text-deep-forest-green dark:text-off-white/80 dark:hover:text-off-white"
                    href="#"
                >
                    Contact
                </a>
                </div>
                <button className="md:hidden">
                <span className="material-symbols-outlined text-3xl text-deep-forest-green dark:text-off-white">
                    menu
                </span>
                </button>
            </nav>
            </header>
            <main className="relative z-10 flex flex-1 w-full flex-col items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="w-full rounded-lg bg-off-white/95 dark:bg-background-dark/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 text-center">
                    <h2 className="text-2xl font-bold text-deep-forest-green dark:text-off-white">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-deep-forest-green/70 dark:text-off-white/70">
                        Sign in to continue your journey.
                    </p>
                    </div>
                    <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-background-light dark:bg-deep-forest-green/50 p-1.5">
                    <label className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-full px-2 text-deep-forest-green/70 has-[:checked]:bg-white has-[:checked]:text-deep-forest-green dark:text-off-white/70 has-[:checked]:dark:bg-background-dark has-[:checked]:dark:text-white has-[:checked]:shadow-md">
                        <span className="truncate text-sm font-medium">Log In</span>
                        <input
                        defaultChecked="log in"
                        className="invisible w-0"
                        name="auth-toggle"
                        type="radio"
                        defaultValue="Log In"
                        onChange={handleToggle}
                        />
                    </label>
                    <label className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-full px-2 text-deep-forest-green/70 has-[:checked]:bg-white has-[:checked]:text-deep-forest-green dark:text-off-white/70 has-[:checked]:dark:bg-background-dark has-[:checked]:dark:text-white has-[:checked]:shadow-md">
                        <span className="truncate text-sm font-medium">Sign Up</span>
                        <input
                        className="invisible w-0"
                        name="auth-toggle"
                        type="radio"
                        defaultValue="Sign Up"
                        onChange={handleToggle}
                        />
                    </label>
                    </div>
                    {isLogin ? (
                    <form className="flex flex-col gap-4" onSubmit={(e) => handleLogin(e)}>
                    <label className="flex flex-col">
                        <p className="pb-2 text-sm font-medium text-deep-forest-green dark:text-off-white/90">
                        Email
                        </p>
                        <input
                        className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-md border border-warm-sandy-brown/50 bg-white p-3 text-sm font-normal text-deep-forest-green placeholder:text-deep-forest-green/50 focus:border-vibrant-teal focus:outline-0 focus:ring-2 focus:ring-vibrant-teal/30 dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:placeholder:text-off-white/50 dark:focus:border-vibrant-teal"
                        placeholder="Enter your email address"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailError(false)}
                        />
                        {emailError && (
                                <p className="mt-1 text-xs italic text-red-500">Invalid email format</p>
                        )}
                    </label>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                        <p className="pb-2 text-sm font-medium text-deep-forest-green dark:text-off-white/90">
                            Password
                        </p>
                        <a
                            className="pb-2 text-xs font-medium text-vibrant-teal hover:underline"
                            href="#"
                        >
                            Forgot Password?
                        </a>
                        </div>
                        <input
                        className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-md border border-warm-sandy-brown/50 bg-white p-3 text-sm font-normal text-deep-forest-green placeholder:text-deep-forest-green/50 focus:border-vibrant-teal focus:outline-0 focus:ring-2 focus:ring-vibrant-teal/30 dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:placeholder:text-off-white/50 dark:focus:border-vibrant-teal"
                        placeholder="Enter your password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordError(false)}
                        />
                        {passwordError && (
                                <p className="mt-1 text-xs italic text-red-500">Password must be at least 6 characters</p>
                        )}
                    </div>
                    <button className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-deep-forest-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-deep-forest-green/90 focus:outline-none focus:ring-2 focus:ring-deep-forest-green focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                        Log In
                    </button>
                    </form>
                    ) : (
                        // Sign Up Form
                    <form className="flex flex-col gap-4" onSubmit={(e) => handleSignup(e)}>
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium text-deep-forest-green dark:text-off-white/90">
                            Name
                            </p>
                            <input
                            className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-md border border-warm-sandy-brown/50 bg-white p-3 text-sm font-normal text-deep-forest-green placeholder:text-deep-forest-green/50 focus:border-vibrant-teal focus:outline-0 focus:ring-2 focus:ring-vibrant-teal/30 dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:placeholder:text-off-white/50 dark:focus:border-vibrant-teal"
                            placeholder="Enter your name"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            />
                            {userNameError && (
                                <p className="mt-1 text-xs italic text-red-500">Username is required</p>
                            )}
                        </label>
                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium text-deep-forest-green dark:text-off-white/90">
                            Email
                            </p>
                            <input
                            className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-md border border-warm-sandy-brown/50 bg-white p-3 text-sm font-normal text-deep-forest-green placeholder:text-deep-forest-green/50 focus:border-vibrant-teal focus:outline-0 focus:ring-2 focus:ring-vibrant-teal/30 dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:placeholder:text-off-white/50 dark:focus:border-vibrant-teal"
                            placeholder="Enter an email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={validateEmail}
                            onFocus={() => setEmailError(false)}
                            />
                            {emailError && (
                                <p className="mt-1 text-xs italic text-red-500">Invalid email format</p>
                            )}
                        </label>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                            <p className="pb-2 text-sm font-medium text-deep-forest-green dark:text-off-white/90">
                                Password
                            </p>
                            
                            </div>
                            <input
                            className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-md border border-warm-sandy-brown/50 bg-white p-3 text-sm font-normal text-deep-forest-green placeholder:text-deep-forest-green/50 focus:border-vibrant-teal focus:outline-0 focus:ring-2 focus:ring-vibrant-teal/30 dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:placeholder:text-off-white/50 dark:focus:border-vibrant-teal"
                            placeholder="Enter a password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validatePassword}
                            onFocus={() => setPasswordError(false)}
                            />
                            {passwordError && (
                                <p className="mt-1 text-xs italic text-red-500">Password must be at least 6 characters</p>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                            <p className="pb-2 text-sm font-medium text-deep-forest-green dark:text-off-white/90">
                                Confirm Password
                            </p>
                            
                            </div>
                            <input
                            className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-md border border-warm-sandy-brown/50 bg-white p-3 text-sm font-normal text-deep-forest-green placeholder:text-deep-forest-green/50 focus:border-vibrant-teal focus:outline-0 focus:ring-2 focus:ring-vibrant-teal/30 dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:placeholder:text-off-white/50 dark:focus:border-vibrant-teal"
                            placeholder="Confirm your password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={comparePassword}
                            onFocus={() => setConfirmPasswordError(false)}
                            />
                            {confirmPasswordError && (
                                <p className="mt-1 text-xs italic text-red-500">Passwords do not match</p>
                            )}
                        </div>
                        <button className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-deep-forest-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-deep-forest-green/90 focus:outline-none focus:ring-2 focus:ring-deep-forest-green focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                            Sign Up
                        </button>
                    </form>
                    )}
                    <div className="flex items-center gap-4">
                    <hr className="w-full border-t border-warm-sandy-brown/50 dark:border-warm-sandy-brown/30" />
                    <span className="text-xs font-medium text-deep-forest-green/70 dark:text-off-white/70">
                        or
                    </span>
                    <hr className="w-full border-t border-warm-sandy-brown/50 dark:border-warm-sandy-brown/30" />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-col">
                    <button className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-warm-sandy-brown/50 bg-white px-3 py-2 text-sm font-medium text-deep-forest-green transition-colors hover:bg-background-light dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:hover:bg-deep-forest-green/50">
                        <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <g clipPath="url(#clip0_3034_351)">
                            <path
                            d="M22.0492 12.2541C22.0492 11.4541 21.9792 10.6491 21.8492 9.87402H12.2492V14.3491H17.8442C17.6142 15.7591 16.9442 16.9941 15.8942 17.7641V20.4991H19.5642C21.1642 19.0341 22.0492 16.8991 22.0492 14.2691V12.2541Z"
                            fill="#4285F4"
                            />
                            <path
                            d="M12.2492 22.5002C15.2292 22.5002 17.7292 21.5102 19.5642 20.0152L15.8942 17.2802C14.8892 17.9702 13.6592 18.3752 12.2492 18.3752C9.59922 18.3752 7.34922 16.6202 6.55422 14.2802H2.76922V17.0252C4.59422 20.2902 8.16922 22.5002 12.2492 22.5002Z"
                            fill="#34A853"
                            />
                            <path
                            d="M6.55422 14.28C6.34922 13.665 6.22422 13.015 6.22422 12.375C6.22422 11.735 6.34922 11.085 6.54922 10.47L2.76922 7.725C1.86422 9.535 1.33422 11.61 1.33422 13.875C1.33422 16.14 1.86422 18.215 2.76922 20.025L6.55422 17.28V14.28Z"
                            fill="#FBBC05"
                            />
                            <path
                            d="M12.2492 6.375C13.7842 6.375 15.1192 6.905 16.1792 7.91L19.6442 4.445C17.7242 2.68 15.2242 1.5 12.2492 1.5C8.16922 1.5 4.59422 3.71 2.76922 6.975L6.55422 9.72C7.34922 7.38 9.59922 6.375 12.2492 6.375Z"
                            fill="#EA4335"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_3034_351">
                            <rect
                                fill="white"
                                height={24}
                                transform="translate(0.5)"
                                width={24}
                            />
                            </clipPath>
                        </defs>
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                    <button className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-warm-sandy-brown/50 bg-white px-3 py-2 text-sm font-medium text-deep-forest-green transition-colors hover:bg-background-light dark:border-warm-sandy-brown/30 dark:bg-deep-forest-green/30 dark:text-off-white dark:hover:bg-deep-forest-green/50">
                        <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M14.48 18.5283C14.07 19.8683 13.14 20.8283 11.97 20.8283C10.74 20.8283 10.03 20.1083 9.08 20.1083C8.12 20.1083 7.3 20.7883 6.34 20.8183C5.11 20.8583 4.14 19.9283 3.6 18.6083C2.31 15.2583 3.09 10.7483 5.43 8.44834C6.54 7.35834 7.96 6.77834 9.38 6.74834C10.13 6.72834 11.33 7.02834 12.23 7.78834C12.3569 7.89215 12.478 8.0016 12.592 8.11434C13.56 7.24834 14.73 6.69834 15.93 6.75834C16.32 6.76834 17.51 6.88834 18.66 7.98834C18.79 7.31834 19.06 6.68834 19.46 6.13834C19.78 5.70834 20.21 5.37834 20.69 5.19834C19.24 3.42834 16.79 3.12834 15.48 4.39834C14.53 5.30834 14.01 6.61834 14.16 7.99834C14.43 8.24834 14.74 8.48834 15.09 8.70834C16.3 9.51834 16.89 10.8183 16.83 12.1883C16.78 13.6383 16.03 14.8183 14.85 15.5483C14.79 15.5883 14.74 15.6183 14.68 15.6483C14.6217 15.6771 14.562 15.7077 14.501 15.7393L14.5 15.7483C15.82 16.2083 16.59 17.4783 16.38 18.8083C16.15 20.3183 14.93 21.4183 13.49 21.4383C12.63 21.4383 11.9 20.9383 11.39 20.3283C10.82 20.9683 10.05 21.4383 9.21 21.4283C7.79 21.4083 6.73 20.3583 6.94 18.8483C7.19 17.1183 8.65 16.0383 10.15 16.0383C10.95 16.0383 11.61 16.4283 12.16 17.0083C12.37 15.9183 13.43 15.0183 14.5 14.2883C13.2 13.5683 12.62 12.2483 12.69 10.8183C12.74 9.77834 13.23 8.84834 14.07 8.25834C14.12 9.06834 14.45 9.81834 14.98 10.4283C15.8 11.3583 16.89 11.5383 17.72 10.7483C17.78 11.5883 17.61 12.4483 17.21 13.2283C16.29 14.9983 14.48 15.8283 12.6 15.0583C12.98 16.5383 13.82 17.6583 14.48 18.5283Z"
                            fill="currentColor"
                        />
                        </svg>
                        <span>Continue with Apple</span>
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </main>
            <footer className="relative z-20 w-full bg-transparent mt-auto">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col items-center justify-between gap-4 border-t border-warm-sandy-brown/50 dark:border-warm-sandy-brown/30 pt-8 sm:flex-row">
                <p className="text-sm text-deep-forest-green/70 dark:text-off-white/70">
                    © 2024 Lanka Adventures. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a
                    className="text-sm text-deep-forest-green/70 hover:text-deep-forest-green dark:text-off-white/70 dark:hover:text-off-white"
                    href="#"
                    >
                    Privacy Policy
                    </a>
                    <a
                    className="text-sm text-deep-forest-green/70 hover:text-deep-forest-green dark:text-off-white/70 dark:hover:text-off-white"
                    href="#"
                    >
                    Terms of Service
                    </a>
                </div>
                </div>
            </div>
            </footer>
        </div>
        </div>

  );
}