exports.up = function(knex, Promise) {
	return knex.schema.createTable('movieGenres', function(table){
 		table.increments();// id serial primary key
 		table.integer('tv_show_id').references('id').inTable('tv_shows');
 		table.integer('genre_id').references('id').inTable('genres');
 	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('movieGenres');  
};