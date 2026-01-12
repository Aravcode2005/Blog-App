const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
let isLoggedin = false;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
function getpostfromfile() {
   try {
      const realdata = fs.readFileSync('./data/posts.json');
      const arra = JSON.parse(realdata);
      return arra.posts || [];
   }
   catch (error) {
      console.log("error" + error.message);
      return [];
   }
}
const arr = getpostfromfile();

const postcount = arr.length;
function getpostsbytitle(title) {
   for (let i = 0; i < arr.length; i++) {
      if (arr[i].title === title) {
         return arr[i];
      }
   }
   return null;
}
app.get('/', (req, res, next) => {
   res.redirect('/HomePage');
});
app.get('/HomePage', (req, res, next) => {
   res.render("index", {
      pageTitle: "HomePage",
      posts: arr
   });
});
app.get('/Posts/:title', (req, res, next) => {
   try {

      const Posttitle = req.params.title;
      const Post = getpostsbytitle(Posttitle);
      if (!Post) {
         return res.status(404).send('Page not found');
      }
      res.render("post",
         {
            pageTitle: Post.description,
            post: Post,
            link: "/HomePage",
         })
   } catch (error) {
    console.log(error.message);
   }

});
app.get('/login', (req, res, next) => {
   res.render("login", {
      pageTitle: "Adminpage"
   });
});
app.get('/admin', (req, res, next) => {
   if (!isLoggedin) {
      res.redirect('/HomePage');
      return;
   }
   res.render("dynamicadmin", {
      pageTitle: "Adminpanel",
      POST: postcount,
   });
});
app.post('/login', (req, res, next) => {
   const { password } = req.body;
   console.log({ password });
   try {
      if (password === 'abcd123') {
         isLoggedin = true;
         res.redirect('/admin');
      }
   } catch (error) {
      console.log(error.message);
   }
});

app.get('/write', (req, res, next) => {
   res.render("newpost",
      {
         pageTitle: "Userpage"
      });
});
app.post('/write', (req, res, next) => {
   const { inputtext, texxtarea, inputtaext } = req.body;
   const obj = {
      "title": inputtaext,
      "description": inputtext,
      "content": texxtarea,
   }
   arr.push(obj);
   let fileData;
   try {
      const fileContent = fs.readFileSync('./data/posts.json');
      fileData = JSON.parse(fileContent);
   } catch (error) {
      fileData = { posts: [] };
   }
   fileData.posts.push(obj);
   fs.writeFileSync('./data/posts.json', JSON.stringify(fileData, null, 2));
   res.redirect('/HomePage');
});
console.log('http://localhost:3000')
app.listen(3000);
