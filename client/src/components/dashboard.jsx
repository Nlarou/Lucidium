import React, { Component } from "react";
import "../css/dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameData: null,
      gameCategoryData: null,
      sessionData: null,
      name: "",
      studio: "",
      price: 0,
      image: "",
      description: ""
    };
  }

  onNameChange = event => {
    this.setState({ name: event.target.value });
  };
  onStudioChange = event => {
    this.setState({ studio: event.target.value });
  };
  onPriceChange = event => {
    this.setState({ price: event.target.value });
  };
  onImageChange = event => {
    this.setState({ image: event.target.value });
  };
  onDescriptionChange = event => {
    this.setState({ description: event.target.value });
  };
  onSubmitAddGame = async () => {
    fetch("/addGame", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name,
        studio: this.state.studio,
        price: this.state.price,
        description: this.state.description,
        image: this.state.image
      })
    }).then(alert("Jeu ajoute"));
  };

  componentDidMount() {
    this.setState({ sessionDatae: this.props.getUser });
  }
  //Affiche tout les jeu du user
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
          <h5 className="card-title">{game.NAME}</h5>
          <h4>
            <small>
              <a>{game.description.substring(0, 20)}...</a>
            </small>
          </h4>
          <hr></hr>
          <div classname="cardBottom">
            <br></br>
            <a href="#" className="btn btn-primary btn-block">
              Jouer
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
    const response = await fetch("/userGames");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };
  renderAllGameUser = () => {
    return this.displayAllCards(this.state.gameData);
  };

  //Admin pour qu'il puissent ajouter un jeu
  adminTool = () => {
    return (
      <div className="col-sm-6 ml-5 mr-5">
        <h1>Admin panel</h1>
        <hr></hr>
        <h2>
          <small>Add game</small>
        </h2>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Name</span>
          </div>
          <input
            type="text"
            class="form-control"
            onChange={this.onNameChange}
            required
          />
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Studio</span>
          </div>
          <input
            type="text"
            class="form-control"
            onChange={this.onStudioChange}
            required
          />
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">$</span>
          </div>
          <input
            type="number"
            class="form-control"
            onChange={this.onPriceChange}
            required
          />
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Image</span>
          </div>
          <input
            type="text"
            class="form-control"
            onChange={this.onImageChange}
            required
          />
        </div>
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Description</span>
          </div>
          <input
            type="text"
            class="form-control"
            onChange={this.onDescriptionChange}
            required
          />
        </div>
        <hr class="mb-4"></hr>
        <button
          className="btn btn-primary btn-lg btn-block"
          type="submit"
          onClick={this.onSubmitAddGame}
        >
          Add game
        </button>
      </div>
    );
  };
  //Affiche soit le dashboard de l'admin ou du user.
  renderByGroup = () => {
    this.state.sessionData = this.props.getUser;
    const affiche = () => {
      if (this.state.sessionData == null) {
        return (
          <div className="mt-5 ml-5">
            <h5>Loading...</h5>
          </div>
        );
      } else if (this.state.sessionData != null) {
        return this.state.sessionData.group == 1
          ? this.renderAllGameUser()
          : this.adminTool();
      }
    };

    return affiche();
  };

  render() {
    return (
      <div className="container-fullwidth vh-100">
        <div className="row" id="shopRow">
          {this.renderByGroup()}
        </div>
      </div>
    );
  }
}

export default Dashboard;
