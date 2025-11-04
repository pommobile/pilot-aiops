Log("-> Query MWs...");

var request = "SELECT * FROM IMPACT.MM_WINDOWS WHERE (WINTYPE = 1)";
var mws = DirectSQL('ImpactDB', request, false);
var descriptions = [];

for (var i = 0; i < mws.length; i++) {
    var window = mws[i];
    var encodedString = window.MWM_DESCRIPTIONS;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';

    for (var j = 0; j < encodedString.length; j += 4) {
        var encoded1 = chars.indexOf(encodedString.charAt(j));
        var encoded2 = chars.indexOf(encodedString.charAt(j + 1));
        var encoded3 = chars.indexOf(encodedString.charAt(j + 2));
        var encoded4 = chars.indexOf(encodedString.charAt(j + 3));

        var decoded1 = (encoded1 << 2) | (encoded2 >> 4);
        var decoded2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        var decoded3 = ((encoded3 & 3) << 6) | encoded4;

        if (encoded2 != 64) output += String.fromCharCode(decoded1);
        if (encoded3 != 64) output += String.fromCharCode(decoded2);
        if (encoded4 != 64) output += String.fromCharCode(decoded3);
    }

    var description = JSON.parse(decodeURIComponent(output)).description;
    var startTime = new Date(window.EOT_STARTTIME * 1000).toISOString();
    var endTime = new Date(window.EOT_ENDTIME * 1000).toISOString();
    window.description = description;
    window.startTime = startTime;
    window.endTime = endTime;
}

Log("-- " + mws);

Log("<- Query MWs.");