var Helper = require('../Helper.js');

/** 

 === GLL - Geographic Position: Latitude, Longitude and time. ===

  ------------------------------------------------------------------------------
 *******1   2 3   4 5 6 7
 *******|   | |   | | | |
 $--GLL,x.x,N,x.x,W,A,A*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

 1    = Latitude of fix
 2    = N or S
 3    = Longitude of fix
 4    = E or W
 5    = Status (A=data valid or V=data not valid)
 6    = Mode (A=Autonomous, D=DGPS, E=DR, Only present in NMEA version 3.00)
 7    = Checksum

 */

exports.Decoder = function(talker) {
    this.talker = talker;
    this.talker_type_id = 'GLL';
    this.talker_type_desc = 'Geographic Latitude Longitude';

    this._status = function(char){
        switch(char){
            case 'A' : return 'data valid '
            case 'V' : return 'data not valid'
        }
    };

    this._mode = function(char){
        switch(char){
            case 'A' : return 'Autonomous'
            case 'D' : return 'DGPS'
            case 'E' : return 'DR';
        }
    };

    this.parse = function(tokens) {
        if(tokens.length < 8) {
            throw new Error('GLL : not enough tokens');
        }
        return {
            id : tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            latitude : Helper.parseLatitude(tokens[1], tokens[2]),
            longitude : Helper.parseLongitude(tokens[3], tokens[4]),
            utc_time : tokens[5],
            status : this._status(tokens[6]),
            mode : this._mode(tokens[7])
        };
    };
};