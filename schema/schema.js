const grahpql = require('graphql');
const _= require('lodash');
const {GraphQLObjectType, GraphQLString, GraphQLSchema,
     GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull} = grahpql;

const Book = require('../models/book');
const Author = require('../models/author');

// dummy data
// var books = [
//     {name:'Name of the wind.',genre:'fantasy',id:'1',authorId:'1'},
//     {name:'The final empire.',genre:'fantasy',id:'2',authorId:'2'},
//     {name:'The long Earth.',genre:'Sci-fi',id:'3',authorId:'3'},
//     {name:'The Hero o ages.',genre:'fantasy',id:'4',authorId:'1'},
//     {name:'The long shadow.',genre:'Sci-fi',id:'5',authorId:'3'}
// ]
// var authors = [
//     {name:'Awais.',age:40,id:'1'},
//     {name:'Adnan.',age:50,id:'2'},
//     {name:'Raees.',age:59,id:'3'}
// ]

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
               // return _.find(authors,{id:parent.authorId})
               return Author.findById(parent.authorId)
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
               // return _.filter(books,{authorId:parent.id})
               return Book.find({authorId:parent.id});
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
               //return _.find(books,{id:args.id})
               return Book.findById(args.id);
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //return _.find(authors,{id:args.id})
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                //if we want to return all books then pass empty
                return Book.find({});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                //return authors
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,args){
                let author=new Author({
                    name:args.name,
                    age:args.age
                });
                //to return new object after save
                return author.save();
            }
        },
        addBook: {
            type:BookType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)},
                authorId:{type:GraphQLID}
            },
            resolve(parent,args){
                let book = new Book({
                    name:args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});
