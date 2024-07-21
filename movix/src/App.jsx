import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";

import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import Login from "./Login/Login";
import Register from "./Login/Register";
import ChangePassword from "./Login/changePassword";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  console.log(url);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [enable, setEnable] = useState(true);
  const [dataFromChild, setDataFromChild] = useState(null);
  const handleLogIn = () => {
    setIsLoggedIn(true);
  };
  const handleChangePass = () => {
    setChangePass(true);
  };
  const handleEnable = () => {
    setEnable(false);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setEnable(true);
    setIsLoggedIn(false);
  };
  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);
  const handleDataFromChild = (username, email) => {
    setDataFromChild({ username, email });
  };
  console.log(dataFromChild);
  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    console.log(data);
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };

  return (
    <>
      <BrowserRouter>
        {isLoggedIn && (
          <Header dataFromChild={dataFromChild} handleLogout={handleLogout} />
        )}{" "}
        <Routes>
          {enable && (
            <Route
              path="/login2"
              element={
                <Login
                  handleEnable={handleEnable}
                  handleLogin={handleLogIn}
                  handleChangePass={handleChangePass}
                  sendDataToParent={handleDataFromChild}
                />
              }
            />
          )}
          <Route
            path="/:mediaType/:id"
            element={isLoggedIn ? <Details /> : <Navigate to="/login2" />}
          />
          <Route
            path="/search/:query"
            element={isLoggedIn ? <SearchResult /> : <Navigate to="/login2" />}
          />
          <Route
            path="/explore/:mediaType"
            element={isLoggedIn ? <Explore /> : <Navigate to="/login2" />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="*" element={<PageNotFound />} />
          <Route
            path="/changePass"
            element={
              changePass ? <ChangePassword /> : <Navigate to="/login2" />
            }
          />
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/login2" />}
          />
        </Routes>
        {isLoggedIn && <Footer />}
      </BrowserRouter>
    </>
  );
}

export default App;
