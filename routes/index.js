var db    = require('orchestrate')(process.env.orchestrate_token);

exports.index = function(req, res){
	res.render('index', { title: '咲-Saki-キャラクターデータベース検索API' });
};

exports.character = function(req, res){
	var birthdayFrom = req.query.bdf || '01-01';
	var birthdayTo   = req.query.bdt || '12-31';
	var job          = req.query.j   || null;
	var heightFrom   = req.query.hf  || 0;
	var heightTo     = req.query.ht  || 200;
	var position     = req.query.po  || null;
	var grade        = req.query.g   || null;
	var pref         = req.query.pr  || null;
	var query = 'birthday:[2013-' + birthdayFrom + ' TO 2013-' + birthdayTo + ']';
	query += ' AND height:[' + heightFrom + ' TO ' + heightTo + ']';

	if (pref !== null) {
		query += ' AND pref:' + pref;
	}
	if (job !== null) {
		query += ' AND job:' + job;
	}
	if (position !== null) {
		query += ' AND position:' + position;
	}
	if (grade !== null) {
		query += ' AND grade:' + grade;
	}
	db.newSearchBuilder().collection('characters').limit(100).query(query).then(function (result) {
		var data = [];
		result.body.results.forEach(function (character) {
			data.push(character.value);
		});
		if(data.length === 100){
			db.newSearchBuilder().collection('characters').limit(100).offset(100).query(query).then(function (result) {
				result.body.results.forEach(function (character) {
					data.push(character.value);
				});
				res.json(data);
			});
		} else {
			res.json(data);
		}
	}).fail(function (error) {
		console.log(error);
		res.end();
	});
};
