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

const passport = require('passport');
const passportJwt = require('passport-jwt');
const {Strategy, ExtractJwt} = passportJwt;

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({id: payload.id})
            .first()
            .then(user => {
                if(user) {
                    done(null, {id: user.id, email: user.email});
                } else {
                    done(null, false);
                }
            })
            .catch(err => done(err, false));
    });

    passport.use(strategy);

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}