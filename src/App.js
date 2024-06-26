import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "./components/loading/LoadingScreen";
import Sidebar from "./components/sidebar/Sidebar";
import { refreshToken } from "./redux/actions/authAction";
import { getPosts } from "./redux/actions/postAction";

import Peer from "peerjs";
import io from "socket.io-client";

import InstagramLoading from "./components/loading/InstagramLoading";
import CallModal from "./components/message/CallModal";
import Toast from "./components/toast/Toast";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import { getNotifies } from "./redux/actions/notifyAction";
import SocketClient from "./utils/SocketClient";
import { baseURL } from "./utils/fetchData";

const PageRender = React.lazy(() => import("./customRouters/PageRender"));

const HomePage = React.lazy(() => import("./pages/home"));
const SignIn = React.lazy(() => import("./pages/signin"));
const SignUp = React.lazy(() => import("./pages/signup"));

const App = () => {
  const { access_token } = useSelector((state) => state.auth);
  const { call } = useSelector((state) => state);
  const { loadingHomeScreen, error, loading } = useSelector(
    (state) => state.alert
  );
  const [firstLogin, setFirstLogin] = useState(
    localStorage.getItem("firstLogin")
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token) {
      dispatch(getPosts(access_token));
      dispatch(getNotifies(access_token));
    }
  }, [access_token, dispatch]);

  useEffect(() => {
    // socket
    const socket = io(baseURL);
    socket.connect();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });

    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
        }
      });
    }
  }, []);

  useEffect(() => {
    setFirstLogin(localStorage.getItem("firstLogin"));
    if (!firstLogin) return;
    dispatch(refreshToken());
  }, [dispatch, firstLogin]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: "/",
      secure: true,
    });
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
  }, [dispatch]);

  if (loadingHomeScreen) return <LoadingScreen />;

  return (
    <div className="flex">
      <ToastContainer />

      <BrowserRouter>
        {access_token && <Sidebar />}
        {access_token && <SocketClient />}
        {call && <CallModal />}
        {(error || loading) && <Toast />}

        <Suspense fallback={<InstagramLoading />}>
          <div
            className={`${
              access_token
                ? "ml-sidebar-width-mobile xl:ml-sidebar-width"
                : "w-full"
            }  w-full`}
          >
            <Routes>
              <Route
                path="/"
                element={access_token ? <HomePage /> : <SignIn />}
              />
              <Route
                path="/signup"
                element={access_token ? <Navigate to="/" /> : <SignUp />}
              />

              <Route path="/:page" element={<PageRender />} />
              <Route path="/:page/:id" element={<PageRender />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;
