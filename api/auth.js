/*
 *	para essa variável ser criada você precisa ter um arquivo '.env' na pasta principal do projeto,
 *	e esse arquivo .env deve seguir o seguinte estilo:
 *		module.exports = {
 *  		authSecret: '#$fhfjh&.sjhg112312'
 *		}
 *	onde a série de caracteres atribuídas a variável authSecret (que podem ser qualquer série de caractéres, mas
 *	é interessante que se use caracteres especiais, letras e números) são usados para codificar e decodificar
 *	token gerado pelo jwt
*/
const { authSecret } = require('../.env');

const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
	const signin = async (req, res) => {
		if (!req.body.email || !req.body.password) {
			return res.status(400).send('Dados incompletos');
		}

		const user = await app.db('users')
			.where({ email: req.body.email })
			.first();

		if (user) {
			bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
				if (err || !isMatch) {
					return res.status(401).send();
				}

				const payload = { id: user.id };
				res.json({
					name: user.name,
					email: user.email,
					token: jwt.encode(payload, authSecret)
				});
			});
		} else {
			res.status(400).send('Usuário não cadastrado!');
		}
	}

	return { signin };
}
