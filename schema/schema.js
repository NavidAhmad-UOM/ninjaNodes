const grahpql = require('graphql');
const _= require('lodash');
const {GraphQLObjectType, GraphQLString, GraphQLSchema,
     GraphQLID, GraphQLInt} = grahpql;

// dummy data
var books = [
    {name:'Name of the wind.',genre:'fantasy',id:'1'},
    {name:'The final empire.',genre:'fantasy',id:'2'},
    {name:'The long Earth.',genre:'Sci-fi',id:'3'}
]
var authors = [
    {name:'Name of the wind.',age:40,id:'1'},
    {name:'The final empire.',age:50,id:'2'},
    {name:'The long Earth.',age:59,id:'3'}
]

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLString},
        name: {type:GraphQLString},
        genre: {type:GraphQLString}
    })
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLString},
        name: {type:GraphQLString},
        age: {type:GraphQLInt}
    })
});

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                // code to get Data from db 
               return _.find(books,{id:args.id})
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return _.find(authors,{id:args.id})
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
