import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased h-screen flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Header / Branding Section */}
      <header className="flex-1 flex flex-col items-center justify-end pb-8 px-6">
        <div className="w-full max-w-sm mx-auto text-center space-y-6">
          {/* Logo Container */}
          <div className="relative w-24 h-24 mx-auto rounded-2xl bg-white dark:bg-gray-800 shadow-xl shadow-primary/10 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
            <img
              alt="Karang Taruna Logo Symbol"
              className="w-16 h-16 object-contain opacity-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGPNKMhtQ05Nd5l6ftQ3sOYPJfcvj-tEFcFR53DVmyhz2oxREHQvJ5LpdtIhtUNBvf7AJAyIQ1TwZbVitVa0vYWQloUwoWMKTv0kIK8lX4n26i3PXMTHdMS6hc7klEyt1Hx510kh4NL9OtQpyTvy0g2dLcqKkGlytIbUYWor0-lX4-bcV9JT2_jqkU6QpjUEz5NKfmu52iyskGk7y2hD5jcfv1PD-cJxPsDMkw7gW_uWaXfs9SVw9HbjDsenillz3DBolucCWSWkc"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Karang Taruna
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Manage your organization effectively.
            </p>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-1 px-6 w-full max-w-sm mx-auto">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-icons-round text-xl">mail_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                id="email"
                name="email"
                placeholder="member@karangtaruna.org"
                type="email"
              />
            </div>
          </div>
          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="password">
                Password
              </label>
              <a className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="material-icons-round text-xl">lock_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-10 py-3 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 text-sm"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer focus:outline-none"
                type="button"
              >
                <span className="material-icons-round text-xl">visibility_off</span>
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <button
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-semibold text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform active:scale-[0.98] mt-4"
            type="submit"
          >
            Log In
          </button>
        </form>

        {/* Alternative Login */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-light dark:bg-background-dark text-gray-400">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" type="button">
              <span className="sr-only">Sign in with Google</span>
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"></path>
              </svg>
            </button>
            <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" type="button">
              <span className="sr-only">Sign in with Apple</span>
              <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"></path>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Footer / Register Link */}
      <footer className="py-8 text-center px-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Join the movement.
          <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
            Register Here
          </Link>
        </p>
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </footer>
    </div>
  );
};

export default Login;
