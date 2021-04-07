const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));


function asyncHander(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      res.render('error', {error:err});
    }
  }
}

// //CALL BACKS
// function getUsers(cb) {
//   fs.readFile('data.json', 'utf8', (err, data) => {
//     if (err) return cb(err);
//     const users = JSON.parse(data);
//     return cb(null, users);
//   });
// }

// app.get('/', (req, res) => {
//   getUsers((err, users) => {
//     if (err) {
//       res.render('error', { error: err });
//     } else {
//       res.render('index', { title: "Users", users: users.users })
//     }
//   });
// });

//PROMISES 
function getUsers() {
  return new Promise((resolve, reject)=> {
    fs.readFile('data.json', 'utf-8', (err, data)=> {
      if (err) {
        reject(err)
      } else {
        const users = JSON.parse(data);
        resolve(users);
      }
    })
  });
}

// PROMISES get
// app.get('/', (req, res) => {
//   getUsers()
//     .then((users)=> {
//       res.render('index', {title: "Useres", users: users.users})
//     })
//     .catch((err)=> {
//       res.render('error', {error: err});
//     })
// });

// Asynch Away
app.get('/', asyncHander(async (req, res) => {
  const users = await getUsers();
  res.render('index', {title: "Useres", users: users.users})
}));




app.listen(3000, () => console.log('App listening on port 3000!'));