/* Bijective functions from https://github.com/delight-im/ShortURL/blob/master/JavaScript/ShortURL.json
 *
 * proof against offensive words (removed 'a', 'e', 'i', 'o' and 'u')
 * unambiguous (removed 'I', 'l', '1', 'O' and '0')
*/

var alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
    base = alphabet.length;
    
/*
    Input: object id as number
    Output: encoded id as string
*/
function encode(num) {
	var str = '';
	while (num > 0) {
		str = alphabet.charAt(num % base) + str;
		num = Math.floor(num / base);
	}
	return str;
};

/*
    Input: encoded id as string
    Output: decoded object id as num
*/
function decode(str) {
	var num = 0;
	for (var i = 0; i < str.length; i++) {
		num = num * base + alphabet.indexOf(str.charAt(i));
	}
	return num;
};

module.exports.encode = encode;
module.exports.decode = decode;