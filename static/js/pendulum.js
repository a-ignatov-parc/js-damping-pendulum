var Pendulum = function() {
	return {
		animate: this.getFn('animatePendulum')
	}
};

Pendulum.prototype = {
	torque: function (theta, t) {
		var damp = .5, // Скорость затухания маятника
			omega = 0, // Угол в нижней точке маятника
			driveAmp = .5, // Амплитуда маятника
			driveFreq = 2 / 3; // Частота маятника

		return -(1 + 2.0 * driveAmp * Math.cos(driveFreq * t)) * Math.sin(theta) - damp * omega;
	},

	degToRad: function(deg) {
		return deg * Math.PI / 180;
	},

	radToDeg: function(rad) {
		return rad * 180 / Math.PI;
	},

	animatePendulum: function(target, deg, angle) {
		if (target && (deg != null || angle != null)) {
			var self = this,
				angle = deg ? this.degToRad(deg) : angle,
				minAnimAngle = .5,
				timeUnits = 800,
				fxSpeed = 1000;

			if (deg == null) {
				angle += this.torque(angle, timeUnits);
			}
			target instanceof $ || (target = $(target));
			target
				.css('transform-origin', '50% 0')
				.transition({
					rotate: angle + 'rad'
				}, fxSpeed, function() {
					// Выставляем таймер во избежание артефактов во время анимации
					setTimeout(function() {
						if (Math.abs(self.radToDeg(angle)) >= minAnimAngle) {
							self.animatePendulum(target, null, angle);
						} else {
							target.transition({
								rotate: 0
							}, fxSpeed);
						}
					}, 10);
				});
		}
	},

	getFn: function(name) {
		var fn = this[name],
			context = this;

		return function() {
			if (typeof(fn) === 'function') {
				fn.apply(context, arguments);
			}
		}
	}
}