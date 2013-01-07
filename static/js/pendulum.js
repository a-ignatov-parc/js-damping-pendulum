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
				fxLib = TweenLite || TweenMax,
				angle = deg ? this.degToRad(deg) : angle,
				minAnimAngle = .5,
				timeUnits = 800,
				fxSpeed = 1; // В библиотеке `GSAP` время анимаций измеряется в секундах

			if (deg == null) {
				angle += this.torque(angle, timeUnits);
			}
			target instanceof $ || (target = $(target));

			// Новый способ анимации через `GSAP.tween`.  
			// Для текущей реализации достаточно подключить: `CSSPlugin`, `EasePack`, `TweenLite`.  
			// Если же потребуются больший функционал, то стоит подключить `TweenMax`
			fxLib.to(target, fxSpeed, {
				css: {
					transformOrigin: '50% 0',
					rotation: angle + 'rad'
				},
				onComplete: function() {
					if (Math.abs(self.radToDeg(angle)) >= minAnimAngle) {
						self.animatePendulum(target, null, angle);
					} else {
						fxLib.to(target, fxSpeed, {
							css: {
								rotation: 0
							}
						});
					}
				},
				ease: Quad.easeInOut
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