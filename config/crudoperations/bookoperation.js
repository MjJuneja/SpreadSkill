'use strict';

const User = require("../bookschema");

const dbOperations = {
    getBook:(callback, limit)=>{
        Book.find(callback).limit(limit);

    },
    getBookById:(id,callback)=>{
        Book.findById(id, callback);

    },
    addBook:(book, callback) => {
	Book.create(book, callback);
},
    updateBook:(id, book, options, callback) => {
	var query = {_id: id};
	var update = {
		title: book.title,
		genre: book.genre,
		description: book.description,
		author: book.author,
		publisher: book.publisher,
		pages: book.pages,
		image_url: book.image_url,
		buy_url: book.buy_url
	}
	Book.findOneAndUpdate(query, update, options, callback);
},
    removeBook: (id, callback) => {
	var query = {_id: id};
	Book.remove(query, callback);
}

}

module.exports =dbOperations;
