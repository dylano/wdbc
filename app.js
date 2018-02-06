var express = require('express');
var app = express();
var PORT = 3000;
var bodyParser = require('body-parser');

// app config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// app data
var campgrounds = [
    {name: 'Marin Ranch', image: 'https://farm4.staticflickr.com/3113/3159052463_1f46581d53.jpg'}, 
    {name: 'Jones Gulch', image: 'https://farm9.staticflickr.com/8086/8352159814_4cb97a7fda.jpg'}
]


app.get('/', function(req, res) {
    res.render('landing');
});

app.get('/campgrounds', function(req, res) {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', function(req, res){
    res.render("new.ejs");
});

app.post('/campgrounds', function(req, res){
    var newName = req.body.siteName;
    var newImageURL = req.body.siteImage;
    if(newName && newImageURL) {
        campgrounds.push({name: newName, image: newImageURL});
    }
    res.redirect('campgrounds');
});

app.listen(PORT, function() {
    console.log("Now yelping on " + PORT + "...");
});

