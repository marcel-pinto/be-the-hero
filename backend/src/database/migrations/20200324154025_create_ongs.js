
exports.up = function(knex) {
  return knex.schema.createTable('ongs', table => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.string('whatsapp').notNullable();
      table.string('city').notNullable();
      // Como sei que a UF e apenas 2 caracteres, posso especificar isso ja
      table.string('uf', 2).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.droptable('ongs');
};
