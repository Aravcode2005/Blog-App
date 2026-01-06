const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const { readFile } = require('fs');
const { error } = require('console');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function getpostfromfile(){
   try {
      const realdata=fs.readFileSync('./data/posts.json');
      const arra=JSON.parse(realdata);
      return arra.posts||[];
   }
    catch (error) {
      console.log("error"+error.message);
      return [];
   }
}
const arr=getpostfromfile();
function getpostsbyid(id) {
   for (let i = 0; i <arr.length; i++) {
      if (arr[i].id === id) {
         return arr[i];
      }
   }
   return null;
}
app.get('/HomePage', (req, res, next) => {
   res.render("index", {
      pageTitle: "Homepage",
      posts:arr

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
         pageTitle: "Post.description",
         post: Post,
         link: "/Homepage"
      })
});
console.log('http://localhost:3000')
app.listen(3000);
