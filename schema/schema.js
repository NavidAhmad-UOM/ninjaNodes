const grahpql = require('graphql');
const _= require('lodash');
const {GraphQLObjectType, GraphQLString, GraphQLSchema,
     GraphQLID, GraphQLInt, GraphQLList} = grahpql;

// dummy data
var books = [
    {name:'Name of the wind.',genre:'fantasy',id:'1',authorId:'1'},
    {name:'The final empire.',genre:'fantasy',id:'2',authorId:'2'},
    {name:'The long Earth.',genre:'Sci-fi',id:'3',authorId:'3'},
    {name:'The Hero o ages.',genre:'fantasy',id:'4',authorId:'1'},
    {name:'The long shadow.',genre:'Sci-fi',id:'5',authorId:'3'}
]
var authors = [
    {name:'Awais.',age:40,id:'1'},
    {name:'Adnan.',age:50,id:'2'},
    {name:'Raees.',age:59,id:'3'}
]

const BookType = new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLString},
        name: {type:GraphQLString},
        genre: {type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                console.log(parent);
                return _.find(authors,{id:parent.authorId})
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLString},
        name: {type:GraphQLString},
        age: {type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(books,{authorId:parent.id})
            }
        }
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
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return books
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return authors
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
