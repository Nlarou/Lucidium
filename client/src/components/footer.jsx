import React, { Component } from "react";
import "../css/footer.css";
class Footer extends Component {
  render() {
    return (
      <footer class="page-footer font-small blue pt-4">
        <div class="container-fluid text-center text-md-left">
          <div class="row">
            <div class="col-md-6 mt-md-0 mt-3">
              <h5 class="text-uppercase">Lucidium</h5>
              <p>Best shop ever</p>
            </div>

            <div class="clearfix w-100 d-md-none pb-3">
              <div class="col-md-3 mb-md-0 mb-3">
                <h5 class="text-uppercase">Links</h5>

                <ul class="list-unstyled">
                  <li>
                    <a href="#!">Shop</a>
                  </li>
                  <li>
                    <a href="#!">Contact</a>
                  </li>
                  <li>
                    <a href="#!">Cart</a>
                  </li>
                  <li>
                    <a href="#!">Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-copyright text-center py-3">
          © 2019 Copyright:
          <a>Lucidium</a>
        </div>
      </footer>
    );
  }
}

export default Footer;
