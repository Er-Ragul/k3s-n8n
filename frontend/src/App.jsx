import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Simple validation helpers
  const emailValid = (v) => /\S+@\S+\.\S+/.test(v);
  const passwordValid = (v) => v && v.length >= 6;
  const confirmValid = (v1, v2) => v1 === v2;

  const errors = {
    email: !email ? "Email is required" : !emailValid(email) ? "Email is invalid" : "",
    password: !password ? "Password is required" : !passwordValid(password) ? "Password must be at least 6 characters" : "",
    confirmPassword:
      mode === "signup"
        ? !confirmPassword
          ? "Please confirm your password"
          : !confirmValid(password, confirmPassword)
          ? "Passwords do not match"
          : ""
        : "",
  };

  const hasErrors = () => {
    if (mode === "login") return !!(errors.email || errors.password);
    return !!(errors.email || errors.password || errors.confirmPassword);
  };

  function handleBlur(field) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    // Mark all fields as touched to show errors
    setTouched({ email: true, password: true, confirmPassword: true });

    if (hasErrors()) {
      // invalid — keep UI visible for corrections
      return;
    }

    // Simulate successful submit
    if (mode === "login") {
        axios.post('http://dev.raguls.in/webhook/signin', {
          email: email,
          password: password
        })
        .then(function (response) {
          if(response.data.status == 'success'){
            alert('User authenticated successfully')
          }
          else{
            alert(response.data.reason)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios.post('http://dev.raguls.in/webhook/signup', {
          email: email,
          password: password
        })
        .then(function (response) {
          if(response.data.status == 'success'){
            alert('User account created successfully')
          }
          else{
            alert(response.data.reason)
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    }

    // Reset after successful action (in production, redirect or update app state)
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow-none md:shadow-xl rounded-3xl overflow-hidden">

          {/* Left: Form Card */}
          <div className="flex items-center justify-center p-8 bg-white">
            <div className="w-full max-w-md">
              <div className="mb-6 text-center">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
                <p className="mt-2 text-sm text-gray-500">{mode === "login" ? "Sign in to continue to your dashboard" : "Sign up to get started"}</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className={`mt-1 mb-4 relative rounded-lg shadow-sm border ${touched.email && errors.email ? "border-red-300" : "border-gray-200"}`}>
                  <input
                    aria-label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className="w-full px-4 py-3 bg-white rounded-lg outline-none transition duration-150 placeholder-gray-400"
                    placeholder="you@example.com"
                  />
                </div>
                {touched.email && errors.email ? (
                  <p className="text-xs text-red-500 mb-2">{errors.email}</p>
                ) : null}

                {/* Password */}
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className={`mt-1 mb-4 relative rounded-lg shadow-sm border flex items-center ${touched.password && errors.password ? "border-red-300" : "border-gray-200"}`}>
                  <input
                    aria-label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className="w-full px-4 py-3 bg-white rounded-lg outline-none transition duration-150 placeholder-gray-400"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="pr-3 pl-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3C5 3 1.73 6.11.48 10c1.25 3.89 4.52 7 9.52 7s8.27-3.11 9.52-7C18.27 6.11 15 3 10 3zM7 10a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.98 12.25C4.23 8.36 7.5 5.25 12 5.25c4.5 0 7.77 3.11 9.02 6.99-.99 3.08-3.24 5.52-6.02 6.78M15 15a3 3 0 01-3 3 3 3 0 01-3-3" />
                      </svg>
                    )}
                  </button>
                </div>
                {touched.password && errors.password ? (
                  <p className="text-xs text-red-500 mb-2">{errors.password}</p>
                ) : null}

                {/* Confirm Password for signup */}
                {mode === "signup" && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className={`mt-1 mb-4 relative rounded-lg shadow-sm border flex items-center ${touched.confirmPassword && errors.confirmPassword ? "border-red-300" : "border-gray-200"}`}>
                      <input
                        aria-label="Confirm password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        className="w-full px-4 py-3 bg-white rounded-lg outline-none transition duration-150 placeholder-gray-400"
                        placeholder="Re-enter your password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        className="pr-3 pl-2 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3C5 3 1.73 6.11.48 10c1.25 3.89 4.52 7 9.52 7s8.27-3.11 9.52-7C18.27 6.11 15 3 10 3zM7 10a3 3 0 116 0 3 3 0 01-6 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.98 12.25C4.23 8.36 7.5 5.25 12 5.25c4.5 0 7.77 3.11 9.02 6.99-.99 3.08-3.24 5.52-6.02 6.78M15 15a3 3 0 01-3 3 3 3 0 01-3-3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword ? (
                      <p className="text-xs text-red-500 mb-2">{errors.confirmPassword}</p>
                    ) : null}
                  </>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className={`w-full mt-2 py-3 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 ${hasErrors() ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  disabled={hasErrors()}
                >
                  {mode === "login" ? "Sign in" : "Create account"}
                </button>

                {/* Helper and switch link */}
                <div className="mt-4 text-center text-sm text-gray-600">
                  {mode === "login" ? (
                    <>
                      <span>Don't have an account? </span>
                      <button type="button" onClick={() => { setMode("signup"); setTouched({}); }} className="font-medium text-indigo-600 hover:underline ml-1">Sign up</button>
                    </>
                  ) : (
                    <>
                      <span>Already have an account? </span>
                      <button type="button" onClick={() => { setMode("login"); setTouched({}); }} className="font-medium text-indigo-600 hover:underline ml-1">Login</button>
                    </>
                  )}
                </div>

                {/* Small note for accessibility */}
                <p className="mt-3 text-xs text-gray-400">By continuing you agree to our Terms of Service and Privacy Policy.</p>
              </form>
            </div>
          </div>

          {/* Right: Branding / Illustration */}
          <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50">
            <div className="max-w-lg text-center">
              {/* Decorative rounded illustration card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="rounded-full bg-indigo-600 p-3 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">Beautifully simple authentication</h3>
                <p className="text-sm text-gray-500 mb-4">A minimal, modern design with accessible form controls and subtle motion to make the experience pleasant across devices.</p>

                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Responsive for all screen sizes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
                      <path d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                    <span>Clear form validation states</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-1 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      <path d="M4 12a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
                    </svg>
                    <span>Accessible & keyboard-friendly</span>
                  </li>
                </ul>
              </div>

              {/* Large abstract illustration */}
              <div className="mt-6">
                <svg viewBox="0 0 600 400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <g transform="translate(50,20)">
                    <rect x="0" y="0" rx="24" ry="24" width="500" height="280" fill="url(#g1)" opacity="0.12" />
                    <circle cx="420" cy="60" r="40" fill="#c7b3ff" opacity="0.25" />
                    <circle cx="60" cy="180" r="60" fill="#eef2ff" />
                    <rect x="120" y="120" rx="16" ry="16" width="260" height="90" fill="#fff" opacity="0.7" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}