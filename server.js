const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
let isLoggedin=false;
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
const postcount=arr.length;
function getpostsbyid(id) {
   for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
         return arr[i];
      }
   }
   return null;
}
app.get('/HomePage', (req, res, next) => {
   res.render("index", {
      pageTitle: "HomePage",
      posts: arr

   });
});
app.get('/Posts/:id', (req, res, next) => {
   const Postid = req.params.id;
   const Post = getpostsbyid(parseInt(Postid));
   if (!Post) {
      return res.status(404).send('Page not found');
   }
   res.render("post",
      {
         pageTitle: Post.description,
         post: Post,
         link: "/HomePage",
         image: Post.image
      })
});
app.get('/login', (req, res, next) => {
   res.render("login", {
      pageTitle: "Adminpage"
   });
});
app.get('/admin', (req, res, next) => {
   if(!isLoggedin){
     res.redirect('/HomePage');
        return;
   }
   res.render("dynamicadmin", {
      pageTitle: "Adminpanel",
      POST:postcount,
   });
});
app.post('/login', (req, res, next) => {
   const { password } = req.body;
   console.log({ password });
   try {
       if (password === 'abcd123') {
         isLoggedin=true;
        res.redirect('/admin');
   }
   } catch (error) {
      console.log("Laadle" + error.message);
   }
});
app.get('/',(req,res,next)=>{
res.status(404).send("Page not found");
});
console.log('http://localhost:3000')
app.listen(3000);
