const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const { result } = require('lodash');

// express app

const app = express();

// Connect to mongodb
const dbURI = 'mongodb+srv://netbharwe:test1234@cluster0.ucn61.mongodb.net/Node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(app.listen(3000), "conneted to DB"))
    .catch((err) => console.log(err));
// register view engine

app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


app.use((req, res, next) => {
    console.log('new request has been made');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
});
app.use((req, res, next) => {
    console.log('in the next middleware');
    next();
});

// Mongo & Mongoose Routes

app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'Anything',
        snippet: 'Something',
        body: 'Nothing'
    });
    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        }); 
});


// ROUTES

app.get('/', (req, res) => {
    res.redirect('/blogs');
  });
  
  app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
  });
  
  // blog routes
  app.use('/blogs', blogRoutes);
  
  // 404 page
  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });

