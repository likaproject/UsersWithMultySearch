const express = require('express');
const router = express.Router();
const data = require('../data/generateList')(1000);
const axios = require('axios');
const pug = require('pug');
const compiledFunction = pug.compileFile('tpl/template.pug');

/* GET home page. */

const filterResults = (query) => {
  let result = data.filter(
    (person) => Object.keys(query)
      .filter(key => query[key])
      .every(key => person[key].toLowerCase().includes(query[key].toLowerCase()))
  );
  
return result;
};
	
router.get('/data', function ({ query }, res, next) {
	
  const { name, city, email, phone } = query 
	
  let result = filterResults({
    name,
    city,
    email,
    phone
  })
  const funds = parseInt(query.funds) || undefined;
  if (funds > 0) {
    result = result.filter((el) => parseInt(el.funds) > funds)
  } else {
    result = (funds != 0 && funds !== undefined) ? result.filter((el) => parseInt(el.funds) < Math.abs(funds)) : result
  }
  let {
    offset,
    limit
  } = query;
  offset = offset || 0;
  limit = limit || 100;
  resultData = result.slice(offset, offset + limit );
//  res.json({
//    data: resultData,
//    count: result.length
//  })
	
		res.send(resultData);
});

router.get('/users', function({ query }, res, next){
	
	axios.get('http://localhost:8080/data')
		.then( response => {
		
			let usersArray = response.data;
		
			let {
				offset,
				limit
			} = query;
			offset = offset || 0;
			limit = limit || 5;
		
			let resultData = usersArray.slice(offset, offset + limit);
		
			let pages = Math.floor( usersArray.length / limit ) + 1;
		
			res.send(compiledFunction({
				users: resultData,
				pages: pages,
				currentPage: (offset + limit) / limit, 
				offset: offset
			}))
		
		})
		.catch( error => {
			console.log('MY ERROR ->  ' + error);
		})
	
});

router.get('/users/:n', function( req, res, next ){
	
	axios.get('http://localhost:8080/data')
		.then( response => {
		
			let usersArray = response.data;
			let limit = 5;
			let offset = (req.params.n * limit) - limit;
			let resultData = usersArray.slice(offset, offset + limit);
			let pages = Math.floor( usersArray.length / limit ) + 1;
		
			res.send(compiledFunction({
				users: resultData,
				pages: pages,
				currentPage: Math.floor((offset + limit) / limit), 
				offset: offset + 1
			}))
		
		})
		.catch( error => {
			console.log('MY ERROR ->  ' + error);
		})
	
});
//------------------------------------------------
router.get('/search', function({ query }, res, next ){
	
	let id = +query.id;
	let name = query.name;
	let city = query.city;
	let email = query.email;
	let funds = query.funds;
	let phone = query.phone;
	
	query = { id, name, city, email, funds, phone };
	
	axios.get('http://localhost:8080/data')
		.then( response => {
		
			let tempResult = response.data; 
		
			let searchResult = (query) => {
				let result = tempResult.filter((person) => {
					return Object.keys(query)
						.some(key => {
							return person[key] === query[key]
						})
					});
				
				return result;
			};
			
			let users = searchResult(query);
		
			res.send(compiledFunction({
				users: users
			}));		
	})
		.catch( error => {
			console.log('SEARCH ERROR ->  ' + error);
		})
	
});
//------------------------------------------------

router.put('/update/:id', function (req, res, next) {
  data[req.params.id - 1] = {
    id: +req.params.id,
    ...req.body
  }
  res.status(200);
  res.send(data[req.params.id - 1]);
})

module.exports = router;






































