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

   "webpack": "4.44.2"
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
   (attach in repo)


6. create files
    - store / UserStore.js
    - loginForm.js
    - inputField.js
    - SubmitButton.js

   ---------------- store / UserStore.js -------------------------

import { extendObservable } from 'mobx';

/**
 * UserStore
 */

 class UserStore{
     constructor(){
         extendObservable(this, {

            loading: true,
            isLoggedIn: false,
            username: ''

         })
     }
 }

 export default new UserStore();


   -----------------End of store / UserStore.js ---------------
    
   -----------------Start of LoginForm.js ---------------

import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
 

 class LoginForm extends React.Component{

    constructor(props) {
      super(props);
      this.state = {
        username:'',
        password:'',
        buttonDisable: false
      }
    }
    setInputValue(property, val){
      val = val.trim();
      if(val.length > 12) {
        return;
      }
      this.setState({
        [property]: val
      })
    }

    resetForm() {
      this.setState({
        username:'',
        password:'',
        buttonDisabled:false
      })
    }

    async doLogin() {
      if (!this.state.username) {
        return;
      }
      if (!this.state.password) {
        return;
      }

      this.setState({
        buttonDisable: true
      })
      try {
        let res = await fetch('/login', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
          })
        });
        let result = await res.json();
        if(result && result.success === true) {
          UserStore.isLoggedIn = true;
          UserStore.username = result.username;
        }
        else if(result && result.success === false) {
          this.resetForm();
          alert(result.msg);
        }

      }
      catch(e) {
        console.log(e);
        this.resetForm();
      }
    }

   render (){
    return (
      <div className="loginForm">
        Log in
        <InputField 
          type='text'
          placeholder='Username'
          value={this.state.username ? this.state.username: ''}
          onChange={ (val) => this.setInputValue('username', val)}
        />
        
        <InputField 
          type='password'
          placeholder='Password'
          value={this.state.password ? this.state.password: ''}
          onChange={ (val) => this.setInputValue('password', val)}
        />

        <SubmitButton 
          text='Login'
          disable={this.state.buttonDisabled}
          onClick={ () => this.doLogin()}
        />
      </div>
     );
   }
 }

export default LoginForm;


   -----------------End of LoginForm.js ---------------

   -----------------Start of InputField.js ---------------
import React from 'react';
 

 class InputField extends React.Component{
   render (){
    return (
      <div className="inputField">
        <input
          className='input'
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={ (e) => this.props.onChange(e.target.value) }
        />
      </div>
     );
   }
 }

export default InputField;



   -----------------End of InputFIeld.js ---------------
   -----------------Start of App.css ---------------
body,
html,
#root,
.app,
.container {
  width: 100%;
  height: 100%;
}

.container {
  font-size: 28px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #282c34;
}
.loginForm {
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
  padding-left: 20px;
  padding-right: 20px;
}

.inputField {
  padding-top: 16px;
}

.input {
  box-sizing: border-box;
  outline: none;
  border: solid 2px #1189de;
  border-radius: 4px;
  color: #292929;
  width: 100%;
  padding: 12px;
  font-size: 14px;
  background: rbga(255, 255, 255, 1);
}

.submitButton {
  padding-top: 16px;
}

.btn {
  width: 100%;
  min-width: 280px;
  color: #565656;
  padding: 12px;
  font-size: 14px;
  font-weight: bold;
  border: solid 2px #1189de;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

   -----------------End of App.css ---------------




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
    | 1  | john         |  $2b$09$9RzewWswSWURnovdMq5UOuAcf4cjUZNH4vumkKXOwoyqQsWHsTTMu   |
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





