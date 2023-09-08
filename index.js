const express = require("express");
const schema = require("./model/userGraphqlSchema")
const connectDb = require("./utils/connectDb");


//module for  connecting graphql with express
const { graphqlHTTP }  = require("express-graphql")





// setting server port 
const PORT = process.env.PORT || 5000;

const app = express();


app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

const connectDbAndStartServer = async () => {
  try {
    const res = await connectDb()
    if(res){
        app.listen(PORT, () => {
            console.log(`Db connected successfully and server running on port ${PORT}`)
        })
    }
    
  } catch (error) {
    res.status(500).send(`Error connecting ${error.message}`)
  }
}

connectDbAndStartServer()