## Setting up backend

Setting up backend that accepts feedback sent from app.
You can use any backend you want for accepting feedback but this
one will be written in node using express.

```bash
# create backend directory
FEEDBACK_BACKEND=send-feedback-backend # or whatever you want to name it
mkdir $FEEDBACK_BACKEND
cd $FEEDBACK_BACKEND
touch index.js
# install express, and body-parser
npm init -y
npm i express body-parser --save
```

Now add the `"start"` field to `package.json`.
```json
"start": "node index.js"
```

## Writing backend

Add this to template to `index.js` and setup saving feedback recived from webapp and
a way to access them on website.
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const titleParam = 'title';
const bodyParam = 'body';
function checkRequest(body) {
    return (body[titleParam] !== undefined && body[titleParam] !== '' &&
            body[bodyParam] !== undefined && body[bodyParam] !== '');
}

app.get('/', (req, res) => {
  // probably want to setup something here
  // that sends html back that nicely renders
  // feedback you gathered
});

app.post('/', (req, res) => {
    if (checkRequest(req.body)) {
        // store the feedback someehwere
        // ...

        // send 200 to indicate sucess
        res.status(200).end();
        return;
    }
    
    console.error('Feedback rejected!');
    // failure no data was sent
    res.status(404).end();
});

const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log(`Backend started and now can accept feedback on port: ${port}`);
});
```

## Push your code to a server

You will need a server up a running to accept the feedback sent from app.
You can use [`heroku`](https://www.heroku.com/) or [`now`](https://zeit.co/now) which
offer free services.
