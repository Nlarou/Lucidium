const express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var mysql = require("mysql");
const JSEncrypt = require("node-jsencrypt");
const decrypt = new JSEncrypt();

//Connection SQL
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "lucidium"
});
//Constante pour la session
const TWO_HOUR = 1000 * 60 * 60 * 2;
const SESSION_NAME = "lucid";
const SESSION_LIFETIME = TWO_HOUR;
const SECRET = "N4th4ni3lIsTh3B3stDud3";
//Private key et notre key public pour l'encryption.
const privateKey =
  "MIICXgIBAAKBgQCTDYtRGhrIwXy4FxtM6OxjND9ABiEIDqLYmVjUxUbfyFaJ7Ff5" +
  "sGZStkmSay1fFl72HZHrnX7CunokZb6Vm2bfftTjGlB1mnVgVQyaxUUmd53JFiL2" +
  "EAGlBaVUnTMv0e74OBsK2fL41ETX33ujaKqggRVHdbWd+9fpcR94hJ1PfQIDAQAB" +
  "AoGBAIkkWImKjvArguUsp4lSsSLT1ykeji+1dqoKWY4VbcPGUu7OPD3hBYyd9H9Y" +
  "9Td45ZcifLQAbfetcbwAJ33fMFBRhXfthtROvM9WttdlQufsUYKKaNk1NZ80BVO3" +
  "1bHVH0Tl0WDwYneM+1Q++98AIgrMV33znifINcryvho2s8ABAkEA4D9q+rlcbCFJ" +
  "A7C8Zo4ppN8rPEN6ngebtJMB/aBVOuskoREChfRgfVvWNtPo2aVqCaVAy7c3Zwsv" +
  "sdp6mYFkvQJBAKff83yc/PGssaPldbUwXWVnCCeykQhMPwXcaOJqeEywnjlkV2Y1" +
  "YXS4WRI0Vg1GCcYavSsVEj+zLeqoY4+kIcECQQDXx25TcAWk7qppaKkBLg6YXT4n" +
  "MO9OHRgQu9yQhrU8ioOmkM2SxEIMnlAUVfibZXYRbfhZjiU7fCIay5ZpG38pAkEA" +
  "lk1/3mFcYzEgd0K5ibk81c5S0eAh1FEX2DKIQbfb76XudCovylYe5HctYIw1Q3si" +
  "wxkrp4gdJ6VQhhmv0mq8wQJAG9n04l6HR6NQm5GMGyDMRSS4ypjaTgMA1CKiA+u1" +
  "seWoyvqmzrpaC9zMHxMxCsud9IUxTp984IBqlW243jlCWQ==";

const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTDYtRGhrIwXy4FxtM6OxjND9A" +
  "BiEIDqLYmVjUxUbfyFaJ7Ff5sGZStkmSay1fFl72HZHrnX7CunokZb6Vm2bfftTj" +
  "GlB1mnVgVQyaxUUmd53JFiL2EAGlBaVUnTMv0e74OBsK2fL41ETX33ujaKqggRVH" +
  "dbWd+9fpcR94hJ1PfQIDAQAB";

//On set la decryptino key
decrypt.setPrivateKey(privateKey);

const app = express();
const port = process.env.PORT || 5000;
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var fileStoreOptions = {};
//La session
app.use(
  session({
    name: SESSION_NAME,
    genid: function() {
      return uuidv4();
    },
    store: new FileStore(fileStoreOptions),
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: TWO_HOUR }
  }),
  express.urlencoded({ extended: true })
);
// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

