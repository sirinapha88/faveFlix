exports.up = function(knex, Promise) {
	return knex.schema.createTable('usershows', function(table){
 		table.increments();// id serial primary key
 		table.integer('user_id').references('id').inTable('users');
 		table.integer('tmdbID');
 		table.boolean('isFavorite');
 		table.boolean('hasWatched');
 	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('usershows');  
};