export function generateData(count, yrange) {
	var i = 0,
		series = [];
	while (i < count) {
		var x = 'w' + (i + 1).toString(),
			y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

		series.push({
			x: x,
			y: y
		});
		i++;
	}
	return series;
}
