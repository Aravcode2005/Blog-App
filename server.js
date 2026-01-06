const path=require('path');
const bodyParser=require('body-parser');
const express=require('express');
const app=express();
app.set('view engine','ejs');
app.set('views','views');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
const fakeposts=[
{
"id":1,
"description":"post1",
"content":"Hi this is the first post,it is about a travel blog ",
},

{
"id":2,
"description":"post2",
"content":"Hi this is the second post this is about food and cuisines all over the world",
},
];

function getpostsbyid(id){
   for(let i=0;i<fakeposts.length;i++){
         if(fakeposts[i].id===id){
            return fakeposts[i];
         }

   } 

   return null;
}


app.get('/HomePage',(req,res,next)=>{
res.render("index",{
   pageTitle:"Homepage",
   posts:fakeposts


});
});

app.get('/Posts/:id',(req,res,next)=>{
const Postid=req.params.id;
const Post=getpostsbyid(parseInt(Postid));
if(!Post){
   return  res.status(404).send('Page not found');
}
res.render("post",
   {pageTitle:"Post.description",
      post:Post,
      link:"/Homepage"
   })
});
console.log('http://localhost:3000')
app.listen(3000);
