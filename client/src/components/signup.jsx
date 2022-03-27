import React, { Component } from "react";
import "../css/signup.css";
const JSEncrypt = require("node-jsencrypt");
const encrypt = new JSEncrypt();
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: ""
    };
  }
  onUsernameChange = event => {
    this.setState({ username: event.target.value });
  };
  onEmailChange = event => {
    this.setState({ email: event.target.value });
  };
  onFirstNameChange = event => {
    this.setState({ firstname: event.target.value });
  };
  onLastNameChange = event => {
    this.setState({ lastname: event.target.value });
  };
  onPasswordChange = event => {
    this.setState({ password: event.target.value });
  };
  onSubmitSignIn = async () => {
    fetch("/signUp", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        password: await jsEncryptPassword(this.state.password)
      })
    });
  };
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-5 mx-auto">
            <div className="loginForm">
              <div class="logo mb-3">
                <div class="col-md-12 text-center">
                  <h1>Signup</h1>
                </div>
              </div>
              <div class="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  class="form-control"
                  id="username"
                  aria-describedby="emailHelp"
                  placeholder="Enter Username"
                  onChange={this.onUsernameChange}
                />
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  class="form-control"
                  id="firstname"
                  aria-describedby="emailHelp"
                  placeholder="Enter Firstname"
                  onChange={this.onFirstNameChange}
                />
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  class="form-control"
                  id="lastname"
                  aria-describedby="emailHelp"
                  placeholder="Enter Lastname"
                  onChange={this.onLastNameChange}
                />
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input
                  type="email"
                  name="email"
                  class="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  onChange={this.onEmailChange}
                />
              </div>
              <div class="form-group">
                <label for="exampleInputEmail1">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  class="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter Password"
                  onChange={this.onPasswordChange}
                />
              </div>
              <div class="col-md-12 text-center mb-3">
                <button
                  type="submit"
                  class=" btn btn-block mybtn btn-primary tx-tfm"
                  onClick={this.onSubmitSignIn}
                >
                  Get Started For Free
                </button>
              </div>
              <div class="col-md-12 ">
                <div class="form-group">
                  <p class="text-center">
                    <a href="/login" id="signin">
                      Already have an account?
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;

async function jsEncryptPassword(password) {
  var publicKey;
  await getSecretKey()
    .then(res => (publicKey = res.secret))
    .catch(err => console.log(err));
  encrypt.setPublicKey(publicKey);
  var encryptedPassword = encrypt.encrypt(password);
  return encryptedPassword;
}

async function getSecretKey() {
  const response = await fetch("/getKeys", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    },
    body: null
  });
  const body = await response.json();
  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
