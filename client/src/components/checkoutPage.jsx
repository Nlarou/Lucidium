import React, { Component } from "react";
import ReactDOM from "react-dom";
import PaypalExpressBtn from "react-paypal-express-checkout";
import "../css/checkOut.css";
class CheckOutPage extends Component {
  constructor(props) {
    super(props);
    window.React = React;
    window.ReactDOM = ReactDOM;
    this.state = {
      userData: null,
      cartData: localStorage.getItem("cart"),
      paymentPaypal: true
    };
  }
  getCartlength = obj => {
    if (obj) {
      var cart = JSON.parse(obj);
      var gameLength = Object.keys(cart).length;
      return gameLength;
    }
    return 0;
  };
  onCheckboxChange = event => {
    this.setState({ paymentPaypal: event });
  };
  sendCartToServer = event => {
    fetch("/getcartData", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: this.state.cartData
    });
  };
  lastRESORT = () => {
    return (
      <form
        action="https://www.sandbox.paypal.com/cgi-bin/webscr"
        method="post"
        onSubmit={this.sendCartToServer()}
      >
        <input type="hidden" name="cmd" value="_xclick" />
        <input type="hidden" name="business" value="Lucidium@gmail.com" />
        <input type="hidden" name="item_name" value="game" />
        <input type="hidden" name="currency_code" value="CAD" />
        <input
          type="hidden"
          name="amount"
          value={getTotal(this.state.cartData)}
        />
        <input
          name="return"
          type="hidden"
          value="http://localhost:5000/transcationSuccess"
        />
        <input
          name="cancel_return"
          type="hidden"
          value="http://localhost:5000/transcationCancel"
        />
        <input
          name="notify_url"
          type="hidden"
          value="http://localhost:5000/transcationValid"
        />
        <hr class="mb-4"></hr>
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          Buy with paypal
        </button>
      </form>
    );
  };

  affichePaypal = () => {
    return <div className="row mt-10">{this.lastRESORT()}</div>;
  };
  afficheCredit = () => {
    return (
      <div className="creditField">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label for="cc-name">Name on card</label>
            <input
              type="text"
              class="form-control"
              id="cc-name"
              placeholder=""
              disabled
            />
            <small class="text-muted">Full name as displayed on card</small>
          </div>
          <div className="col-md-6 mb-3">
            <div class="invalid-feedback">Name on card is required</div>
            <label for="cc-number">Credit card number</label>
            <input
              type="text"
              class="form-control"
              id="cc-number"
              placeholder=""
              disabled
            />
            <div class="invalid-feedback">Credit card number is required</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="cc-expiration">Expiration</label>
            <input
              type="text"
              class="form-control"
              id="cc-expiration"
              placeholder=""
              disabled
            />
            <div class="invalid-feedback">Expiration date required</div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="cc-expiration">CVV</label>
            <input
              type="text"
              class="form-control"
              id="cc-cvv"
              placeholder=""
              disabled
            />
            <div class="invalid-feedback">Security code required</div>
          </div>
          <hr class="mb-4"></hr>
          <button class="btn btn-primary btn-lg btn-block" type="submit">
            Buy
          </button>
        </div>
      </div>
    );
  };
  //Affiche les jeu dans la boite.
  displayGameElement = games => {
    const gameBox = product => {
      return (
        <li class="list-group-item d-flex justify-content-between lh-condensed">
          <div>
            <h6 class="my-0">{product.name + " - " + product.studio}</h6>
            <small class="text-muted">{product.category}</small>
          </div>
          <span class="text-muted">{product.price} $</span>
        </li>
      );
    };

    if (games) {
      if (games.length > 0) {
        var cart = JSON.parse(games);
        var gameLength = Object.keys(cart).length;
        this.state.cartLength = gameLength;
        var element = [];
        for (let i = 0; i < gameLength; i++) {
          element[i] = gameBox(cart[i]);
        }
        return element;
      }
    }
  };

  render() {
    return (
      <div className="container-fullwidth " id="checkoutContainer">
        <div class="row mt-5">
          <div className="col-md-6 ml-5 mr-5">
            <h4 class="mb-3">Billing information</h4>
            <div className="row">
              <div className="col-md-12 mb-3">
                <hr class="mb-4"></hr>
                <h4 class="mb-3">Payment</h4>
                <div class="d-block my-3">
                  <div class="custom-control custom-radio">
                    <input
                      id="credit"
                      name="paymentMethod"
                      type="radio"
                      class="custom-control-input"
                      onClick={e => this.onCheckboxChange(false)}
                      required
                    />
                    <label class="custom-control-label" for="credit">
                      Credit card
                    </label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      class="custom-control-input"
                      required
                      onClick={e => this.onCheckboxChange(true)}
                    />
                    <label class="custom-control-label" for="paypal">
                      Paypal
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {this.state.paymentPaypal
              ? this.affichePaypal()
              : this.afficheCredit()}
          </div>
          <div className="col-md-4">
            <div class="col-md-12 order-md-2 mb-4 m-2">
              <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Your cart</span>
                <span class="badge badge-secondary badge-pill">
                  {this.getCartlength(this.state.cartData)}
                </span>
              </h4>
              <ul class="list-group mb-3">
                {this.displayGameElement(this.state.cartData)}
              </ul>
              <li class="list-group-item d-flex justify-content-between">
                <span>Total</span>
                <strong>{getTotal(this.state.cartData)} $</strong>
              </li>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckOutPage;
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
