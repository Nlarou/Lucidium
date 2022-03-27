import React, { Component } from "react";
import logo from "./logo.svg";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./components/navbar";
import MainContainer from "./components/indexMainContainer";
import Login from "./components/login.jsx";
import Footer from "./components/footer";
import SignUp from "./components/signup";
import ShoppingCartPage from "./components/shoppingCartPage";
import ShopMainContainer from "./components/shopMainContainer.jsx";
import Test from "./components/testing.jsx";
import CheckOutPage from "./components/checkoutPage";
import Dashboard from "./components/dashboard";
import "./css/app.css";

class App extends Component {
  state = {
    sessionData: null,
    cartData: null
  };
  componentDidMount() {
    // Call our fetch function below once the component mounts
    if (this.state.sessionData == null) {
      this.callBackendAPI()
        .then(res => this.setState({ sessionData: res.userData }))
        .catch(err => console.log(err));
    }
  }
  callBackendAPI = async () => {
    const response = await fetch("/userConnected");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  getUserData = () => {
    return this.state.sessionData;
  };
  resetUserData = user => {
    this.state.sessionData = null;
  };

  setCartData = cart => {
    this.setState({ cartData: cart });
  };
  getCartData = () => {
    return this.state.cartData;
  };

  render() {
    return (
      <div>
        <Router>
          <Navbar
            getUser={this.getUserData()}
            resetUser={this.resetUserData.bind(this)}
            getCartData={this.getCartData()}
          />
          <Route exact path="/">
            <MainContainer />
          </Route>
          <Route exact path="/home">
            <MainContainer />
          </Route>
          <Route exact path="/shop">
            <ShopMainContainer
              setCart={cart => {
                this.setCartData(cart);
              }}
            />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/shoppingcart">
            <ShoppingCartPage
              setCart={cart => {
                this.setCartData(cart);
              }}
              getUser={this.getUserData()}
            />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/test">
            <Test />
          </Route>
          <Route exact path="/checkout">
            <CheckOutPage getUser={this.getUserData()} />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard getUser={this.getUserData()} />
          </Route>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
