const express = require('express');
const postDb = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
    postDb.get()
        .then( posts => res.status(200).json(posts))
        .catch( err => res.status(500).json({message: 'There was an error retrieving the posts.'}))
});

router.get('/:id', validatePostId, (req, res) => {
    // console.log(typeof(Number(req.params.id)))
    postDb.getPostById(Number(req.params.id))
        .then( post => post.status(200).json({message:'hello'}))
        .catch( err => res.status(500).json({message: 'There was an error retrieving the post.'}))
});

router.delete('/:id', validatePostId, (req, res) => {
    postDb.remove(req.params.id)
        .then( deleted => res.status(204).json(deleted))
        .catch( err => res.status(500).json({message: 'There was an error trying to delete your message.'}))
});

router.put('/:id', validatePostId, (req, res) => {
    const updated = req.body
    if(updated.text){
        postDb.update(req.params.id, updated)
            .then( updatedPost => res.status(200).json(updatedPost))
            .catch( err => res.status(500).json({message: 'There was an error tying to delete this message.'}))
    }else{
        res.status(400).json({message: 'Please provide a text input.'})
    }
});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params
    if(req.method === 'GET' && id){
        next();
    }else{
        postDb.getPostById(id)
        .then( post => {
            if(post){
                next()
            }else{
                res.status(400).json({message: 'Please provide a valid user ID.'})
            }
        })
    }
};

module.exports = router;