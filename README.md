# ReactLoginApp
Build a Simple login system application in React JS with Express JS API and MySQL
-------------------------------------------------

Requirements work with :
- Mac OS System Catalina from V 10.15.7.
- Visual Studio Code from version 1.52.0
- Node JS (installed in Visual Studio) Version: 12.14.1
- MySQL Community Edition (GPL) 
   (how to install on mac : 
     https://www.youtube.com/watch?v=UcpHkYfWarM&t=821s )
- MySQL Workbench from 8.0.22 
- Chrome with devTools

References:
- Thank you "Fullstack Development" a publish tutorials group. (using Window environment)
  https://www.youtube.com/watch?v=4BhhGs0PFHU

--------------------------------------------------------
Let get start!

1. Create a Folder "ReactLoginApp".
2. in the folder , Create an App name "frontend"
    <terminal> $npx create-react-app frontend 

   - Struggling Approach: "npm start" not work well in version
   There might be a problem with the project dependency tree.
   It is likely not a bug in Create React App, but something you need to fix locally.

   The react-scripts package provided by Create React App requires a dependency:
   
   "webpack": "4.44.2".
   ------ FIX----------------------
      cd ~ ( move to the root)
      ls ( to find folder node_modules)
      rm -rf node_modules (delete all this folder)
      go to root folder delete 2 files of .json and yarn.log
      re-create app
      done
   ------ FIXED----------------------

3. Install Mobx + Mobx-react
   - move in to frontend project folder
   - run "yarn add mobx" or "npm install mobx --save"
   when install by using Yarn , it didn't appear file "package-lock.json

4. Open file Package.json
   - after "private": true,
   - add a line ("homepage": "./",)
   
5. Edit all code from App.js
   (attached in file store)


6. create files
    - store / UserStore.js
    - loginForm.js
    - inputField.js
    - SubmitButton.js
    (attached in file store)


7. Build Backend
    - npm run build
    - create folder backend
    - copy folder "build" into backend folder
    - cd to backend
    - npm init (it will make a package.json)
    - at the entry point:  (index.js) enter "Main.js"
 
    open package.json at 
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
      Add this line:   "start": "node Main"
    },

   - npm install bcrypt --save
   - npm install express --save
   - npm install express-mysql-session --save
   - npm install express-session --save 
   - npm install mysql --save


8. Make a GetPassword.js to get hash from bcrypt
"
const bcrypt = require('bcrypt');

let pswd = bcrypt.hashSync('12345', 9);
console.log(pswd);
"
run it from a playground  at the link: 
https://npm.runkit.com/bcrypt



9. Must using MySQL server by MySQLWorkbench
    - create database with a table name "user"
    - add 3 columns : id, username, password.
    - add 2 rows of data:
    +----+--------------+-----------------------------------------------------------------+
    | id |  username    |     Password                                                    |
    +----+--------------+-----------------------------------------------------------------+
    | 1  | john            |  $2b$09$9RzewWswSWURnovdMq5UOuAcf4cjUZNH4vumkKXOwoyqQsWHsTTMu   |
    +----+--------------+-----------------------------------------------------------------+
    | 2  | anotheruser  |  $2b$09$9RzewWswSWURnovdMq5UOuAcf4cjUZNH4vumkKXOwoyqQsWHsTTMu   |
    +----+--------------+-----------------------------------------------------------------+
    

10. Build Main.js and Router.js
-------- Main.js ----------------------
const express       = require('express');
const app           = express();
const path          = require('path');
const mysql         = require('mysql');
const session       = require('express-session');
const MySQLStore    = require('express-mysql-session')(session);
const Router        = require('./Router');

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

console.log('Testing server');
// Database

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: 'thisispasswork',
    database: 'reactLogin' 
});

db.connect(function(err) {
    if (err) {
        console.log('DB error');
        throw err;
        return false;
    }
});

const sessionStore = new MySQLStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
} , db );

app.use(session({
    key: 'keyRandomKey',
    secret: 'secretRandomSecret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false
    }
}));

new Router(app,db);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3000);
-------- End of Main.js ------------------------------------

-------- Router.js ------------------------------------

const bcrypt = require('bcrypt');

class Router {

    constructor(app , db) {
        this.login(app,db);
        this.logout(app,db);
        this.isLoggedIn(app,db);
    }

    login(app, db) {
        app.post('/login', function (req, res) {
                let username = req.body.username;
                let password = req.body.password;

                username = username.toLowerCase();

//console.log(username);
                if (username.length > 12 || password.length > 12) {
                    res.json({
                        success: false,
                        msg: 'An errors occured, please try again'
                    });
                    return;
                }
                let cols = [username];

//console.log("this is cols-username: ");
//console.log(cols);

                db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: 'An error occured, please try again'
                            });
                            console.log("Error data connection");

                            return;
                        }

                        // Found 1 user with this username
                        if (data && data.length === 1) { 
                            bcrypt.compare(password, data[0].password, function (bcryptErr, verified) {
                                    if (verified) {
                                        req.session.userID = data[0].id;

                                        res.json({
                                            success: true,
                                            username: data[0].username
                                        });
                                        return;
                                    }
                                    else {

                                        res.json({
                                            success: false,
                                            msg: 'Invalid password'
                                        }); 
                                    }
                                }); 
                        }
                        else {
                            res.json({
                                success: false,
                                msg: 'User not found, please try again'
                            });
                            console.log("User not found  ");  
                        }
                    });
            });
    }
    logout(app, db) {
        app.post('/logout', (req, res) => {
            if (req.session.userID) {
                req.session.destroy();
                res.json({
                    success: true
                })
                return true;
            }
            else {
                res.json({
                    success:false
                })
                return false;
            }
        });
    }
    isLoggedIn(app, db){
        app.post('/isLoggedIn', (req, res) => {
            if(req.session.userID) {
                
                let cols = [req.session.userID];
                 
                db.query('SELECT * FROM user WHERE id = ? LIMIT 1',cols, (err, data, fields) => {
                    if (data && data.length === 1) {
                        res.json( {
                            success: true,
                            username: data[0].username
                        })
                        return true;
                    }
                    else {
                        res.json({
                            success: false
                        })
                    }
                });
            }
            else {
                res.json({
                    success: false
                })
            }
        });
    }
}
module.exports = Router;


-------- End of Router.js ------------------------------------



DONE





