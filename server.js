const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Some initial stuff' });
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
