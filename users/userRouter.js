const express = require('express');
const userDb = require('./userDb')
const postsDb = require('../posts/postDb')

const router = express.Router();

//? create new user
router.post('/', validateUser, (req, res) => {
    userDb.insert(req.body)
    .then( user => res.status(201).json(user))
    .catch( err => res.status(500).json({message: 'We couldnt create a user at this time, try again later.'}))
});

//? create new post for user
router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
    console.log(req.body)
    console.log(req.params.id)
    const userPost = req.body
    userPost.user_id = req.params.id
    postsDb.insertPost(userPost)
        .then( post => res.status(201).json(post))
        .catch( err => res.status(500).json({message: 'We couldnt create a post at this time, try again later.'}))
});

//? get all users
router.get('/', (req, res) => {
    userDb.get()
        .then( posts => res.status(200).json(posts))
        .catch( err => res.status(500).json({message: 'We couldnt fetch the users, try again later.'}))
    
});

//? get user by id
router.get('/:id', validateUserId, (req, res) => {
    userDb.getById(req.params.id)
        .then( user => res.status(200).json(user))
        .catch( err => res.status(500).json({message: 'We couldnt fetch the user, try again later.'}))
});

//? get posts from a single user
router.get('/:id/posts', validateUserId, (req, res) => {
    userDb.getUserPosts(Number(req.params.id))
        .then( userPosts => res.status(200).json(user))
        .catch( err => res.status(500).json({message: 'We couldnt fetch this users posts, try again later.'}))
});

// ? delete a user
router.delete('/:id', validateUserId, (req, res) => {
    userDb.remove(req.params.id)
        .then( user => res.status(204).json(user))
        .catch( err => res.status(500).json({message: 'We couldnt delete this user, try again later.'}))
});

//? update a user
router.put('/:id', validateUserId, (req, res) => {
    const { id  }= req.params
    userDb.update(id, req.body)
        .then( updated => res.status(200).json(updated))
        .catch( err => res.status(500).json({message: 'We couldnt update this user, try again later.'}))
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params
    if(req.method !== 'DELETE'){
    userDb.getById(id)
    .then( user => {
        if(user){
            next()
        }else{
            res.status(400).json({message: "invalid user id"})
        }
    })}else{
        next()
    }
};

function validateUser(req, res, next) {
    const { body } = req
    if(!body){
        res.status(400).json({ message: "missing user data" })
    }else if(!body.name){
        res.status(400).json({ message: "missing required name field" })
    }else{
        next();
    }
};

function validatePost(req, res, next) {
    const { body } = req
    if(!body){
        res.status(400).json({message: "missing post data"})
    }else if(!body.text){
        res.status(400).json({ message: "missing required text field" })
    }else{
        next();
    }
};

module.exports = router;
