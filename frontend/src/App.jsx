/* ==========================================================
   ROUTING LOGIC: Guest-Friendly Access Split
   ========================================================== */
function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />
      
      <Routes>
        {/* 🟢 ENTRY & AUTH ROUTES (No Layout) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 🔵 PUBLIC APP HUB (Accessible to Guests/Unauthenticated) */}
        {[
          { path: "/home", element: <Home /> },
          { path: "/live-scores", element: <LiveScore /> },
          { path: "/match/:id", element: <MatchDetail /> },
          { path: "/schedules", element: <Schedules /> },
          { path: "/schedules/:seriesId", element: <SeriesPage /> },
          { path: "/teams", element: <Teams /> },
          { path: "/teams/:teamId", element: <TeamDetails /> },
          { path: "/stats", element: <Stats /> },
          { path: "/news", element: <News /> },
          { path: "/about", element: <AboutUs /> },
          { path: "/contact", element: <Contact /> },
          { path: "/privacy", element: <PrivacyPolicy /> },
          { path: "/terms", element: <TermsOfService /> },
        ].map((route) => (
          <Route 
            key={route.path}
            path={route.path} 
            element={
              <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                {route.element}
              </AppLayout>
            } 
          />
        ))}

        {/* 🔒 SECURED USER ROUTES (Requires valid JWT) */}
        {[
          { path: "/profile", element: <ProfilePage /> },
          { path: "/premium", element: <PremiumFeatures /> },
        ].map((route) => (
          <Route 
            key={route.path}
            path={route.path} 
            element={
              <PrivateRoute>
                <AppLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
                  {route.element}
                </AppLayout>
              </PrivateRoute>
            } 
          />
        ))}

        {/* 🔴 404 FALLBACK */}
        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center bg-[#080a0f] text-white">
            <h1 className="text-6xl font-black italic text-blue-500 mb-4 uppercase tracking-tighter">404</h1>
            <p className="uppercase font-black tracking-widest text-[10px] text-slate-500">The Arena is Empty | Page Not Found</p>
            <button 
               onClick={() => window.location.href='/home'} 
               className="mt-8 px-8 py-3 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5"
            >
               Return to Base
            </button>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}