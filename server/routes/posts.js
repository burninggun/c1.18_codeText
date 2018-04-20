const router = require('express').Router();
const PostModel = require('../models/post');

// Was /pastVote
router.post('/posts/vote', (req,res) => {
    // console.log(req.body)

    PostModel.findById(req.body.threadID, (err,data) => {
        console.log(req.body.user)

        console.log(req.body.user.login)
        let match=false
        let matchId;
        for (let i =0; i<data.ratedUsers.length; i++){
            console.log(data.ratedUsers[i].login + 'COMPARED AGAINST' + req.body.user.login)
            if (data.ratedUsers[i].login === req.body.user.login){
                match=true
                matchId = data.ratedUsers[i]._id
            }
            // console.log(match)
        }

        if(! match){
            data.ratedUsers.push({
                name:req.body.user.name,
                login: req.body.user.login,
                vote: req.body.vote
            })

        } else {
           if(data.ratedUsers.id(matchId).vote==='up'){
               if(req.body.vote ==='up'){
                   data.ratedUsers.id(matchId).remove()
               } else {
                    data.ratedUsers.id(matchId).remove()
                    data.ratedUsers.push({
                        name:req.body.user.name,
                        login: req.body.user.login,
                        vote: 'down'
                    })
               }
           } else{
               if(req.body.vote!== 'up'){
                   data.ratedUsers.id(matchId).remove()
               } else{
                   data.ratedUsers.id(matchId).remove()
                   data.ratedUsers.push({
                    name:req.body.user.name,
                    login: req.body.user.login,
                    vote: 'up'
                })
               }
           }
        }
        console.log(data)
        let upCount=null;
        let downCount=null;
        for( let i =0; i<data.ratedUsers.length; i++){
            if(data.ratedUsers[i].vote==='up') upCount++
            else downCount++
        }
        data.rating = upCount - downCount

        data.save(err=>{
            // if(err)console.log('ERROR OCCURED: '+ err);
        })
        res.send(data)

    })



})

// Was /uniqueThread
router.post('/posts/unique-thread', (req, res ) => {
    PostModel.findById( req.body.threadID , (err, data) => {
        if(err) throw err;

        res.send(data);
        // console.log(data);
    
    })
})

// was /newPosts  
router.post('/posts/new', (req, res, next) => {

    const {name, newTitleState, newDescriptionState, JsbinState } = req.body;
    console.log(req.body.name)
    if( newTitleState.length===0 || newDescriptionState.length===0 ){
        console.log('Invalid post data!: ', req.body)
        res.send('ERROR. INVALID POST DATA')
    } else {
        const postdata = new PostModel({
            author: name,
            title: newTitleState,
            description: newDescriptionState,
            jsbin: JsbinState,
            comments: [],
            ratedUsers:[],
            rating: 0
        })
        res.send(postdata);
        console.log('this is the postdata: ', postdata);
        postdata.save((err, post) => {
            if(err){
                return next(err)
            }
            
        })
    }


})



router.get('/posts', function(req, res, next){
    console.log('got request: field  = '+req.query.field);
    const sortMapping = {
        newest: { timestamp: -1},
        oldest: { timestamp: 1},    
        popular: { rating: -1}, 
        comments: { __v: -1 },
    }
    var sortObj;
    if(req.query.field && sortMapping[req.query.field]){
        sortObj = sortMapping[req.query.field];
    } else {
        sortObj = {};
    }
    PostModel.find().sort(sortObj).then(data=> {
        res.send({
            confirmation: true,
            results: data
        })
    }).catch(error=> {
        console.log(error);
        res.send({
            confirmation: false,
            error: error
        })
    })
})
//sorting leaderboard
router.post('/leaderboardSort', (req, res, next) => {
    console.log('leaderboard sorting being checked');
    const leaderboardSorting = {
         votes: {rating: -1},
         comments: {__v: -1}
     }
     var leaderboardObj = {};
     console.log(req.body)
     if(req.body.query && leaderboardSorting[req.body.query]){

         leaderboardObj = leaderboardSorting[req.body.query];

     } else {
         leaderboardObj = {};
     }
     console.log('PASSED LEADERBOARD SORTING')

     PostModel.find().sort(leaderboardSorting[req.body.query]).then(data => {
         res.send(data);
    })
})


router.post('/posts/delete', (req, res) => {
    PostModel.findById(req.body.threadID, (err,data) => {
        if(!data){
            console.log(`Cannot find thread ID of: ${req.body.threadID}`)
            res.send(null)
        }else {
            data.remove( err => {
                if (err) throw err;
    
                console.log(`Deleting post with ID of: ${req.body.threadID}`)
            } )
        }

    } )
    
})


module.exports=router