//Authentifaction du user avec l'encryption
app.post("/authentification", function(request, response) {
  console.log("Mots de passe recu: " + JSON.stringify(request.body.password));

  var email = request.body.email;
  var pass = JSdecryptPassword(request.body.password);
  if (email && pass) {
    con.query("select password from user where email = ?", [email], function(
      err,
      result,
      fields
    ) {
      if (err) throw err;
      if (result.length > 0) {
        var decryptedPasswordDB = JSdecryptPassword(result[0].password);
        if (decryptedPasswordDB != pass) {
          console.log("Mauvais password");
        }
      }
    });
    con.query(
      "SELECT id,username,name,lastname,phone,address,user.group FROM user WHERE email = ?",
      [email],
      function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          request.session.user = {
            id: result[0].id,
            email: email,
            name: result[0].name,
            username: result[0].username,
            lastname: result[0].lastname,
            phone: result[0].phone,
            address: result[0].address,
            group: result[0].group
          };

          response.redirect("/home");
        }
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

//Signup d'un nouveau user
app.post("/signUp", function(request, response) {
  console.log(JSON.stringify(request.body));
  var username = request.body.username;
  var name = request.body.firstname;
  var lastname = request.body.lastname;
  var email = request.body.email;
  var pass = request.body.password;
  if (email && username && pass) {
    con.query(
      "SELECT id FROM user WHERE email = ? AND username = ?",
      [email, username],
      function(err, result, fields) {
        if (err) throw err;
        if (result.length == 0) {
          con.query(
            "INSERT INTO user (username, password, email, name, lastname) VALUES (?,?,?,?,?)",
            [username, pass, email, name, lastname],
            function(err, result, fields) {
              if (err) throw err;
              console.log("USER: " + username + " CREATED");
            }
          );
        } else {
          response.redirect("/signup");
          response.end();
        }
        response.redirect("/home");
        response.end();
      }
    );
  } else {
    console.log("Something is wrong");
    response.redirect("/signup");
  }
});

//Donne la clé publique
app.post("/getKeys", (request, response) => {
  response.send({ secret: publicKey });
});

//Envoi les informations de la session au browser
app.get("/userConnected", (request, response) => {
  if (request.session.user != null) {
    console.log("User " + request.session.user.email + " is browsing ");
    response.send({ userData: request.session.user });
  } else {
    console.log("Guest is browsing ");
  }
});

//Tout les phases de du payement paypal
var tempUser = {};
app.post("/getcartData", (request, response) => {
  request.session.cart = request.body;
  tempUser.cart = request.body;
  tempUser.user = request.session.user;
});

app.get("/transcationSuccess", (request, response) => {
  var userId = request.session.user.id;
  if (!userId) {
    tempUser.cart.forEach(game => {
      console.log(JSON.stringify(game.name));
      con.query(
        "INSERT INTO userlibrary(user_id,game_id) VALUES(?,?)",
        [tempUser.user.id, game.id],
        function(err, result, fields) {
          if (err) throw err;
        }
      );
    });
  } else {
    var cart = request.session.cart;
    cart.forEach(game => {
      console.log(JSON.stringify(game.name));
      con.query(
        "INSERT INTO userlibrary(user_id,game_id) VALUES(?,?)",
        [userId, game.id],
        function(err, result, fields) {
          if (err) throw err;
        }
      );
    });
  }
  console.log(request.session.user.email + ": transcation success");

  response.redirect("http://localhost:3000/home");
});
app.get("/transcationCancel", (request, response) => {
  console.log(request.session.user.email + ": transcation Cancel");
  response.redirect("http://localhost:3000/checkOut");
});
app.get("/transcationValid", (request, response) => {
  console.log(request.session.user.email + ": transcation valid");
  response.redirect("http://localhost:3000/checkOut");
});

//Lorsque un user ce deconnecte
app.get("/userLogout", (request, response) => {
  console.log("User " + request.session.user.email + " is now disconnected");
  request.session.destroy(function(err) {
    if (err) {
      console.error(err);
    } else {
      response.clearCookie(SESSION_NAME);
    }
  });
});

//Envoie tout les informations du user a propos de ses jeu
app.get("/userGames", (req, res) => {
  var userid = req.session.user.id;
  con.query(
    "SELECT game.id,game.NAME,game.studio,game.description,game.DATE,game.image FROM game " +
      "JOIN userlibrary ON userlibrary.game_id = game.id " +
      "JOIN user ON user.id = userlibrary.user_id " +
      "WHERE user.id = ?",
    [userid],
    function(err, result, fields) {
      if (err) throw err;
      if (result.length > 0) {
        res.send({ gameData: result });
      } else {
        res.send({ gameData: false });
      }
    }
  );
});
//Ajoute un jeu a la base de donnée
app.post("/addGame", function(request, response) {
  console.log(JSON.stringify(request.body));
  var name = request.body.name;
  var studio = request.body.studio;
  var price = request.body.price;
  var description = request.body.description;
  var image = request.body.image;
  if (name && studio && price && description && image) {
    con.query(
      "INSERT INTO game (name, studio, price, description,image) VALUES (?,?,?,?,?);",
      [name, studio, price, description, image],
      function(err, result, fields) {
        if (err) throw err;
      }
    );
  } else {
    console.log("Something is wrong");
    response.redirect("/signup");
  }
});
//Affiche tout les jeu
app.get("/games", (req, res) => {
  con.query(
    "SELECT game.id,game.name,studio,price,description,DATE,image," +
      "GROUP_CONCAT(category.name) AS category FROM game " +
      "JOIN game_to_category ON game_to_category.game_id = game.id " +
      "JOIN category ON category.id = game_to_category.category_id GROUP BY game.id ORDER BY game.name",
    function(err, result, fields) {
      if (err) throw err;
      //console.log(result);
      res.send({ gameData: result });
    }
  );
});

//Genere un string random
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//Decryption des password
function JSdecryptPassword(encryptedString) {
  if (encryptedString != null) {
    var decryptedString = decrypt.decrypt(encryptedString);
    return decryptedString;
  } else {
    console.log(encryptedString + " is a Password null");
  }
}
//hashing
function hashPassword(password) {
  const hashedPassword = SHA256(uncryptedPassword).toString();
  return hashedPassword;
}
