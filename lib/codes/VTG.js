var Helper = require('../Helper.js');

exports.Decoder = function(talker) {
    this.talker = talker;
    this.talker_type_id = 'VTG';
    this.talker_type_desc = 'Velocity Track Made Good';
    this.parse = function(tokens) {


        var vtg;
        var i;
        if(tokens.length < 9) {
            throw new Error('VTG : not enough tokens');
        }

        // trim whitespace
        // some parsers may not want the tokens trimmed so the individual parser has to do it if applicable
        for(i=0;i<tokens.length;++i) {
            tokens[i] = tokens[i].trim();
        }

        return  {
            id : tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            course: Helper.parseFloatX(tokens[1]),
            knots: Helper.parseFloatX(tokens[5]),
            kph: Helper.parseFloatX(tokens[7]),
            mode: tokens[9]
        };
    };
};