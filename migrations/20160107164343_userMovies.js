exports.up = function(knex, Promise) {
	return knex.schema.createTable('userMovies', function(table){
 		table.increments();// id serial primary key
 		table.integer('tv_show_id').references('id').inTable('tv_shows');
 		table.integer('user_id').references('id').inTable('users');
 	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('userMovies');  
};