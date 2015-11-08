var Helper = require('../Helper.js');

/** nmea encoder object
 * $--GGA,hhmmss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh

 GGA  = Global Positioning System Fix Data

 1    = UTC of Position
 2    = Latitude
 3    = N or S
 4    = Longitude
 5    = E or W
 6    = GPS quality indicator (0=invalid; 1=GPS fix; 2=Diff. GPS fix)
 7    = Number of satellites in use [not those in view]
 8    = Horizontal dilution of position
 9    = Antenna altitude above/below mean sea level (geoid)
 10   = Meters  (Antenna height unit)
 11   = Geoidal separation (Diff. between WGS-84 earth ellipsoid and
 mean sea level.  -=geoid is below WGS-84 ellipsoid)
 12   = Meters  (Units of geoidal separation)
 13   = Age in seconds since last update from diff. reference station
 14   = Diff. reference station ID#
 15   = Checksum

 * input data:
 * {
     date         : DateTime object, UTC (year,month,day ignored)
     latitude     : decimal degrees (north is +)
     longitude    : decimal degreees (east is +)
     fix          : integer 0,1,2
     satellites   : integer 0..32
     hdop         : float
     altitude     : decimal altitude in meters
     aboveGeoid   : decimal altitude in meters
     dgpsUpdate   : time in seconds since last dgps update
     dgpsReference: differential reference station id
     * }
 * any undefined values will be left blank ',,' which is allowed in the nmea specification
 */
exports.Encoder = function (talker) {
    this.id = talker + 'GGA';
    this.encode = function (id, data) {
        var a = [];
        var gga;

        a.push('$' + id);
        a.push(Helper.encodeTime(data.date));
        a.push(Helper.encodeLatitude(data.lat, 3));
        a.push(Helper.encodeLongitude(data.lon, 3));
        a.push(Helper.encodeValue(data.fix));
        a.push(Helper.encodeValue(Helper.padLeft(data.satellites.toString(), 2, '0')));
        a.push(Helper.encodeFixed(data.hdop, 1));
        a.push(Helper.encodeAltitude(data.altitude));
        a.push(Helper.encodeAltitude(data.aboveGeoid));
        a.push(Helper.encodeFixed(data.dgpsUpdate, 0));
        a.push(Helper.encodeValue(data.dgpsReference));

        gga = a.join();

        return gga;
    };
};

exports.Decoder = function (talker) {
    this.talker = talker;
    this.talker_type_id = 'GGA';
    this.talker_type_desc = 'Global Positioning System Fix Data';
    this.parse = function (tokens) {
        var i;
        var gga;
        if (tokens.length < 14) {
            throw new Error('GGA - not enough tokens (13): ' + tokens.length + ', tokens: ' + tokens);
        }

        // trim whitespace
        // some parsers may not want the tokens trimmed so the individual parser has to do it if applicable
        for (i = 0; i < tokens.length; ++i) {
            tokens[i] = tokens[i].trim();
        }

        return {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            time: tokens[1],
            latitude: Helper.parseLatitude(tokens[2], tokens[3]),
            longitude: Helper.parseLongitude(tokens[4], tokens[5]),
            fix: Helper.parseIntX(tokens[6], 10),
            satellites: Helper.parseIntX(tokens[7], 10),
            hdop: Helper.parseFloatX(tokens[8]),
            altitude: Helper.parseAltitude(tokens[9], tokens[10]),
            aboveGeoid: Helper.parseAltitude(tokens[11], tokens[12]),
            dgpsUpdate: tokens[13],
            dgpsReference: tokens[14]
        };
    };
};