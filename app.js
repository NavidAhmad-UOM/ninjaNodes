const express = require("express");
const graphqlHTTP = require("express-graphql");
const app =  express();
const schema = require('./schema/schema');
const mongoose = require('mongoose');

//connect to mLab database
mongoose.connect('mongodb+srv://test:test@cluster0-creib.mongodb.net/test?retryWrites=true&w=majority',
{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.connection.once('open',()=>{
    console.log('connected to mongoose database');
})

app.use("/graphql",graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log(`Server started on port`);
});