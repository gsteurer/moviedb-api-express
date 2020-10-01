const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
var pgp = require('pg-promise')()

const cn = {
    host: '172.16.69.42',
    port: 5432,
    database: 'sandbox',
    user: 'sandbox',
    password: 'sandbox'
};

db = pgp(cn);

app.use(cors())
app.use(express.json());

app.get("/movies", (req,res)=> {
    res.setHeader('Content-Type', 'application/json');

    let limiter = ""
    let limit = req.query.limit;
    if (typeof limit !== 'undefined') {
        limiter = " LIMIT " + limit
    }

    db.any('select * from movies' + limiter).then(data => {
        res.json(data);
    }).catch(error => {
      res.json({
        error: error,
        message: 'Unexpected error'
      })
      console.log(error);
    })

})

app.get("/movies/:id", (req,res)=> {
    res.setHeader('Content-Type', 'application/json');

    db.any('select * from movies where uid=' + req.params.id).then(data => {
        res.json(data);
    }).catch(error => {
      res.json({
        error: error,
        message: 'Unexpected error'
      })
      console.log(error);
    })

})

app.put('/movies/:id', function (req, res) {
    let release_year = req.body.release_year
    let title = req.body.title
    let origin = req.body.origin
    let director = req.body.director
    let movie_cast = req.body.movie_cast
    let genre = req.body.genre
    let wiki_url = req.body.wiki_url
    let plot = req.body.plot

    db.none(
        'UPDATE movies SET release_year=$1, title=$2, origin=$3, director=$4, movie_cast=$5, genre=$6, wiki_url=$7, plot=$8 WHERE uid=$9',
        [release_year, title, origin, director, movie_cast, genre, wiki_url, plot, req.params.id])
    .then((data) => {
        res.send('hanled PUT request')
    })
    .catch(error => {
        res.json({
            error: error,
            message: 'Unexpected error'
        })
        console.log(error);
    });
})

app.post('/movies', function (req, res) {
    let release_year = req.body.release_year
    let title = req.body.title
    let origin = req.body.origin
    let director = req.body.director
    let movie_cast = req.body.movie_cast
    let genre = req.body.genre
    let wiki_url = req.body.wiki_url
    let plot = req.body.plot

    db.none(
        'INSERT INTO movies(release_year, title, origin, director, movie_cast, genre, wiki_url, plot) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        [release_year, title, origin, director, movie_cast, genre, wiki_url, plot])
    .then((data) => {
        res.send('hanled POST request')
    })
    .catch(error => {
        res.json({
            error: error,
            message: 'Unexpected error'
        })
        console.log(error);
    });
})

app.post('/movies/:id', function (req, res) {
    let release_year = req.body.release_year
    let title = req.body.title
    let origin = req.body.origin
    let director = req.body.director
    let movie_cast = req.body.movie_cast
    let genre = req.body.genre
    let wiki_url = req.body.wiki_url
    let plot = req.body.plot

    db.none(
        'INSERT INTO movies(uid, release_year, title, origin, director, movie_cast, genre, wiki_url, plot) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [req.params.id, release_year, title, origin, director, movie_cast, genre, wiki_url, plot])
    .then((data) => {
        res.send('hanled POST request')
    })
    .catch(error => {
        res.json({
            error: error,
            message: 'Unexpected error'
        })
        console.log(error);
    });
})

app.delete('/movies/:id', function (req, res) {
    db.one('DELETE FROM movies WHERE uid = $1 RETURNING *', req.params.id).then(result => {
        console.log(result)
        res.send('Got a DELETE request at /user')
    }).catch(error => {
      res.json({
        error: error,
        message: 'Unexpected error'
      })
      console.log(error);
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})