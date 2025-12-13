import { Routes, Route } from "react-router";

import React from 'react'
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";

const App = () => {

  // axios
  // react query tanstack query

  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {

  //   const getData = async () => {
  //     setIsLoading(true);

  //     try {
  //       const data = await fetch("https://");
  //       const json = await data.json();
  //       setData(json);
  //     } catch (error) {
        
  //       setError(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   getData();
  // }, [])

  // mutation : post put delete
  // query : get

  // const { data } = useQuery({ queryKey: ["todos"],  // comp mounts -> runs automatically
  //   queryFn: async() => {
  //     const res = await fetch("https://");
  //     const data = await res.json();
  //     return data;                                  // data is cached under "todos"
  //   },
  // });                                              // component re-renders with data

  const { isLoading, authUser } = useAuthUser();
  
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;

  if(isLoading)   return <PageLoader />

  return <div className="h-screen" data-theme="dark"> 

    {/* <button onClick={() => toast.success("Heelo")}>Create a toast</button> */}

    <Routes>
      <Route 
        path='/' 
        element={ 
          isAuthenticated  && isOnboarded ? (
            <HomePage />
          ) : (
            <Navigate to={ !isAuthenticated ? "/login" : "/onboarding" } />
          )
        } 
      />
      <Route path='/signup' element={ !isAuthenticated ? <SignUpPage /> : <Navigate to="/" /> } />
      <Route path='/login' element={ !isAuthenticated ? <LoginPage /> : <Navigate to="/" /> } />
      <Route path='/notifications' element={ isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" /> } />
      <Route path='/call' element={ isAuthenticated ? <CallPage /> : <Navigate to="/login" /> } />
      <Route path='/chat' element={ isAuthenticated ? <ChatPage /> : <Navigate to="/login" /> } />
      <Route
        path="/onboarding"
        element={
          isAuthenticated ? (
            !isOnboarded ? (
              <OnboardingPage />
            ) : (
              <Navigate to="/" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>

    <Toaster />
  </div>
}

export default App