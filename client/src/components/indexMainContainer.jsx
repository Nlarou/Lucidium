import React, { Component } from "react";
import "../css/index.css";
import slide1 from "../Image/TestingImage/lemonglass.jpg";
import slide2 from "../Image/TestingImage/Dog.jpg";
import slide3 from "../Image/TestingImage/carousel.jpg";

class MainContainer extends Component {
  render() {
    //Affiche un carroussel
    return (
      <main role="main" className="container-fullwidth">
        <div
          id="carousel-example-2"
          class="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <ol class="carousel-indicators">
            <li
              data-target="#carousel-example-2"
              data-slide-to="0"
              class="active"
            ></li>
            <li data-target="#carousel-example-2" data-slide-to="1"></li>
            <li data-target="#carousel-example-2" data-slide-to="2"></li>
          </ol>
          <div class="carousel-inner" role="listbox">
            <div class="carousel-item active">
              <div class="view">
                <img class="d-block w-100" src={slide3} alt="First slide" />
                <div class="mask rgba-black-light"></div>
              </div>
              <div class="carousel-caption">
                <h3 class="h3-responsive">Light mask</h3>
                <p>First text</p>
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#carousel-example-2"
              role="button"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#carousel-example-2"
              role="button"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </main>
    );
  }
}

export default MainContainer;
