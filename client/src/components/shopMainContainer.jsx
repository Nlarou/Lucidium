import React, { Component } from "react";
import "../css/shop.css";
import img from "../Image/TestingImage/Dog.jpg";
class ShopMainContainer extends Component {
  state = {
    gameData: null,
    gameCategoryData: null
  };

  displayAllCards = obj => {
    var game = JSON.parse(JSON.stringify(obj));
    if (game != null) {
      var gameLength = Object.keys(game).length;
      var element = [];
      for (let i = 0; i < gameLength; i++) {
        element[i] = this.card(game[i]);
      }
      return element;
    }
    return (
      <div class="container">
        {" "}
        <h1>Loading...</h1>
      </div>
    );
  };
  addToCart = game => {
    var tab = [];
    if (localStorage.getItem("cart") == null) {
      tab.push(game);
      localStorage.setItem("cart", JSON.stringify(tab));
    } else {
      tab = JSON.parse(localStorage.getItem("cart"));
      tab.push(game);
      localStorage.setItem("cart", JSON.stringify(tab));
    }
    this.props.setCart(localStorage.getItem("cart"));
  };

  card = game => {
    return (
      <div className="card">
        <img
          href="#"
          src={game.image}
          className="card-img-top"
          id="cardImage"
          alt={game.name}
        />
        <div className="card-body">
          <h5 className="card-title">{game.name}</h5>
          <h4>
            <span className="badge  badge-info">{game.price} $</span>
          </h4>
          <br></br>
          <div className="CategoryIcon">
            {displayAllCategoryAndPlatform(game.category)}
          </div>
          <hr></hr>
          <div classname="cardBottom">
            <br></br>
            <a
              className="btn btn-primary btn-block"
              href="#"
              onMouseDown={e => {
                this.addToCart(game);
              }}
            >
              Add to Cart
            </a>
            <a href="#" className="btn btn-primary btn-block">
              Details
            </a>
          </div>
        </div>
      </div>
    );
  };

  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ gameData: res.gameData }))
      .catch(err => console.log(err));
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch("/games");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  renderAllGame = () => {
    return this.displayAllCards(this.state.gameData);
  };

  render() {
    return (
      <div className="container-fullwidth">
        <div className="row" id="shopRow">
          {this.renderAllGame()}
        </div>
      </div>
    );
  }
}

export default ShopMainContainer;

const displayAllCategoryAndPlatform = obj => {
  var element = [];
  var splObj = obj.split(",");
  for (let index = 0; index < splObj.length; index++) {
    element[index] = (
      <span class="badge  badge-success mr-2">{splObj[index]}</span>
    );
  }
  return element;
};
