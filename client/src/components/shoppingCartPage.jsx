import React, { Component } from "react";
import image from "../Image/TestingImage/TestingImage4.jpg";
import "../css/shoppingCartPage.css";

class ShoppingCartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionData: null,
      cartData: [],
      total: 0
    };
  }

  componentDidMount() {
    this.setState({
      cartData: localStorage.getItem("cart"),
      sessionData: this.props.getUser
    });
  }
  isUserConnected = () => {
    this.state.sessionData = this.props.getUser;
    if (this.state.sessionData == null) return false;
    else return true;
  };
  getCart = () => {
    this.setState({
      cartData: localStorage.getItem("cart")
    });
  };
  gameDisplay = game => {
    return (
      <div className="productRow">
        <div className="row">
          <div className="col-sm-2 text-center">
            <div>
              <img
                className="img-fluid img-thumbnail w-165 h-165"
                src={game.image}
              ></img>
            </div>
          </div>
          <div className="col-sm-6">
            <h4 class="product-name">
              <strong>{game.name + " - " + game.studio}</strong>
            </h4>
            <h4>
              <small>{game.description}</small>
            </h4>
            <h4>
              <small>Genre: {game.category}</small>
            </h4>
          </div>
          <div className="col-sm-4 float-left m-auto">
            <a id="productPrice">{game.price} $</a>
            <button
              className="btn btn-xs btn-danger pull-right"
              onMouseDown={this.removeCartItem.bind(this, game)}
            >
              x
            </button>
          </div>
        </div>
        <hr></hr>
      </div>
    );
  };

  removeCartItem = gameItem => {
    var tab = JSON.parse(this.state.cartData);
    for (let i = 0; i < tab.length; i++) {
      if (gameItem.id == tab[i].id) {
        this.state.total -= tab[i].price;
        tab.splice(i, 1);
        break;
      }
    }
    localStorage.setItem("cart", JSON.stringify(tab));
    this.getCart();
    this.props.setCart(localStorage.getItem("cart"));
    this.forceUpdate();
  };
  displayCartElement = obj => {
    if (obj) {
      if (obj.length > 0 && obj != "[]") {
        var cart = JSON.parse(obj);
        getData(cart);
        var gameLength = Object.keys(cart).length;
        var element = [];
        for (let i = 0; i < gameLength; i++) {
          element[i] = this.gameDisplay(cart[i]);
        }

        return element;
      } else {
        return (
          <div className="container-fullwidth vh-100 ml-5">
            <div className="row">
              <div classname="col-sm-12">
                <h3>Cart is empty</h3>
                <h2>
                  <small>Find the game that you want at the store</small>
                </h2>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="container-fullwidth vh-100 ml-5">
          <div className="row">
            <div classname="col-sm-12">
              <h3>Cart is empty</h3>
              <h2>
                <small>Find the game that you want at the store</small>
              </h2>
            </div>
          </div>
        </div>
      );
    }
  };
  render() {
    return (
      <div className="container-fullwidth pl-5">
        <h3>Shopping Cart</h3>
        <hr></hr>
        {this.displayCartElement(this.state.cartData)}
        <div className="row">
          <div className="col-sm-8 text-right">
            <h3>
              <small>Total: {getTotal(this.state.cartData)} $</small>
            </h3>
            <a
              type="button"
              class="btn btn-primary btn-lg"
              onMouseDown={e => {
                this.isUserConnected()
                  ? (e.currentTarget.href = "/checkOut")
                  : (e.currentTarget.href = "/login");
              }}
            >
              Checkout
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ShoppingCartPage;

function getTotal(obj) {
  var total = 0;
  if (obj) {
    if (obj.length > 0 && obj != "[]") {
      var cart = JSON.parse(obj);
      var gameLength = Object.keys(cart).length;

      for (let i = 0; i < gameLength; i++) {
        total += cart[i].price;
      }
    }
  }

  return total.toFixed(2);
}

function getData(games) {
  if (games) {
    var ids = [];
    games.forEach(obj => {
      ids.push(obj.id);
    });

    fetch("/getGamesPrice", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ids)
    })
      .then(res => res.json())
      .then(res => alert(JSON.stringify(res)));
  }
}
