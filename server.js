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
"description":"post1",
"content":"Hi this is the first post,it is about a travel blog ",
},

{
"description":"post2",
"content":"Hi this is the second post this is about food and cuisines all over the world",
},
];

app.get('/HomePage',(req,res,next)=>{
res.render("index",{pageTitle:"Homepage",posts:fakeposts});
});
app.use('/',(req,res,next)=>{
res.status(404).send('Page not found');
});

console.log('http://localhost:3000')
app.listen(3000);
