const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression')
const mongoose = require('mongoose');

const userRouter = require('./routes/userRoute');
const crimeRoute = require('./routes/crimeRoutes');


const app = express();

// CONNECT DATABASE

// const { MongoClient, ServerApiVersion } = require('mongodb');
const url = "mongodb+srv://tracker-tool:40HaRXXiE0SDX11K@vuso1.dnlelhm.mongodb.net/?retryWrites=true&w=majority&appName=Vuso1";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('DB connection successful'));

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
  secret: "thisiscrimetrackersecret",
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 60 * 60 * 24},
  resave: false
}));

app.use(compression());
app.use(express.static("public"));
// app.use(express.static("views"));
app.use('/',express.json());
app.use(express.urlencoded({extended:false}));
app.use(userRouter);
app.use(crimeRoute);

//Log in page
app.get('/index',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});

//Sign up page
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
});

app.get('/about',(req,res)=>{
  res.render('about');
 });

app.get('/home',(req,res)=>{
  res.render('home');
});

app.get('/views/reprtCrime', function(req, res) {
  res.render('/reportCrime');
});

const port = 5000;
// process.env.PORT ||
const server = app.listen(port);
console.log('Listening on port '+port);

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });