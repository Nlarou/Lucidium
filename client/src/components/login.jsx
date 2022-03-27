import React, { Component } from "react";
import "../css/login.css";
const JSEncrypt = require("node-jsencrypt");
const encrypt = new JSEncrypt();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  onEmailChange = event => {
    // this.setState({ email: event.target.value });
  };
  onPasswordChange = event => {
    // this.setState({ password: event.target.value });
  };
  onSubmitSignIn = async () => {
    const reponse = fetch("/authentification", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: await jsEncryptPassword(this.state.password)
      })
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.encryptData().then(res => this.refs["loginform"].submit());
  };

  encryptData = async () => {
    var pass = document.getElementById("password").value;
    if (pass == "") {
      alert("Le mots de passe est vide.");
      return false;
    } else {
      var encryptedPass = await jsEncryptPassword(pass);
      document.getElementById("password").value = encryptedPass;
      return true;
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-5 mx-auto">
            <div className="loginForm">
              <div className="logo mb-3">
                <div className="col-md-12 text-center">
                  <h1>Login</h1>
                </div>
              </div>
              <form
                method="POST"
                action="authentification"
                onSubmit={this.handleSubmit.bind(this)}
                ref="loginform"
              >
                <div className="form-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    onChange={this.onEmailChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter Password"
                    onChange={this.onPasswordChange}
                  />
                </div>
                <div className="form-group">
                  <p className="text-center">
                    By signing up you accept our <a href="#">Terms Of Use</a>
                  </p>
                </div>
                <div className="col-md-12 text-center ">
                  <button className=" btn btn-block mybtn btn-primary tx-tfm">
                    Login
                  </button>
                </div>
              </form>
              <div className="col-md-12 ">
                <hr className="hr-or" />
              </div>
              <div className="form-group">
                <p className="text-center">
                  Don't have account?{" "}
                  <a href="/signup" id="signup">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

//Encryption du mots de passe
async function jsEncryptPassword(password) {
  var publicKey;
  await getSecretKey()
    .then(res => (publicKey = res.secret))
    .catch(err => console.log(err));
  encrypt.setPublicKey(publicKey);
  var encryptedPassword = encrypt.encrypt(password);
  return encryptedPassword;
}
//Demande la clé publique au server
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
