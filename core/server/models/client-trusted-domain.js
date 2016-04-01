var Bookshelf = require('./base'),

    ClientTrustedDomain,
    ClientTrustedDomains;

ClientTrustedDomain = Bookshelf.Model.extend({
    tableName: 'client_trusted_domains'
});

ClientTrustedDomains = Bookshelf.Collection.extend({
    model: ClientTrustedDomain
});

module.exports = {
    ClientTrustedDomain: Bookshelf.model('ClientTrustedDomain', ClientTrustedDomain),
    ClientTrustedDomains: Bookshelf.collection('ClientTrustedDomains', ClientTrustedDomains)
};
