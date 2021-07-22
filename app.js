require('dotenv').config();
// const { routes } = require('./routes');
const express = require('express');
const connection = require('./db-config');
const app = express();
const cors = require('cors')
app.use(cors());

const port = process.env.PORT || 1234;

app.use(express.json());

// routes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/queens', (req,res)=> {
  connection.query('SELECT * FROM queen', (err, result)=> {
    if (err) {
      res.status(500).send('error retrieving data from database');
    } else {
      res.status(200).json(result)
    }
  })
})

app.get('/favorites', (req, res)=> {
  connection.query('SELECT * FROM queen WHERE is_favorite = true',(err, result) => {
    if (err) {
      res.status(500).send('error retrieving data from database');
    } else {
      res.status(200).json(result)
    }
  })
})

app.get('/eliminated', (req, res)=> {
  connection.query('SELECT * FROM queen WHERE is_eliminated = true',(err, result) => {
    if (err) {
      res.status(500).send('error retrieving data from database');
    } else {
      res.status(200).json(result)
    }
  })
} )

app.get('/queens/:id', (req,res)=> {
  const queenId = req.params.id;
  connection.query('SELECT * FROM queen WHERE id = ?',[queenId],
     (err, result)=> {
        if (err) {
          res.status(500).send('error retrieving data from database');
        } else {
          if (result.length) res.json(result[0]);
          else res.status(404).send('queen not found')
    }
  })
})

app.get('/queens/:search', (req, res) => {
  const queenName = req.params.search;
  connection.query('SELECT * from queen WHERE dragname LIKE %?%', [queenName],
  (err, result)=> {
    if(err) {
      res.status(500).send('error retrieving data from database');
    } else {
      if (result.length) res.json(result[0]);
      else res.status(404).send('searched queen not found')
    }
  })
})

app.put('/queens/:id', (req, res) => {
  const queenId = req.params.id;
  const queenPropsToUpdate = req.body;
  connection.query(
    'UPDATE queen SET ? WHERE id = ?',
    [queenPropsToUpdate, queenId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('error updating a queen')
      } else {
        res.status(200).send('queen updated successfully')
      }
    }
  )
})