import { Routes, Route } from "react-router";

import React, { useEffect, useState } from 'react'
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";

import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "./lib/axios.js";
import { Navigate } from "react-router";

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

  const { data: authData, isLoading, error } = useQuery({

    queryKey: ["authUser"],
    queryFn: async () => {

      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,    // auth check
  });

  const authUser = authData?.user

  return <div className="h-screen" data-theme="forest"> 

    {/* <button onClick={() => toast.success("Heelo")}>Create a toast</button> */}
    
    <Routes>
      <Route path='/' element={ authUser ? <HomePage /> : <Navigate to="/login" /> } />
      <Route path='/signup' element={ !authUser ? <SignUpPage /> : <Navigate to="/" /> } />
      <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to="/" /> } />
      <Route path='/notifications' element={ authUser ? <NotificationsPage /> : <Navigate to="/login" /> } />
      <Route path='/call' element={ authUser ? <CallPage /> : <Navigate to="/login" /> } />
      <Route path='/chat' element={ authUser ? <ChatPage /> : <Navigate to="/login" /> } />
      <Route path='/onboarding' element={ authUser ? <OnboardingPage /> : <Navigate to="/login" /> } />
    </Routes>

    <Toaster />
  </div>
}

export default App