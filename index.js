const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvbhx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client
    .db("drone-marketplace")
    .collection("services");
  const orderCollection = client.db("drone-marketplace").collection("orders");
  const testimonialCollection = client
    .db("drone-marketplace")
    .collection("testimonials");
  const adminCollection = client.db("drone-marketplace").collection("admins");

  /// add new service
  app.post("/addService", (req, res) => {
    serviceCollection.insertOne(req.body).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  //  make route and get data
  app.get("/allService", (req, res) => {
    serviceCollection.find({}).toArray((err, results) => {
      res.send(results);
    });
  });

  //  make route and get data
  app.get("/service/:id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  // add addOrder option
  app.post("/addOrder", (req, res) => {
    orderCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // get all orders data
  app.get("/allOrder", (req, res) => {
    orderCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // get query data by email and id
  app.get("/orders", (req, res) => {
    const queryEmail = req.query.email;
    orderCollection.find({ email: queryEmail }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // delete orders data
  app.delete("/deleteOrder/:id", (req, res) => {
    orderCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        console.log("hello", result);
        res.send(result);
      });
  });

  // update status
  app.patch("/update/:id", (req, res) => {
    console.log(req.body);
    orderCollection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  // add review
  app.post("/addReview", (req, res) => {
    testimonialCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // get all reviews
  app.get("/allReview", (req, res) => {
    testimonialCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // make admin
  app.post("/addAdmin", (req, res) => {
    adminCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  // get admins
  app.get("/admin", (req, res) => {
    const queryEmail = req.query.email;
    adminCollection.find({ email: queryEmail }).toArray((err, documents) => {
      res.send(documents.length > 0);
    });
  });

  // delete collection data
  app.delete("/delete/:id", (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        console.log(result);
        res.send(result);
      });
  });
});

app.get("/", (req, res) => {
  res.send("Drone MarketPlace server is working");
});

app.listen(port);
