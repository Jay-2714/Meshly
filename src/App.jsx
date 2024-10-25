import "./App.css";
import "@google/model-viewer/dist/model-viewer.min.js";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import About from "./components/About/About";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Contact from "./components/Contact/Contact";
import Header from "./components/Header/Header";
import WishList from "./components/Wishlist/WishList";
import { useState } from "react";
import Register from "./components/Register/register";
import Login from "./components/Login/login";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (item) => {
    setWishlist([...wishlist, item]);
  };
  const handleRemoveItem = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(updatedWishlist);
  };
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                addToWishlist={addToWishlist}
                wishlist={wishlist}
                removeFromWishlist={handleRemoveItem}
              />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route
            path="/wishlist"
            element={
              <WishList wishlist={wishlist} onRemoveItem={handleRemoveItem} />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" toastOptions={{duration:2500}}/>
    </>
  );
};

export default App;
