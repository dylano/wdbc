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
    {name: 'Jones Gulch', image: 'https://farm9.staticflickr.com/8086/8352159814_4cb97a7fda.jpg'},
    {name: 'Marin Ranch', image: 'https://farm4.staticflickr.com/3113/3159052463_1f46581d53.jpg'}, 
    {name: 'Jones Gulch', image: 'https://farm9.staticflickr.com/8086/8352159814_4cb97a7fda.jpg'},
    {name: 'Marin Ranch', image: 'https://farm4.staticflickr.com/3113/3159052463_1f46581d53.jpg'}, 
    {name: 'Jones Gulch', image: 'https://farm9.staticflickr.com/8086/8352159814_4cb97a7fda.jpg'},
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
    var newName = req.body.siteName;//'Philly';
    var newImageURL = req.body.siteImage;//'https://img.thedailybeast.com/image/upload/c_crop,d_placeholder_euli9k,h_675,w_1200,x_0,y_0/dpr_2.0/c_limit,w_740/fl_lossy,q_auto/v1493050865/articles/2012/02/03/why-we-riot-how-fans-turned-an-egypt-soccer-match-into-a-bloodbath/psychology-of-riots-wise_lifx5n';
    campgrounds.push({name: newName, image: newImageURL});
    res.redirect('campgrounds');
});

app.listen(PORT, function() {
    console.log("Now yelping on " + PORT + "...");
});

