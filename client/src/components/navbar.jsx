import React, { Component } from "react";
import logo1 from "../Image/LucidiumLogo4.png";
import logo2 from "../Image/LucidiumLogo6.png";
import logo3 from "../Image/LucidiumLogo2.png";
import logo4 from "../Image/LucidiumLogo5.png";
import shoppingCart from "../Image/icon-shopping-cart-white.png";
import shoppingCartHover from "../Image/icon-shopping-cart-orange.png";
import loginIconNormal from "../Image/login-icon-smallN.png";
import loginIconHover from "../Image/login-icon-smallSelect.png";
import "../css/navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionData: null,
      cartData: [],
      cartLength: null
    };
  }

  componentDidMount() {
    this.setState({
      cartData: localStorage.getItem("cart"),
      cartLength: this.getCartlength(localStorage.getItem("cart"))
    });
  }
  componentWillReceiveProps() {
    this.setState({
      cartData: localStorage.getItem("cart"),
      cartLength: this.getCartlength(localStorage.getItem("cart"))
    });
  }
  //Deconnecte le user
  userDeconection = () => {
    const requete = fetch("/userLogout");
    this.state.sessionData = null;
    let bob = this.props.resetUser;
  };
  //Demande a app si le user est connecter
  isUserConnected = () => {
    this.state.sessionData = this.props.getUser;
    if (this.state.sessionData == null) return false;
    else return true;
  };
  //Prend le cart dans la localStorage
  getCart = () => {
    this.setState({
      cartData: localStorage.getItem("cart"),
      cartLength: this.getCartlength(localStorage.getItem("cart"))
    });
  };
  getCartlength = obj => {
    if (obj) {
      var cart = JSON.parse(obj);
      var gameLength = Object.keys(cart).length;
      return gameLength;
    }
  };

  //Affiche le cart dans la navbar
  displayAllCartElement = obj => {
    if (obj) {
      if (obj.length > 0) {
        var cart = JSON.parse(obj);
        var gameLength = Object.keys(cart).length;
        this.state.cartLength = gameLength;
        var element = [];
        for (let i = 0; i < gameLength; i++) {
          element[i] = this.addCartElement(cart[i]);
        }
        return element;
      } else {
        return (
          <div className="container">
            {" "}
            <h3>Cart is empty :(</h3>
          </div>
        );
      }
    }
  };
  //Permet d'enlever un item du cart
  removeCartItem = gameItem => {
    var tab = JSON.parse(this.state.cartData);
    for (let i = 0; i < tab.length; i++) {
      if (gameItem.id == tab[i].id) {
        tab.splice(i, 1);
        break;
      }
    }
    localStorage.setItem("cart", JSON.stringify(tab));
    this.getCart();
    this.forceUpdate();
  };

  //Ajoute un item au cart
  addCartElement = game => {
    return (
      <li>
        <span className="item">
          <span className="item-right">
            <button
              className="btn btn-xs btn-danger pull-right"
              id="btnDelete"
              onMouseDown={this.removeCartItem.bind(this, game)}
            >
              x
            </button>
          </span>
          <span className="img-top" id="cartImage">
            <img src={game.image} className="img-fluid" alt="" id="imageCart" />
          </span>
          <span className="item-info">
            <span>
              <strong>{game.name}</strong>
            </span>
            <br></br>
            <span>
              <small>{game.price}</small> $
            </span>
          </span>
          <hr></hr>
        </span>
      </li>
    );
  };
  //Affiche soit Login ou le portail usager
  showLoginDropdown = () => {
    if (this.isUserConnected()) {
      return (
        <button className="btn">
          <div className="dropdown">
            <a
              className="nav-link dropdown-toggle"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onMouseOver={e =>
                (e.currentTarget.firstChild.src = loginIconHover)
              }
              onMouseOut={e =>
                (e.currentTarget.firstChild.src = loginIconNormal)
              }
            >
              <img
                className="img-fluid"
                id="loginIcon"
                src={loginIconNormal}
              ></img>
              {this.state.sessionData.group == 1 ? "" : "Admin - "}
              {this.state.sessionData.username}
            </a>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" href="/dashboard">
                Dashboard
              </a>
              <a
                className="dropdown-item"
                href="/home"
                onMouseDown={e => this.userDeconection()}
              >
                Logout
              </a>
            </div>
          </div>
        </button>
      );
    } else {
      return (
        <button className="btn">
          <a
            className="nav-link"
            href="/login"
            onMouseOver={e => (e.currentTarget.firstChild.src = loginIconHover)}
            onMouseOut={e => (e.currentTarget.firstChild.src = loginIconNormal)}
          >
            <img
              className="img-fluid"
              id="loginIcon"
              src={loginIconNormal}
            ></img>
            Login
          </a>
        </button>
      );
    }
  };

  render() {
    return (
      <nav className="navbar sticky-top navbar-expand-md navbar-dark bg-black">
        <a className="navbar-brand" href="/home">
          <img
            className="img-fluid"
            id="logo"
            alt="Logo Lucidium"
            src={logo2}
            width="75%"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target=".navbar-collapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto mt-2 mt-md-0">
            <li className="nav-item" id="browseContainer">
              <button className="btn" href="/shop">
                <a className="nav-link" href="/shop">
                  Browse
                </a>
              </button>
            </li>
            <form
              className="form-inline mr-auto"
              action={e => e.currentTarget.firstChild.value}
            >
              <input
                className="form-control mr-sm-2"
                id="searchInput"
                type="text"
                placeholder="Search..."
                aria-label="Search"
              />
              <button
                className="btn btn-elegant btn-rounded btn-sm my-0"
                type="submit"
                id="btnSearch"
              >
                Search
              </button>
            </form>
          </ul>
          <ul className="navbar-nav my-2 my-md-0 ">
            <li className="nav-item" id="shoppingCartContainer">
              <button className="btn">
                <ul className="dropdown" role="menu">
                  <a
                    className="nav-link"
                    onMouseOver={e =>
                      (e.currentTarget.firstChild.src = shoppingCartHover)
                    }
                    onMouseOut={e =>
                      (e.currentTarget.firstChild.src = shoppingCart)
                    }
                    onMouseDown={e => this.getCart()}
                    data-toggle="dropdown"
                    role="button"
                    aria-expanded="false"
                  >
                    <img className="img-fluid" id="" src={shoppingCart}></img>
                    {this.state.cartData ? this.state.cartLength : "0"}
                  </a>
                  <ul
                    className="dropdown-menu scrollable-menu dropdown-menu-right "
                    role="menu"
                    id="dropdownContainer"
                  >
                    {this.displayAllCartElement(this.state.cartData)}
                    <li className="divider"></li>
                    <li>
                      <a className="btn btn-primary" href="/shoppingcart">
                        View Cart
                      </a>
                    </li>
                  </ul>
                </ul>
              </button>
            </li>
            <li className="nav-item">{this.showLoginDropdown()}</li>
          </ul>
        </div>
      </nav>
    );
  }
}
export default Navbar;
