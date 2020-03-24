const connection = require('../database/connections');

module.exports = {
    async index(request, response) {
        const { page = 1} = request.query;
        const numIncidentsPerPage = 5
// Esta eh uma forma de contar todos os registros do banco de dados.
        const [count] = await connection('incidents').count();
        console.log(count);
        /* 
O limit vai limitar o quanto de resultados o backend vai enviar 
para o frontend. O offset cria uma paginacao usando os parametros
de query.
*/
        const incidents = await connection('incidents')
// Junto aqui as tabelas das ongs com a tabela dos incidentes para
// retornar para o frontend
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(numIncidentsPerPage)
            .offset((page - 1) * numIncidentsPerPage)
// Como algumas informacoes vao ficar rendundantes se eu retornar
// todas as entradas, escolho quais quero retornar            
            .select([
                'incidents.*', 
                'ongs.name', 
                'ongs.email', 
                'ongs.whatsapp', 
                'ongs.city', 
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']);
        return response.json(incidents);
    },

    async create(request, response) {
        const {title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert(
            {
               title,
               description,
               value,
               ong_id
            });
        
        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incidents = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        if(incidents.ong_id !== ong_id) {
            // http status 401 siginifica nao autorizado
            return response.status(401).json({ error: "Operation not permitted."});
        }

        await connection('incidents').where('id', id).delete();

        // O status http 204 siginifica que a resposta sera vazia.
        return response.status(204).send()
    }
}