var Helper = require('../Helper.js');

/*
 === DBT - Depth below transducer ===

 ------------------------------------------------------------------------------
 *******1   2 3   4 5   6 7
 *******|   | |   | |   | |
 $--DBT,x.x,f,x.x,M,x.x,F*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

 1. Depth, feet
 2. f = feet
 3. Depth, meters
 4. M = meters
 5. Depth, Fathoms
 6. F = Fathoms
 7. Checksum
 */
exports.Decoder = function (talker) {
    this.talker = talker;
    this.talker_type_id = 'DBT';
    this.talker_type_desc = 'Depth Below Transducer';
    this._format = function (char) {
        switch (char) {
            case 'F' :
                return 'fathoms'
            case 'M' :
                return 'meters'
            case 'f' :
                return 'feet'
        }
    };

    this.parse = function (tokens) {
        if (tokens.length < 6) {
            throw new Error('DBT : not enough tokens');
        }

        var model = {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
        };

        model[this._format(tokens[2])] = Helper.parseFloatX(tokens[1]);
        model[this._format(tokens[4])] = Helper.parseFloatX(tokens[3]);
        model[this._format(tokens[6])] = Helper.parseFloatX(tokens[5]);

        return model;
    };
};

exports.Encoder = function (id) {
    this.id = id;
    this.encode = function (id, data) {
        var a = [];
        var gga;

        a.push('$' + id);

        a.push(Helper.encodeFixed(data.feet, 1));
        a.push(Helper.encodeValue('f'));
        a.push(Helper.encodeFixed(data.meters, 1));
        a.push(Helper.encodeValue('M'));
        a.push(Helper.encodeFixed(data.fathoms, 1));
        a.push(Helper.encodeValue('F'));

        gga = a.join();

        return gga;
    };
};
