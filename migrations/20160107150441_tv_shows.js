exports.up = function(knex, Promise) {
	return knex.schema.createTable('tv_shows', function(table){
 		table.increments();// id serial primary key
 		table.string('title');
 		table.string('released');
 		table.string('rating');
 		table.string('plot');
 		table.string('poster');
 		table.string('tmdbID');
 	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('tv_shows');  
};
