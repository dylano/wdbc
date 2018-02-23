var mongoose = require('mongoose');
var Camp = require('./models/camp');
var Comment = require('./models/comment');

var seedCamps = [
    { name: 'Elliot Gorge', image: "https://farm5.staticflickr.com/4389/36606047206_9b763ea61b.jpg", description: 'Pack a towel' },
    { name: 'Jackson Ridge', image: "https://farm8.staticflickr.com/7383/9438432971_8edc43e468.jpg", description: 'perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit' },
    { name: 'Brenda Valley', image: "https://farm4.staticflickr.com/3869/15021554257_5b52466cdf.jpg", description: 'Enjoy the hike out!' },
    { name: "D's Drop", image: "https://farm3.staticflickr.com/2854/13609426144_298319ddf3.jpg", description: 'Watch your step!' },
    { name: 'Izzy Glacier', image: "https://hdwallsource.com/img/2014/7/beautiful-glacier-wallpaper-17193-17750-hd-wallpapers.jpg", description: 'Bring a jacket!' }
];

function seedDB() {
    // Clear data
    console.log('Removing camps');
    Camp.remove({})
        .then(function () {
            console.log('Removing comments');
            Comment.remove({});
        })
        // -- camp creation removed for now, need to set current user context first
        // .then(function() {
        //     seedCamps.forEach(function (seed) {
        //         Camp.create(seed)
        //             .then(function (camp) {
        //                 console.log("Added " + camp.name);
        //                 Comment.create({ 
        //                     text: '5 stars, would camp again',
        //                     author: 'The EJBDs'
        //             })
        //             .then(function(comment){
        //                 console.log('Created comment for ' + camp.name);
        //                 camp.comments.push(comment._id);
        //                 camp.save();
        //             })
        //         }) 
        //     });
        // })

        .catch(function (err) {
            console.log(err);
        });
}

module.exports = seedDB;