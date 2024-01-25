const { combineStats, makeAuto } = require('../facilitators.js');
const { gunCalcNames, smshskl, base } = require('../constants.js');
const g = require('../gunvals.js');
const ensureIsClass = (Class, str) => {
    if ("object" == typeof str) {
        return str;
    }
    if (str in Class) {
        return Class[str];
    }
    throw Error(`Definition ${str} is attempted to be gotten but does not exist!`);
};
const eggnoughtBody = {
    SPEED: base.SPEED * 0.8,
    HEALTH: base.HEALTH * 1.75,
	SHIELD: base.SHIELD * 1.5,
	REGEN: base.REGEN * 1.5,
    FOV: base.FOV,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 1.5,
};
const squarenoughtBody = {
    SPEED: base.SPEED * 0.675,
    HEALTH: base.HEALTH * 2.5,
	SHIELD: base.SHIELD * 2,
	REGEN: base.REGEN * 2,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 2,
};
const trinoughtBody = {
    SPEED: base.SPEED * 0.55,
    HEALTH: base.HEALTH * 3.5,
	SHIELD: base.SHIELD * 2.5,
	REGEN: base.REGEN * 2.5,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 2.5,
};
const pentanoughtBody = {
    SPEED: base.SPEED * 0.425,
    HEALTH: base.HEALTH * 4.25,
	SHIELD: base.SHIELD * 3,
	REGEN: base.REGEN * 3,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 3,
};
const hexnoughtBody = {
    SPEED: base.SPEED * 0.3,
    HEALTH: base.HEALTH * 5,
	SHIELD: base.SHIELD * 3.5,
	REGEN: base.REGEN * 3.5,
    FOV: base.FOV * 0.95,
	RESIST: base.RESIST,
	DENSITY: base.DENSITY * 3.5,
};

// Comment out the line below to enable this addon, uncomment it to disable this addon.
// return console.log('--- Snowdreads addon [snowdreads.js] is disabled. ---');

// Set the below variable to true to enable hex dreadnought building.
const buildHexnoughts = true;

// Set the below variable to true to enable photosphere with 10 auras instead of 6.
const useOldPhotosphere = false;

// For hexnought merging
const hexnoughtScaleFactor = 0.9;

// Missing stats
g.flame = {reload: 0.5, recoil: 0.1, shudder: 1.5, range: 0.5, spray: 7, damage: 2, health: 1/3, speed: 0.6, maxSpeed: 0.3};
g.honcho = {size: 2, damage: 2.5, health: 1.2, reload: 2, speed: 0.7};

// Body helpers
const hpBuffBodyStats = [
	{ HEALTH: 2.1, SHIELD: 2.1, REGEN: 2,   SPEED: 0.8  },
	{ HEALTH: 2.9, SHIELD: 2.9, REGEN: 2.2, SPEED: 0.65 },
	{ HEALTH: 3.5, SHIELD: 3.4, REGEN: 2.5, SPEED: 0.55 },
];
const speedBuffBodyStats = [
	{ SPEED: 1.95, HEALTH: 0.65 },
	{ SPEED: 2.3,  HEALTH: 0.5  },
	{ SPEED: 2.55, HEALTH: 0.35 },
];
const sizeBuffBodyStats = [
	{ SPEED: 0.9,  HEALTH: 2   },
	{ SPEED: 0.85, HEALTH: 2.4 },
	{ SPEED: 0.8,  HEALTH: 2.8 },
];

// Snowdread Building Functions --------------
// Guns
function addSniper({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
	let output = [
		{ // Main barrel
			POSITION: [length, width, 1, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 }
			},
		}, {
			POSITION: [length - 3.2, width * 0.8, -0.65, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10 },
				BORDERLESS: true,
			},
		}, {
			POSITION: [length - 1.5, width * 0.6, -0.65, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 25, SATURATION_SHIFT: 0.5 },
				BORDERLESS: true,
			},
		},
	];
	for (let i = 0; i < 2; i++) {
		output.push(
			{
				POSITION: [0.6, width * 0.7, -0.9, x + length - 2 - i * 2.5, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 32.5, SATURATION_SHIFT: 0.5 },
				},
			},
		)
	}
	return output;
}
function addAssassin({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
	return [
		{
			POSITION: [(length - x) * 0.6, width, -1.6, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift },
			},
		},
		...addSniper({length, width, aspect, x: 0, y, angle, delay}, brightShift, stats),
		{
			POSITION: [5, width, -1.6, x, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 } },
		}, {
			POSITION: [5, width - 1.5, -1.6, x - 1.5, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 } },
		},
	];
}
function addRifle({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper], isMusket = false) {
	if (isMusket) {
		return [
			{
				POSITION: [length - 1, 1, aspect, x, y + width + 1, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 22.5, SATURATION_SHIFT: 0.5 },}
			}, {
				POSITION: [length - 1, 1, aspect, x, y - width - 1, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 22.5, SATURATION_SHIFT: 0.5 },}
			}, {
				POSITION: [4.5, width + 4, 0, x + length - 8, y + (width + 1) / 2, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				}
			}, {
				POSITION: [4.5, width + 4, 0, x + length - 12, y + (width + 1) / 2, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				}
			}, {
				POSITION: [4.5, width + 4, 0, x + length - 8, y - (width + 1) / 2, angle, delay + 0.5],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				}
			}, {
				POSITION: [4.5, width + 4, 0, x + length - 12, y - (width + 1) / 2, angle, delay + 0.5],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				}
			}, {
				POSITION: [length, width, aspect, x, y + (width + 1) / 2, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.65 },
					TYPE: "bullet",
				},
			}, {
				POSITION: [length, width, aspect, x, y - (width + 1) / 2, angle, delay + 0.5],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.65 },
					TYPE: "bullet",
				},
			}, {
				POSITION: [length - 1.5, width, aspect - 0.3, x, y + (width + 1) / 2, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65 },
					BORDERLESS: true
				}
			}, {
				POSITION: [length - 1.5, width, aspect - 0.3, x, y - (width + 1) / 2, angle, delay + 0.5],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65 },
					BORDERLESS: true
				}
			},
		];
	}
	return [
		{
			POSITION: [length - 2.5, width + 3, aspect, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 22.5, SATURATION_SHIFT: 0.5 },}
		}, {
			POSITION: [4.5, width + 4, 0, x + length - 8, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
			}
		}, {
			POSITION: [4.5, width + 4, 0, x + length - 12, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
			}
		}, {
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.65 },
				TYPE: "bullet",
			},
		}, {
			POSITION: [length - 1, width, aspect - 0.2, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.65 },
				BORDERLESS: true
			}
		}, {
			POSITION: [length - 2.5, width - 1.5, aspect - 0.2, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.65 },
				BORDERLESS: true
			}
		},
	];
}
function addHunter({length = 18, width = 8, dimensionDifference = 3, barrelCount = 2, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
	let output = [
		{
			POSITION: [length - 2.5, width + 2, -aspect - 0.3, x, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.8 } },
		},
	];
	let delayOffset = 0.5 / barrelCount;
	for (let i = 0; i < barrelCount; i++) stats.push(g.hunterSecondary);
	for (let i = barrelCount - 1; i >= 0; i--) {
		output.push(
			{
				POSITION: [length + i * dimensionDifference, width - i * dimensionDifference, aspect, x, y, angle, delay + delayOffset * (barrelCount - i - 1)],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
					TYPE: "bullet",
				},
			}, {
				POSITION: [length + i * dimensionDifference, width - i * dimensionDifference - 2.5, -aspect + 0.3, x, y, angle, delay + delayOffset * (barrelCount - i - 1)],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.75 },
					TYPE: "bullet",
				},
			},
		)
		stats.pop();
	}
	output.push(
		{
			POSITION: [length - 1.5, width - 3.5, -aspect + 0.3, x, y, angle, delay + delayOffset * (barrelCount - 1)],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.8 },
				TYPE: "bullet",
				BORDERLESS: true,
			},
		},
	)
	return output;
}
function addHeavySniper({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
	return [
		{
			POSITION: [length, width, 1, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6 },
			},
		}, {
			POSITION: [length - 1.5, width * 0.7, -1.3, x, y, angle, delay],
			PROPERTIES: { 
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.6}, 
				BORDERLESS: true
			},
		}, {
			POSITION: [length - 7, width * 0.4, -1.4, x, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5 } },
		}, {
			POSITION: [4, width + 2, 1, x + length - 7, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.6 },
			},
		}, {
			POSITION: [2, width + 2.5, 1, x + length - 6, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 },
			},
		},
	];
}
function addRailgun({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.sniper]) {
	let output = [
		{
			POSITION: [length - x - 3.5, width + 3, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.7 }}
		}, {
			POSITION: [length - x, width, 1, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
			},
		}, {
			POSITION: [(length - x) * 0.85, width * 0.85, 0.7, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 17.5, SATURATION_SHIFT: 0.8 },
				BORDERLESS: true,
			},
		}, {
			POSITION: [5, width + 3, -1.7, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15 },}
		}, {
			POSITION: [3.5, width + 1.5, -1.7, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.65 },}
		},
	];
	for (let i = 0; i < 3; i++) {
		output.splice(1, 0,
			{
				POSITION: [0.6, width + 4, 1, length - 4 - 2.5 * i, y, angle, delay],
			}
		)
	}
	return output;
}

function addNormal({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic], drawTop = true) {
	let output = [
		{
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 }
			},
		},
	];
	if (drawTop) {
		output.push(
			{
				POSITION: [length - 1.5, width * 0.85, aspect * 0.9, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 27.5, SATURATION_SHIFT: 0.5 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [length - 1.5, width * 0.5, aspect * -0.7, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 32.5, SATURATION_SHIFT: 0.5 },
					BORDERLESS: true,
				},
			}, {
				POSITION: [1.5 * aspect, aspect * width * 0.7, -0.6, x + length - 1.5 - 1.5 * aspect, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([...stats, g.fake]),
					TYPE: "bullet",
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10 },
				},
			},
		);
	}
	return output;
}
function addSpam({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic]) {
	return [
		{ // Main barrel
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15 }
			},
		}, {
			POSITION: [length - 1.2, width, aspect * (length - 2) / length, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.65 }
			},
		}, {
			POSITION: [length - 2, width - 1, aspect - 0.3, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift, SATURATION_SHIFT: 0.65 },
				BORDERLESS: true,
			},
		},
	];
}
function addGunner({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic]) {
	return [
		{ // Main barrel
			POSITION: [length, width, 1, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15 }
			},
		}, {
			POSITION: [length - 1.25, width * 0.8, -0.8, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.65 }
			},
		},
	];
}
function addCrowbar({length = 38, width = 6.5, aspect = 1, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 0) {
	return [
		{
			POSITION: [length - x - 8, width, -1.5, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 }},
		}, {
			POSITION: [length - x, width, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6 }}
		}, {
			POSITION: [length - x, width - 2, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
		}, {
			POSITION: [5, width + 2, -1.5, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.6 }}
		}, {
			POSITION: [5, width + 0.5, -1.6, x - 1.5, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 }},
		},
	];
}
function addHeavy({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic]) {
	return [
		{
			POSITION: [12.5, width * 1.3, -aspect + 0.25, x, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5 } },
		}, {
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 },
				BORDERLESS: true
			},
		}, {
			POSITION: [length, width * 0.8, -aspect + 0.175, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.8 },
				BORDERLESS: true
			},
		}, {
			POSITION: [length, width * 0.55, -aspect + 0.35, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 },
				BORDERLESS: true
			},
		}, {
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 },
				DRAW_FILL: false
			},
		},
	];
}
function addLauncher({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic], isSkimmer = false, TYPE = "missileProjectileSnowdread") {
	if (isSkimmer) {
		return [
			{
				POSITION: [10, width - 1, -0.75, x + length - 8, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 }} 
			}, {
				POSITION: [9.5, width - 3, -0.75, x + length - 8, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true} 
			}, {
				POSITION: [length, width, 1, x, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE,
					STAT_CALCULATOR: gunCalcNames.sustained,
					COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 },
				},
			}, {
				POSITION: [length - 2, width - 2, 0.8, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 }}
			}, {
				POSITION: [length, width - 2, 0.75, x - 3.5, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
			},
		];
	} else {
		return [
			{
				POSITION: [length - 6, width - 3, 1, x+8, y, angle, delay],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats(stats),
					TYPE,
					STAT_CALCULATOR: gunCalcNames.sustained,
					COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6 },
				},
			}, {
				POSITION: [length, width, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 }} 
			}, {
				POSITION: [length, width - 2, 1, x, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 }}
			}, {
				POSITION: [length, width - 2, 0.75, x - 1.5, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
			}, {
				POSITION: [length, width - 2, 0.75, x - 4, y, angle, 0],
				PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift + 2.5, SATURATION_SHIFT: 0.7 }, BORDERLESS: true}
			},
		];
	}
}
function addShotgun({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, realGuns = [], bigStats = [g.basic], smallStats = [g.basic]) {
	let output = [
		{
			POSITION: [length - x, width, 1, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.6 },
			},
		}, {
			POSITION: [length - x - 1.5, width - 2, 0.85, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 },
			},
		}, {
			POSITION: [6, width, -1.3, x, y, angle, 0],
			PROPERTIES: {
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.6 },
			},
		}, {
			POSITION: [length - x - 1, width / 2, -0.6, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.7 },
			},
		}, {
			POSITION: [6, width - 1.5, -1.3, x - 1.5, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 } },
		},
	];
	let hasSmall = false;
	for (let i = 0; i < realGuns.length; i++) {
		let gun = realGuns[i],
			stats = gun.small ? smallStats : bigStats,
			TYPE = i % 3 == 0 ? "casing" : "bullet";
		if (gun.small) hasSmall = true;
		output.push({
			POSITION: [gun.l, gun.w, 0.001, 0, g.y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE,
			}
		});
	}
	if (hasSmall) {
		output.splice(0, 0, {
			POSITION: [length - x + 2.5, width - 3.5, 1, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...bigStats, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6 },
			},
		});
	}
	return output;
}
function addTwister({length = 18, width = 8, aspect = -1.4, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic], TYPE = "spinmissile") {
	return [
		{
			POSITION: [10, width - 1, -0.5, x + length - 8, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65 },}
		}, {
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE,
				STAT_CALCULATOR: gunCalcNames.sustained,
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5 },
			},
		}, {
			POSITION: [length, width * 1.08, aspect, x - length / 5, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: 'bullet',
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.7 },
			},
		}, {
			POSITION: [length, width * 0.8, aspect - 0.1, x - length / 5 - 1.5, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: 'bullet',
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 6.25, SATURATION_SHIFT: 0.7 },
				BORDERLESS: true
			},
		}, {
			POSITION: [length - 2, width * 0.65, 0.7, x, y, angle, 0],
			PROPERTIES: {COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.65 }}
		},
	];
}
function addDrone({length = 18, width = 8, aspect = 1.2, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.drone], MAX_CHILDREN = 4, TYPE = "drone") {
	let output = [
		{
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE,
				MAX_CHILDREN,
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: gunCalcNames.drone,
				WAIT_TO_CYCLE: true,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.8}
			},
		}, {
			POSITION: [length - 1, width, 0.8, x, y, angle, 0],
			PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift, SATURATION_SHIFT: 0.8}, BORDERLESS: true },
		}, {
			POSITION: [length - 2.5, width * 0.8, -1.2, x, y, angle, 0],
			PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5} },
		},
	];
	if (MAX_CHILDREN > 2) {
		output.splice(0, 0,
			{
				POSITION: [length - 2, width + 3, 1, x, y, angle, 0],
				PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift} },
			}
		)
	}
	return output;
}
function addMinion({length = 18, gap = 3, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.factory], TYPE = "assailantMinionSnowdread", MAX_CHILDREN = 2) {
	return [
		{
			POSITION: [length + 1, width, -1.3, x, y, angle, 0],
			PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5, SATURATION_SHIFT: 0.6} },
		}, {
			POSITION: [gap, width - 1, 1, x + length, y, angle, 0],
			PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6} },
		}, {
			POSITION: [1.5, width, 1, x + length + gap, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE,
				STAT_CALCULATOR: gunCalcNames.drone,
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				MAX_CHILDREN,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6},
			},
		}, {
			POSITION: [length, width, 1, x, y, angle, 0],
			PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5} },
		}, {
			POSITION: [length + gap - 1, width * 0.6, -1.4, x, y, angle, 0],
			PROPERTIES: { COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15} },
		},
	];
}
function addAutoDrone({length = 18, width = 8, aspect = 1.2, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.drone], MAX_CHILDREN = 4) {
	return [
		{
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "turretedDroneSnowdread",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: gunCalcNames.drone,
				WAIT_TO_CYCLE: true,
				MAX_CHILDREN,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.65},
			},
		}, {
			POSITION: [length - 3, width - 2, aspect * 0.95, x, y, angle, delay],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}},
		}, {
			POSITION: [length - 1, width - 3, aspect, x, y, angle, delay],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.75}},
		}, {
			POSITION: [length - 2, width / 2, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5},}
		},
	];
}
function addHoncho({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.drone], MAX_CHILDREN = 4) {
	let sideAngle = Math.atan(((aspect - 1) * width / 2) / (x * 0.8));
	let xShift = -20 * Math.cos(sideAngle) + 11;
	return [
		{
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "honchoDroneSnowdread",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: gunCalcNames.drone,
				WAIT_TO_CYCLE: true,
				MAX_CHILDREN,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6},
			},
		}, {
			POSITION: [1.5, width * 1.1, 0.5, x + length - 2.5, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 2.5, SATURATION_SHIFT: 0.7}, BORDERLESS: true}
		}, {
			POSITION: [1.5, width * 1.1, 1, x + length - 4.5, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 5}}
		}, {
			POSITION: [length + 11, 4, 0.001, x + xShift, y + width * 0.25, angle + sideAngle * 180 / Math.PI, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5},}
		}, {
			POSITION: [length + 11, 4, 0.001, x + xShift, y - width * 0.25, angle - sideAngle * 180 / Math.PI, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 12.5},}
		},
	];
}
function addSwarm({length = 18, width = 8, aspect = 0.6, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.swarm]) {
	return [
		{
			POSITION: [length, width, aspect, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: "swarm",
				STAT_CALCULATOR: gunCalcNames.swarm,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.7}
			},
		}, {
			POSITION: [length * 1.5, width * 0.8, aspect, x - length * 0.65, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: "swarm",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.7},
				BORDERLESS: true
			},
		},
	];
}
function addTrap({length = 18, length2 = 3, width = 8, aspect = 1.6, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.trap], isBox = false) {
	return [
		{
			POSITION: [length, width * 1.25, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10}}
		}, {
			POSITION: [length, width, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 10, SATURATION_SHIFT: 0.6}}
		}, {
			POSITION: [length2, width, aspect, x + length, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: isBox ? "unsetTrap" : "trap",
				STAT_CALCULATOR: gunCalcNames.trap,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 12.5, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [length + length2 / 3, width * 0.8, 0.7, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 17.5,  SATURATION_SHIFT: 0.75}}
		},
	];
}
function addAutoTrap({length = 18, length2 = 3, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.trap], MAX_CHILDREN = 6, isBox = false) {
	let output = [
		{
			POSITION: [length, width, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6}}
		}, {
			POSITION: [length - 3, width + 3, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}}
		}, {
			POSITION: [length - 4, width + 1, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15}, BORDERLESS: true}
		}, {
			POSITION: [length2, width, aspect, x + length, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: isBox ? 'unsetPillboxWeakSnowdread' : 'autoTrapSnowdread',
				STAT_CALCULATOR: gunCalcNames.trap,
				INDEPENDENT: true,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6},
				MAX_CHILDREN,
				DESTROY_OLDEST_CHILD: true,
			},
		}, {
			POSITION: [length + length2 / 2, width * 0.9, 0.6, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.7}}
		},
	];
	if (isBox) {
		output.splice(1, 0, {
			POSITION: [length - 1, width - 2, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 7.5, SATURATION_SHIFT: 0.65}, BORDERLESS: true}
		});
		output.push({
			POSITION: [length + length2 / 2 - 1.5, width * 0.75, 0.6, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift, SATURATION_SHIFT: 0.75}, BORDERLESS: true}
		});
	}
	return output;
}
function addAuraTrap({length = 18, length2 = 3, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.trap], isBox = false) {
	return [
		{
			POSITION: [length, width, 1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6}}
		}, {
			POSITION: [length2 + 1, width - 1.5, -1.7, x + length - length2 - 3, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}}
		}, {
			POSITION: [length, width * 0.6, -0.1, x, y, angle, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.75}}
		}, {
			POSITION: [length2, width, aspect, x + length, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: isBox ? 'auraBlock' : 'auraTrap',
				STAT_CALCULATOR: gunCalcNames.trap,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: brightShift - 15, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [length2 - 1, width - 2, aspect, x + length + 1, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: 'bullet',
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: brightShift + 7.5}
			},
		},
	];
}
function addDroneOnAuto({length = 6, width = 12, aspect = 1.2, x = 8, y = 0, angle = 0, delay = 0}, brightShift = 6, stats = [g.drone]) {
	return [
		{
			POSITION: [length, width + 1, -1.2, x - 1, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 } },
		}, {
			POSITION: [length, width, 1.2, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: ['drone', {INDEPENDENT: true}],
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: gunCalcNames.drone,
				WAIT_TO_CYCLE: true,
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 20, SATURATION_SHIFT: 0.5 },
			},
		}, {
			POSITION: [length - 2, width * 2/3, 1, x - 1, y, angle, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 10 }, DRAW_ABOVE: true },
		},
	];
}
function addThruster({length = 18, width = 8, aspect = 1, x = 0, y = 0, angle = 0, delay = 0}, brightShift = 0, stats = [g.basic], useThrusterCalculator = true) {
	let STAT_CALCULATOR = useThrusterCalculator ? gunCalcNames.thruster : undefined;
	return [
		{ // Main barrel
			POSITION: [length, width, 1, x, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats(stats),
				TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
				STAT_CALCULATOR,
				AUTOFIRE: true,
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: brightShift + 15 }
			},
		}, {
			POSITION: [length - 6, width * 0.8, 1.6, x + 4, y, angle, delay],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([...stats, g.fake]),
				TYPE: ["bullet", {PERSISTS_AFTER_DEATH: true}],
				STAT_CALCULATOR,
				AUTOFIRE: true,
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: brightShift - 5, SATURATION_SHIFT: 0.65 }
			},
		},
	];
}

// Deco bodies
Class.eggBaseDeco = {
	SHAPE: "M 0.71 0.71 A 1 0.98 0 0 1 -0.71 0.71 L -0.6 0.6 A 1 1.25 0 0 0 0.6 0.6 L 0.71 0.71" + 
			"M -0.71 -0.71 A 1 0.98 180 0 1 0.71 -0.71 L 0.6 -0.6 A 1 1.25 180 0 0 -0.6 -0.6 L -0.71 -0.71" + 
			"M 0.79 0.33 A 1 0.95 45 0 1 0.6 0.6 L 0.54 0.54 A 1.88 1 45 0 0 0.71 0.29 L 0.79 0.33" + 
			"M -0.79 0.33 A 1 0.95 157.5 0 0 -0.6 0.6 L -0.54 0.54 A 1.88 1 157.5 0 1 -0.71 0.29 L -0.79 0.33" + 
			"M 0.79 -0.33 A 1 0.95 -45 0 0 0.6 -0.6 L 0.54 -0.54 A 1.88 1 -45 0 1 0.71 -0.29 L 0.79 -0.33" + 
			"M -0.79 -0.33 A 1 0.95 -157.5 0 1 -0.6 -0.6 L -0.54 -0.54 A 1.88 1 -157.5 0 0 -0.71 -0.29 L -0.79 -0.33",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 },
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 2; i++) {
	Class.eggBaseDeco.GUNS.push(
		{
			POSITION: [8.25, 6.75, 0.6, 0, 0, 180*i+55, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.85 },
				BORDERLESS: true,
			}
		}, {
			POSITION: [8.25, 6.75, 0.6, 0, 0, 180*i+125, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.85 },
				BORDERLESS: true,
			}
		}, {
			POSITION: [4, 1.3, 0.001, 9, 0, 48 + 180 * i, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
				DRAW_ABOVE: true,
			},
		}, {
			POSITION: [3.5, 1.7, 0.001, 9, 0, 90 + 180 * i, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
				DRAW_ABOVE: true,
			},
		}, {
			POSITION: [4, 1.3, 0.001, 9, 0, 132 + 180 * i, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
				DRAW_ABOVE: true,
			},
		}, {
			POSITION: [1.5, 1.3, 0, 7.5, 0, 48 + 180 * i, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
				DRAW_ABOVE: true,
			},
		}, {
			POSITION: [1, 1.7, 0, 8, 0, 90 + 180 * i, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
				DRAW_ABOVE: true,
			},
		}, {
			POSITION: [1.5, 1.3, 0, 7.5, 0, 132 + 180 * i, 0],
			PROPERTIES: {
				COLOR: { BASE: 6, BRIGHTNESS_SHIFT: -20 },
				DRAW_ABOVE: true,
			},
		}, 
	)
}
Class.squareBaseDeco = {
	SHAPE: "M -0.98 0.98 L -0.3 0.75 L -0.63 0.63 L -0.75 0.3 L -0.98 0.98" + 
			"M 0.98 0.98 L 0.75 0.3 L 0.63 0.63 L 0.3 0.75 L 0.98 0.98" + 
			"M 0.98 -0.98 L 0.3 -0.75 L 0.63 -0.63 L 0.75 -0.3 L 0.98 -0.98" + 
			"M -0.98 -0.98 L -0.75 -0.3 L -0.63 -0.63 L -0.3 -0.75 L -0.98 -0.98",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 },
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.squareBaseDeco.GUNS.push(
		{
			POSITION: [4, 2, 0.001, 9.5, 2.6, 20 + 90 * i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15 } },
		}, {
			POSITION: [4, 2, 0.001, 9.5, -2.6, 70 + 90 * i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15 } },
		}, {
			POSITION: [5, 1.5, 0.001, -2, 9, -70 + 90 * i, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 17.5 } },
		}, {
			POSITION: [5, 1.5, 0.001, -2, -9, 70 + 90 * i, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 17.5 } },
		},
	)
}
Class.triangleBaseDeco = {
	SHAPE: "M -1.546 -0.108 L -1.546 0.108 L -0.175 0.303 L 0.679 1.393 L 0.867 1.285 L 0.35 0 L 0.867 -1.285 L 0.679 -1.393 L -0.175 -0.303 L -1.546 -0.108",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.triangleBaseDeco.GUNS.push(
		{
			POSITION: [7, 3, 0.001, 10, 0, 120 * i + 60, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.7 } },
		}, {
			POSITION: [5, 2.5, 0.001, 6.5, -2, 120 * i + 90, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.85 } },
		}, {
			POSITION: [5, 2.5, 0.001, 6.5, 2, 120 * i + 30, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.85 } },
		}, {
			POSITION: [9, 5, 0.25, 0, 0, 120 * i + 60, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 12.5 }, BORDERLESS: true, DRAW_ABOVE: true },
		},
	)
}
Class.pentagonBaseDeco = {
	SHAPE: "M -1.207 -0.324 L -0.724 -0.194 L -0.408 -0.629 L -0.681 -1.048 L -0.688 -0.5 Z" +
		"M -1.207 0.324 L -0.724 0.194 L -0.408 0.629 L -0.681 1.048 L -0.688 0.5 Z" +
		"M 0.787 -0.971 L 0.472 -0.583 L -0.039 -0.749 L -0.065 -1.248 L 0.263 -0.808 Z" +
		"M 0.787 0.971 L 0.472 0.583 L -0.039 0.749 L -0.065 1.248 L 0.263 0.808 Z" +
		"M 1.167 0.448 L 0.7 0.269 L 0.7 -0.269 L 1.167 -0.448 L 0.85 0 Z",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.pentagonBaseDeco.GUNS.push(
		{
			POSITION: [4, 6, 0.001, 8.5, 0, 72 * i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6 } },
		}, {
			POSITION: [7, 2.5, 0.001, 6, -6.2, 72 * i + 60, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.8 } },
		}, {
			POSITION: [7, 2.5, 0.001, 6, 6.2, 72 * i - 60, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.8 } },
		},
	)
}
Class.hexagonBaseDeco = {
	SHAPE: "M -1.1 0 L -0.956 0.292 L -0.669 0.205 L -0.669 -0.205 L -0.956 -0.292 Z" +
		"M -0.55 0.952 L -0.225 0.974 L -0.157 0.682 L -0.512 0.477 L -0.731 0.682 Z" +
		"M -0.55 -0.952 L -0.225 -0.974 L -0.157 -0.682 L -0.512 -0.477 L -0.731 -0.682 Z" +
		"M 0.55 0.952 L 0.225 0.974 L 0.157 0.682 L 0.512 0.477 L 0.731 0.682 Z" +
		"M 0.55 -0.952 L 0.225 -0.974 L 0.157 -0.682 L 0.512 -0.477 L 0.731 -0.682 Z" +
		"M 1.1 0 L 0.956 0.292 L 0.669 0.205 L 0.669 -0.205 L 0.956 -0.292 Z",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 2.5 },
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 6; i++) {
	Class.hexagonBaseDeco.GUNS.push(
		{
			POSITION: [1.75, 3, -0.75, 7.5, 0, 60 * i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 2.5, SATURATION_SHIFT: 0.9 }, DRAW_ABOVE: true },
		}, {
			POSITION: [1, 9, 0, 8.5, 0, 60 * i + 30, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 10, SATURATION_SHIFT: 1.15 } },
		},
	)
}

// Auras
Class.auraSmall = {
	PARENT: ["auraBase"],
	LAYER: 30,
	FACING_TYPE: ["spin", {speed: -0.04}],
	LABEL: "Aura",
	COLOR: 0,
	BODY: { DAMAGE: 0.5 },
	BORDER_FIRST: true,
	SHAPE: "M 1 0 L 0.715 0.519 L 0.309 0.951 L -0.273 0.84 L -0.809 0.588 L -0.883 0 L -0.809 -0.588 L -0.273 -0.84 L 0.309 -0.951 L 0.715 -0.519 L 1 0" + 
		"L 0.309 0.951 L -0.809 0.588 L -0.809 -0.588 L 0.309 -0.951 L 1 0" + 
		"L 0 0 L 0.309 0.951 M 0 0 L -0.809 0.588 M 0 0 L -0.809 -0.588 M 0 0 L 0.309 -0.951",
}
Class.healAuraSmall = {
	PARENT: ["auraSmall"],
	LABEL: "Heal Aura",
	HEALER: true,
	COLOR: 12,
	BODY: { DAMAGE: 0.1 },
}
Class.auraMedium = {
	PARENT: ["auraBase"],
	LAYER: 30,
	FACING_TYPE: ["spin", {speed: -0.04}],
	LABEL: "Aura",
	COLOR: 0,
	BODY: { DAMAGE: 0.5 },
	BORDER_FIRST: true,
	SHAPE: "M 1 0 L 0.809 0.588 L 1 0 L 0.809 0.588 L 0.309 0.951 L -0.309 0.951 L -0.809 0.588 L -1 0 L -0.809 -0.588 L -0.309 -0.951 L 0.309 -0.951 L 0.809 -0.588 L 1 0" + 
		"L 0.856 0.278 L 0.809 0.588 L 0.551 0.759 L 0.309 0.951 L 0 0.9 L -0.309 0.951 L -0.551 0.759 L -0.809 0.588 L -0.856 0.278 L -1 0 L -0.892 -0.29 L -0.809 -0.588 L -0.529 -0.728 L -0.309 -0.951 L 0 -0.938 L 0.309 -0.951 L 0.529 -0.728 L 0.809 -0.588 L 0.892 -0.29 L 1 0" + 
		"M 0.856 0.278 L 0.551 0.759 L 0 0.9 L -0.551 0.759 L -0.856 0.278 L -0.892 -0.29 L -0.529 -0.728 L 0 -0.938 L 0.529 -0.728 L 0.892 -0.29 L 0.856 0.278" + 
		"M 0.892 -0.29 L 0.546 -0.178 L 0.856 0.278 L 0.338 0.465 L 0.551 0.759 M 0.338 0.465 L 0 0.9 L -0.338 0.465 L -0.551 0.759 M -0.338 0.465 L -0.856 0.278 L -0.546 -0.178 L -0.892 -0.29 M -0.546 -0.178 L -0.529 -0.728 L 0 -0.575 L 0 -0.938 M 0 -0.575 L 0.529 -0.728 L 0.546 -0.178" + 
		"L 0.338 0.465 L 0 0 L 0.546 -0.178 L 0 -0.575 L 0 0 L -0.546 -0.178 L -0.338 0.465 L 0 0 M 0 -0.575 L -0.546 -0.178 M -0.338 0.465 L 0.338 0.465",
}
Class.healAuraMedium = {
	PARENT: ["auraMedium"],
	LABEL: "Heal Aura",
	HEALER: true,
	COLOR: 12,
	BODY: { DAMAGE: 0.1 },
}
Class.auraLarge = {
	PARENT: ["auraBase"],
	LAYER: 30,
	FACING_TYPE: ["spin", {speed: -0.04}],
	LABEL: "Aura",
	COLOR: 0,
	BODY: { DAMAGE: 0.5 },
	BORDER_FIRST: true,
	SHAPE: "M 1 0 L 0.988 0.156 L 0.951 0.309 L 0.891 0.454 L 0.809 0.588 L 0.707 0.707 L 0.588 0.809 L 0.454 0.891 L 0.309 0.951 L 0.156 0.988 L 0 1 L -0.156 0.988 L -0.309 0.951 L -0.454 0.891 L -0.588 0.809 L -0.707 0.707 L -0.809 0.588 L -0.891 0.454 L -0.951 0.309 L -0.988 0.156 L -1 0 L -0.988 -0.156 L -0.951 -0.309 L -0.891 -0.454 L -0.809 -0.588 L -0.707 -0.707 L -0.588 -0.809 L -0.454 -0.891 L -0.309 -0.951 L -0.156 -0.988 L 0 -1 L 0.156 -0.988 L 0.309 -0.951 L 0.454 -0.891 L 0.588 -0.809 L 0.707 -0.707 L 0.809 -0.588 L 0.891 -0.454 L 0.951 -0.309 L 0.988 -0.156 L 1 0" + 
		"M 0.988 -0.156 L 0.988 0.156 L 0.891 0.454 L 0.707 0.707 L 0.454 0.891 L 0.156 0.988 L -0.156 0.988 L -0.454 0.891 L -0.707 0.707 L -0.891 0.454 L -0.988 0.156 L -0.988 -0.156 L -0.891 -0.454 L -0.707 -0.707 L -0.454 -0.891 L -0.156 -0.988 L 0.156 -0.988 L 0.454 -0.891 L 0.707 -0.707 L 0.891 -0.454 L 0.988 -0.156 L 0.949 0" + 
		"L 0.988 0.156 L 0.891 0.256 L 0.891 0.454 L 0.739 0.537 L 0.707 0.707 L 0.519 0.769 L 0.454 0.891 L 0.293 0.902 L 0.156 0.988 L 0.032 0.927 L -0.156 0.988 L -0.282 0.869 L -0.454 0.891 L -0.571 0.731 L -0.707 0.707 L -0.768 0.558 L -0.891 0.454 L -0.871 0.317 L -0.988 0.156 L -0.914 0 L -0.988 -0.156 L -0.871 -0.317 L -0.891 -0.454 L -0.768 -0.558 L -0.707 -0.707 L -0.571 -0.731 L -0.454 -0.891 L -0.282 -0.869 L -0.156 -0.988 L 0.032 -0.927 L 0.156 -0.988 L 0.293 -0.902 L 0.454 -0.891 L 0.519 -0.769 L 0.707 -0.707 L 0.739 -0.537 L 0.891 -0.454 L 0.891 -0.256 L 0.988 -0.156 L 0.949 0" + 
		"L 0.891 0.256 L 0.739 0.537 L 0.519 0.769 L 0.293 0.902 L 0.032 0.927 L -0.282 0.869 L -0.571 0.731 L -0.768 0.558 L -0.871 0.317 L -0.914 0 L -0.871 -0.317 L -0.768 -0.558 L -0.571 -0.731 L -0.282 -0.869 L 0.032 -0.927 L 0.293 -0.902 L 0.519 -0.769 L 0.739 -0.537 L 0.891 -0.256 L 0.949 0" + 
		"M 0.834 0 L 0.891 0.256 L 0.704 0.291 L 0.739 0.537 L 0.495 0.579 L 0.519 0.769 L 0.258 0.793 L 0.032 0.927 L -0.06 0.759 L -0.282 0.869 L -0.398 0.649 L -0.571 0.731 L -0.674 0.49 L -0.871 0.317 L -0.741 0.178 L -0.914 0 L -0.741 -0.178 L -0.871 -0.317 L -0.674 -0.49 L -0.571 -0.731 L -0.398 -0.649 L -0.282 -0.869 L -0.06 -0.759 L 0.032 -0.927 L 0.258 -0.793 L 0.519 -0.769 L 0.495 -0.579 L 0.739 -0.537 L 0.704 -0.291 L 0.891 -0.256 L 0.834 0" + 
		"L 0.704 0.291 L 0.495 0.579 L 0.258 0.793 L -0.06 0.759 L -0.398 0.649 L -0.674 0.49 L -0.741 0.178 L -0.741 -0.178 L -0.674 -0.49 L -0.398 -0.649 L -0.06 -0.759 L 0.258 -0.793 L 0.495 -0.579 L 0.704 -0.291 L 0.834 0" + 
		"M 0.592 0 L 0.704 0.291 L 0.413 0.3 L 0.495 0.579 L 0.183 0.563 L -0.06 0.759 L -0.158 0.485 L -0.398 0.649 L -0.479 0.348 L -0.741 0.178 L -0.51 0 L -0.741 -0.178 L -0.479 -0.348 L -0.398 -0.649 L -0.158 -0.485 L -0.06 -0.759 L 0.183 -0.563 L 0.495 -0.579 L 0.413 -0.3 L 0.704 -0.291 L 0.592 0" + 
		"L 0.413 0.3 L 0.183 0.563 L -0.158 0.485 L -0.479 0.348 L -0.51 0 L -0.479 -0.348 L -0.158 -0.485 L 0.183 -0.563 L 0.413 -0.3 L 0.592 0" + 
		"M 0.292 0 L 0.413 0.3 L 0.09 0.277 L -0.158 0.485 L -0.236 0.171 L -0.51 0 L -0.236 -0.171 L -0.158 -0.485 L 0.09 -0.277 L 0.413 -0.3 L 0.292 0 L 0.09 0.277" + 
		"L -0.236 0.171 L -0.236 -0.171 L 0.09 -0.277 L 0.292 0 M 0 0 L 0.949 0" + 
		"M 0 0 L 0.293 0.902 M 0 0 L -0.768 0.558 M 0 0 L -0.768 -0.558 M 0 0 L 0.293 -0.902",
}
Class.healAuraLarge = {
	PARENT: ["auraLarge"],
	LABEL: "Heal Aura",
	HEALER: true,
	COLOR: 12,
	BODY: { DAMAGE: 0.1 },
}
Class.auraSymbolSnowdreads = {
	PARENT: ["genericTank"],
	CONTROLLERS: [["spin", { speed: -0.04 }]],
	INDEPENDENT: true,
	COLOR: 0,
	BORDER_FIRST: true,
	SHAPE: "M 1 0 L 0.797 0.46 L 0.5 0.866 L 0 0.92 L -0.5 0.866 L -0.797 0.46 L -1 0 L -0.797 -0.46 L -0.5 -0.866 L 0 -0.92 L 0.5 -0.866 L 0.797 -0.46 L 1 0 Z" +
	"M 0.52 0.3 L 0.52 -0.3 L 0.797 -0.46 M 0.52 -0.3 L 0 -0.6 L 0 -0.92 M 0 -0.6 L -0.52 -0.3 L -0.797 -0.46 M -0.52 -0.3 L -0.52 0.3 L -0.797 0.46 M -0.52 0.3 L 0 0.6 L 0 0.92 M 0 0.6 L 0.52 0.3 L 0.797 0.46"
}
Class.healAuraSymbolSnowdreads = {
	PARENT: ["genericTank"],
	CONTROLLERS: [["spin", { speed: -0.04 }]],
	INDEPENDENT: true,
	COLOR: "red",
	BORDER_FIRST: true,
	SHAPE: "M 1 0 L 0.5 0.866 L -0.5 0.866 L -1 0 L -0.5 -0.866 L 0.5 -0.866 L 1 0 Z M 0.7 0 L 1 0 L 0.5 0.866 L 0.7 0 L -0.35 0.606 L 0.5 0.866 L -0.5 0.866 L -0.35 0.606 M -0.5 0.866 L -1 0 L -0.35 0.606 L -0.35 -0.606 L -1 0 L -0.5 -0.866 L -0.35 -0.606 L -0.5 -0.866 L 0.5 -0.866 L -0.35 -0.606 L 0.7 0 L 0.5 -0.866 L 1 0",
};
function addAura(damageFactor = 1, sizeFactor = 1, opacity = 0.3, auraColor, auraSize = "Medium") {
	let isHeal = damageFactor < 0;
	let auraType = isHeal ? "healAura" + auraSize : "aura" + auraSize;
	let symbolType = isHeal ? "healAuraSymbolSnowdreads" : "auraSymbolSnowdreads";
	auraColor = auraColor ?? (isHeal ? 12 : 0);
	return {
		PARENT: ["genericTank"],
		INDEPENDENT: true,
		LABEL: "",
		COLOR: 17,
		GUNS: [
			{
				POSITION: [0, 20, 1, 0, 0, 0, 0,],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.aura, { size: sizeFactor, damage: damageFactor }]),
					TYPE: [auraType, {COLOR: auraColor, ALPHA: opacity}],
					MAX_CHILDREN: 1,
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
				}, 
			}, 
		],
		TURRETS: [
			{
				POSITION: [20 - isHeal, 0, 0, 0, 360, 1],
				TYPE: [symbolType, {COLOR: auraColor, INDEPENDENT: true}],
			},
		]
	};
}

function addTrinoughtAuraRing(heal = false) {
	let output = [],
		TYPE = heal ? "trinoughtSmallHealAura" : "trinoughtSmallAura";
	for (let i = 0; i < 3; i++) {
		output.push(
			{
				POSITION: [3.5, 10.5, 0, 120*i+60, 360, 1],
				TYPE,
			},
		);
	}
	return output;
}
function addTrinoughtTurretRing() {
	let output = [];
	for (let i = 0; i < 3; i++) {
		output.push(
			{
				POSITION: [3.5, 10.5, 0, 120*i+60, 180, 1],
				TYPE: "spamAutoTurret",
			},
		);
	}
	return output;
}
function addPentanoughtAuraRing(heal = false) {
	let output = [],
		TYPE = heal ? "pentanoughtSmallHealAura" : "pentanoughtSmallAura";
	for (let i = 0; i < 5; i++) {
		output.push(
			{
				POSITION: [4, 8.5, 0, 72*i+36, 360, 1],
				TYPE,
			},
		)
	}
	return output;
}
function addPentanoughtTurretRing() {
	let output = [];
	for (let i = 0; i < 5; i++) {
		output.push(
			{
				POSITION: [3.25, 9, 0, 72*i+36, 180, 1],
				TYPE: "spamAutoTurret",
			},
		)
	}
	return output;
}

// Misc
Class.genericDreadnoughtSnowdread = {
	PARENT: ["genericTank"],
	SKILL_CAP: Array(10).fill(smshskl),
	REROOT_UPGRADE_TREE: ["dreadWeaponSnowdread", "dreadBodySnowdread"],
}
Class.genericEggnoughtSnowdread = {
	PARENT: ["genericDreadnoughtSnowdread"],
	BODY: eggnoughtBody,
	SHAPE: 0,
	COLOR: 6,
	SIZE: 16,
	DANGER: 8,
}
Class.genericSquarenoughtSnowdread = {
	PARENT: ["genericDreadnoughtSnowdread"],
	BODY: squarenoughtBody,
	SHAPE: 4,
	COLOR: 13,
	SIZE: 20,
	DANGER: 9,
}
Class.genericTrinoughtSnowdread = {
	PARENT: ["genericDreadnoughtSnowdread"],
	BODY: trinoughtBody,
	SHAPE: 3.5,
	COLOR: 2,
	SIZE: 23,
	DANGER: 10,
}
Class.genericPentanoughtSnowdread = {
	PARENT: ["genericDreadnoughtSnowdread"],
	BODY: pentanoughtBody,
	SHAPE: 5.5,
	COLOR: 14,
	SIZE: 25,
	DANGER: 11,
}
Class.genericHexnoughtSnowdread = {
	PARENT: ["genericDreadnoughtSnowdread"],
	BODY: hexnoughtBody,
	SHAPE: 6,
	COLOR: 0,
	SIZE: 26,
	DANGER: 12,
}

Class.spamAutoTurret = {
	PARENT: ["autoTankGun"],
	INDEPENDENT: true,
	COLOR: 17,
	GUNS: [
		{
			POSITION: [17, 14, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
			},
		}, {
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.autoTurret, {recoil: 0.2}]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [14, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
			},
		},
	],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: -1, BORDERLESS: true}],
		},
	],
}
Class.missileProjectileSnowdread = {
	PARENT: "bullet",
	LABEL: "Missile",
	INDEPENDENT: true,
	BODY: { RANGE: 120 },
	GUNS: [
		...addThruster({length: 16, width: 6, y: -2, angle: 130}, -2.5, [g.basic, g.skimmer, g.lowPower, {reload: 0.5, recoil: 1.35, speed: 1.7, maxSpeed: 1.7}]),
		...addThruster({length: 16, width: 6, y: 2, angle: -130}, -2.5, [g.basic, g.skimmer, g.lowPower, {reload: 0.5, recoil: 1.35, speed: 1.7, maxSpeed: 1.7}]),
	],
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}}],
		}
	],
}
Class.superMissileSnowdread = {
	PARENT: ["bullet"],
	LABEL: "Missile",
	INDEPENDENT: true,
	BODY: { RANGE: 120 },
	GUNS: [
		...addThruster({length: 14, width: 7, y: -2, angle: 130}, -2.5, [g.basic, g.skimmer, g.lowPower, {speed: 1.7, maxSpeed: 1.7, recoil: 2.7, damage: 0.6}]),
		...addThruster({length: 14, width: 7, y: 2, angle: -130}, -2.5, [g.basic, g.skimmer, g.lowPower, {speed: 1.7, maxSpeed: 1.7, recoil: 2.7, damage: 0.6}]),
		...addThruster({length: 15.5, width: 7, delay: 0.2}, -2.5, [g.basic, g.skimmer, {speed: 2.2, maxSpeed: 2.2, damage: 0.9}], false),
	],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [9, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.6}, BORDERLESS: true}],
		},
	],
};
Class.betadrone = {
	PARENT: ["drone"],
	TURRETS: [
		{
			POSITION: [10, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: -1}],
		},
	]
}
Class.droneAutoTurretSnowdread = {
	PARENT: 'autoTurret',
	CONTROLLERS: ['nearestDifferentMaster'],
	INDEPENDENT: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.8},
	GUNS: [
		{
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.overdrive]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.8},
			},
		},
	]
}
Class.turretedDroneSnowdread = {
	PARENT: 'drone',
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ['triangle', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [10, 0, 0, 180, 360, 1],
			TYPE: 'droneAutoTurretSnowdread',
		},
	]
}
Class.honchoDroneSnowdread = {
	PARENT: 'drone',
	TURRETS: [
		{
			POSITION: [20, 0, 0, 180, 0, 1],
			TYPE: ["aggressorMinionTopSnowdread"],
		},
	]
}
Class.trapAutoTurret = {
	PARENT: "spamAutoTurret",
	GUNS: [
		{
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.turret, g.overdrive, {recoil: 0}]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
			},
		},
	],
}
Class.autoTrapSnowdread = {
	PARENT: 'trap',
	TURRETS: [
		{
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: "trapAutoTurret",
		},
	],
}
Class.pillboxTurretWeakSnowdread = {
	PARENT: "spamAutoTurret",
	LABEL: "",
	BODY: {
		FOV: 2,
	},
	HAS_NO_RECOIL: true,
	GUNS: [
		{
			POSITION: [17, 15, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.minionGun, g.turret, g.power, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
			},
		}, {
			POSITION: [22, 11, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.minionGun, g.turret, g.power, g.autoTurret, {density: 0.1},]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [14, 13, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.minionGun, g.turret, g.power, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
			},
		},
	],
}
Class.pillboxTurretSnowdread = {
	PARENT: "spamAutoTurret",
	LABEL: "",
	BODY: {
		FOV: 2,
	},
	HAS_NO_RECOIL: true,
	GUNS: [
		{
			POSITION: [17, 15, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
			},
		}, {
			POSITION: [22, 11, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, {density: 0.1}]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [14, 13, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.turret, g.power, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
			},
		},
	],
}
Class.unsetPillboxTopSnowdread = {
	SHAPE: "M -1.3 -0.15 L -1.3 0.15 L -0.3 0.3 L -0.15 1.3 L 0.15 1.3 L 0.3 0.3 L 1.3 0.15 L 1.3 -0.15 L 0.3 -0.3 L 0.15 -1.3 L -0.15 -1.3 L -0.3 -0.3 Z",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
	MIRROR_MASTER_ANGLE: true,
}
Class.unsetPillboxWeakSnowdread = {
	PARENT: 'unsetPillbox',
	TURRETS: [
		{
			POSITION: [20, 0, 0, 45, 360, 1],
			TYPE: "unsetPillboxTopSnowdread",
		}, {
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: "pillboxTurretWeakSnowdread",
		},
	]
}
Class.unsetPillboxSnowdread = {
	PARENT: 'unsetPillbox',
	TURRETS: [
		{
			POSITION: [20, 0, 0, 45, 360, 1],
			TYPE: "unsetPillboxTopSnowdread",
		}, {
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: "pillboxTurretSnowdread",
		},
	]
}

// T0
Class.dreadSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Dreadnought",
	UPGRADE_LABEL: "Snowdreads",
	UPGRADE_TOOLTIP: "The explosions of gunfire pierce\nthrough the quiet drifting of snow.",
	LEVEL: 90,
	EXTRA_SKILL: 18,
}
Class.dreadWeaponSnowdread = {
	LABEL: "Weapons",
	COLOR: 6,
	REROOT_UPGRADE_TREE: "dreadWeaponSnowdread",
}
Class.dreadBodySnowdread = {
	LABEL: "Bodies",
	COLOR: 6,
	REROOT_UPGRADE_TREE: "dreadBodySnowdread",
}

// T1 Weapons
Class.swordSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Sword",
	UPGRADE_TOOLTIP: "Snipers",
	GUNS: [],
}
for (let i = 0; i < 2; i++) {
	Class.swordSnowdread.GUNS.push(
		...addSniper({length: 20, width: 7, angle: 180 * i}, 0, [g.basic, g.sniper, g.assassin, {reload: 0.85}])
	)
}
Class.sword2Snowdread = {
	PARENT: "swordSnowdread",
	BATCH_UPGRADES: true,
}
Class.pacifierSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Pacifier",
	UPGRADE_TOOLTIP: "Bullet Spam",
	GUNS: [],
}
for (let i = 0; i < 2; i++) {
	Class.pacifierSnowdread.GUNS.push(
		...addNormal({length: 15, width: 7.5, angle: 180 * i}, 0, [g.basic, {reload: 0.8}])
	)
}
Class.pacifier2Snowdread = {
	PARENT: "pacifierSnowdread",
	BATCH_UPGRADES: true,
}
Class.peacekeeperSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Peacekeeper",
	UPGRADE_TOOLTIP: "Heavy Bullets",
	GUNS: [],
}
for (let i = 0; i < 2; i++) {
	Class.peacekeeperSnowdread.GUNS.push(
		...addHeavy({length: 17, width: 9, angle: 180*i}, 0, [g.basic, {reload: 1.2, damage: 1.5}]),
	)
}
Class.peacekeeper2Snowdread = {
	PARENT: "peacekeeperSnowdread",
	BATCH_UPGRADES: true,
}
Class.invaderSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Invader",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: [],
}
for (let i = 0; i < 2; i++) {
	Class.invaderSnowdread.GUNS.push(
		...addDrone({length: 5, width: 9, angle: 180*i}, 0, [g.drone, g.overseer, {reload: 0.85}])
	)
}
Class.invader2Snowdread = {
	PARENT: "invaderSnowdread",
	BATCH_UPGRADES: true,
}
Class.centaurSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Centaur",
	UPGRADE_TOOLTIP: "Traps",
	GUNS: [],
}
for (let i = 0; i < 2; i++) {
	Class.centaurSnowdread.GUNS.push(
		...addTrap({length: 13, length2: 3, width: 7, angle: 180*i}, 0, [g.trap, {health: 2}])
	)
}
Class.centaur2Snowdread = {
	PARENT: "centaurSnowdread",
	BATCH_UPGRADES: true,
}

// T1 Bodies
Class.byteTurretSnowdread = {
	PARENT: ["genericTank"],
	CONTROLLERS: ["nearestDifferentMaster"],
	INDEPENDENT: true,
	COLOR: {
		BASE: 6,
		BRIGHTNESS_SHIFT: -20,
		SATURATION_SHIFT: 0.5,
	},
	GUNS: [
		{
			POSITION: [18, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
			},
		}, { // Main gun
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 },
			},
		}, {
			POSITION: [18.5, 6.5, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.5 },
				BORDERLESS: true,
			},
		}, {
			POSITION: [14.5, 2, 1, 0, 5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		}, {
			POSITION: [14.5, 2, 1, 0, -5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		}, {
			POSITION: [10, 6, 0.5, 0, 0, 123, 0],
			PROPERTIES: { 
				COLOR: 17,
				DRAW_ABOVE: true,
			}
		}, {
			POSITION: [10, 6, 0.5, 0, 0, -123, 0],
			PROPERTIES: { 
				COLOR: 17,
				DRAW_ABOVE: true,
			}
		}
	],
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [8, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.byteSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Byte",
	UPGRADE_TOOLTIP: "Auto Turret",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 1],
			TYPE: 'egg',
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "eggBaseDeco",
		}, {
			POSITION: [9, 0, 0, 0, 360, 1],
			TYPE: 'byteTurretSnowdread',
		},
	],
}
Class.showerTurretSnowdread = {
	PARENT: "genericTank",
	LABEL: "",
	BODY: { FOV: 1.5 },
	CONTROLLERS: [[ 'spin', {speed: 0.03}]],
	COLOR: {
		BASE: 6,
		BRIGHTNESS_SHIFT: -20,
		SATURATION_SHIFT: 0.5,
	},
	INDEPENDENT: true,
	MAX_CHILDREN: 4,
	GUNS: [
		...addDroneOnAuto({length: 6, width: 12, x: 8}, 0, [g.drone, {size: 1.3}])
	],
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [8, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.showerSnowdread = { // Drones
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Shower",
	UPGRADE_TOOLTIP: "Drone Turret",
	BODY: {
		SPEED: 0.93,
		FOV: 1.1,
	},
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 1],
			TYPE: 'egg',
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "eggBaseDeco",
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "showerTurretSnowdread",
		},
	],
}
Class.atmosphereAuraSnowdread = addAura(1, 1, 0.15);
Class.atmosphereSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Atmosphere",
	UPGRADE_TOOLTIP: "Damage Aura",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: 'egg',
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "eggBaseDeco",
		}, {
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: 'atmosphereAuraSnowdread',
		},
	],
}
Class.juggernautSnowdread = {
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Juggernaut",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: {
		HEALTH: 1.6,
		SHIELD: 1.6,
		REGEN: 1.5,
		SPEED: 0.8,
	},
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "eggBaseDeco",
		}, {
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 5}, BORDERLESS: true}],
		}, {
			POSITION: [6.5, 0, 0, 0, 0, 1],
			TYPE: ['hexagon', {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 15}, BORDERLESS: true, MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [24, 0, 0, 0, 0, 0],
			TYPE: ['egg', {COLOR: 9}]
		},
	],
}
Class.stomperTurretSnowdread = {
	PARENT: 'genericTank',
	MIRROR_MASTER_ANGLE: true,
	LABEL: "",
	COLOR: -1,
	GUNS: [],
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -15}}]
		}
	]
}
for(let i = 0; i < 2; i++) {
	Class.stomperTurretSnowdread.GUNS.push(
		{
			POSITION: [17, 17, -0.2, 0, 0, 180*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [15, 12.5, -0.2, 0, 0, 180*i, 0],
			PROPERTIES: { COLOR: { BASE: 9, BRIGHTNESS_SHIFT: 7.5 }, BORDERLESS: true },
		},
	)
}
Class.stomperSnowdread = { // Size increase
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Stomper",
	UPGRADE_TOOLTIP: "Size Increase",
	SIZE: 1.2,
	BODY: {
		SPEED: 0.9,
		HEALTH: 1.6,
	},
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "eggBaseDeco",
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: 'stomperTurretSnowdread',
		},
	],
}
Class.dropperTurretSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [["spin", {speed: -0.035}]],
	INDEPENDENT: true,
	LABEL: "",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
	GUNS: [
		{ 
			POSITION: [13, 25, 1, -6.5, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20 } },
		}, { 
			POSITION: [8, 32, 1, -4, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 } },
		},
	],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [6.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.dropperSnowdread = { // Minelayer
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Dropper",
	UPGRADE_TOOLTIP: "Trap Setter",	
	GUNS: [
		{
			POSITION: [0, 7, 1, 3, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, {recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
				TYPE: 'trap',
				STAT_CALCULATOR: gunCalcNames.trap,
			},
		}
	],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: 'egg',
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "eggBaseDeco",
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: 'dropperTurretSnowdread',
		}
	],
}
Class.spotterRadarSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [['spin', {speed: 0.02}]],
	INDEPENDENT: true,
	SHAPE: [[0.225, 1], [0.225, -1], [-0.225, -1], [-0.225, 1]],
	COLOR: 17,
	GUNS: [
		{
			POSITION: [4.5, 26, 1, -2.25, 0, 0, 0],
			PROPERTIES: {COLOR: -1}
		}, {
			POSITION: [7, 17, 1, -3.5, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -20}}
		},
	]
};
Class.spotterSnowdread = { // FOV
	PARENT: ["genericEggnoughtSnowdread"],
	LABEL: "Spotter",
	UPGRADE_TOOLTIP: "FOV Boost",
	BODY: {
		FOV: 1.1,
	},
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 1],
			TYPE: 'egg',
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "eggBaseDeco",
		}, {
			POSITION: [9, 0, 0, 0, 0, 1],
			TYPE: 'egg',
		}, {
			POSITION: [13, 0, 0, 0, 360, 1],
			TYPE: 'spotterRadarSnowdread',
		},
	],
}

// T2 Weapons
Class.sabreSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Sabre",
	UPGRADE_TOOLTIP: "Assassins",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.sabreSnowdread.GUNS.push(
		...addAssassin({length: 24, width: 7, x: 7, angle: 90*i}, 7.5, [g.basic, g.sniper, g.assassin, g.assassin, {reload: 0.85}])
	)
}
Class.gladiusSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Gladius",
	UPGRADE_TOOLTIP: "Rifles",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.gladiusSnowdread.GUNS.push(
		...addRifle({length: 19.5, width: 5, angle: 90*i}, -2.5, [g.basic, g.sniper, g.rifle, {health: 1.3}])
	)
}
Class.slingSnowdread = { // hunter
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Sling",
	UPGRADE_TOOLTIP: "Hunters",
	CONTROLLERS: [["zoom", { distance: 300 }]],
	TOOLTIP: "Hold right click to zoom.",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.slingSnowdread.GUNS.push(
		...addHunter({length: 17, width: 9, angle: 90*i}, -10, [g.basic, g.sniper, g.hunter, {health: 1.1, speed: 1.05}])
	)
}
Class.catapultSnowdread = { // mega-sniper
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Catapult",
	UPGRADE_TOOLTIP: "Mega-Snipers",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.catapultSnowdread.GUNS.push(
		...addHeavySniper({length: 22, width: 9, angle: 90*i}, -2.5, [g.basic, g.sniper, g.predator, g.predator, g.predator, {speed: 0.93, maxSpeed: 0.93, reload: 1.333, size: 2}])
	)
}
Class.dartSnowdread = { // railgun
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Dart",
	UPGRADE_TOOLTIP: "Railguns",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.dartSnowdread.GUNS.push(
		...addRailgun({length: 25, width: 4, x: 7, angle: 90*i}, -2.5, [g.basic, g.sniper, g.sniper, g.sniper, g.pounder, {reload: 1.5}])
	)
}
Class.mediatorSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Mediator",
	UPGRADE_TOOLTIP: "Twins",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.mediatorSnowdread.GUNS.push(
		...addNormal({length: 15, width: 7, y: 4.25, angle: 90*i}, 5, [g.basic, g.twin, {reload: 0.85}]),
		...addNormal({length: 15, width: 7, y: -4.25, angle: 90*i, delay: 0.5}, 5, [g.basic, g.twin, {reload: 0.85}]),
	)
}
Class.negotiatorSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Negotiator",
	UPGRADE_TOOLTIP: "Machine Guns",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.negotiatorSnowdread.GUNS.push(
		...addNormal({length: 9, width: 8, aspect: 1.4, x: 6, angle: 90*i}, 5, [g.basic, g.machineGun, {size: 0.8, health: 1.3}]),
	)
}
Class.melderAutoSnowdread = {
	PARENT: 'autoTankGun',
	GUNS: [
		{
			POSITION: [18, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, {reload: 1.1}, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
			},
		}, { // Main gun
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, {reload: 1.1}]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 },
			},
		}, {
			POSITION: [18.5, 6.5, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, {reload: 1.1}, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.5 },
				BORDERLESS: true,
			},
		}, {
			POSITION: [14.5, 2, 1, 0, 5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, {reload: 1.1}, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		}, {
			POSITION: [14.5, 2, 1, 0, -5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, {reload: 1.1}, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		},
	],
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [8, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.melderSnowdread = { // all auto
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Melder",
	UPGRADE_TOOLTIP: "All Autos",
	TURRETS: [],
}
for(let i = 0; i < 4; i++) {
	Class.melderSnowdread.TURRETS.push(
		{
			POSITION: [10, 9, 0, 90*i, 195, 0],
			TYPE: 'melderAutoSnowdread',
		},
	)
	}
Class.crackerSnowdread = { // ultra bullet spam
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Cracker",
	UPGRADE_TOOLTIP: "Miniguns",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.crackerSnowdread.GUNS.push(
		...addSpam({length: 19, width: 8, angle: 90*i}, -10, [g.basic, g.minigun, {reload: 0.85}]),
		...addSpam({length: 17, width: 8, angle: 90*i, delay: 1/3}, -10, [g.basic, g.minigun, {reload: 0.85}]),
		...addSpam({length: 15, width: 8, angle: 90*i, delay: 2/3}, -10, [g.basic, g.minigun, {reload: 0.85}]),
	)
}
Class.grabberTurretSnowdread = {
	PARENT: ["spamAutoTurret"],
	GUNS: [
		{
			POSITION: [17, 14, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: -7.5}
			},
		}, {
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.autoTurret, {recoil: 0.2}]),
				TYPE: "bullet",
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6}
			},
		}, {
			POSITION: [14, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.flankGuard, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}
			},
		},
	],
};
Class.grabberSnowdread = { // crowbar
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Grabber",
	UPGRADE_TOOLTIP: "Crowbars",
	GUNS: [],
	TURRETS: [],
}
for(let i = 0; i < 4; i++) {
	Class.grabberSnowdread.GUNS.push(
		...addCrowbar({x: 8, angle: 90*i}, -2.5)
	)
	Class.grabberSnowdread.TURRETS.push(
		{
			POSITION: [6.5, 38, 0, 90*i, 200, 1],
			TYPE: 'grabberTurretSnowdread',
		},
		{
			POSITION: [6.5, 28, 0, 90*i, 200, 1],
			TYPE: 'grabberTurretSnowdread',
		},
	)
}
Class.enforcerSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Enforcer",
	UPGRADE_TOOLTIP: "Heavy Bullets",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.enforcerSnowdread.GUNS.push(
		...addHeavy({length: 17, width: 9, angle: 90*i}, 2.5, [g.basic, g.pounder, {reload: 0.9}])
	)
}
Class.executorSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Executor",
	UPGRADE_TOOLTIP: "Launchers",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.executorSnowdread.GUNS.push(
		...addLauncher({length: 17, width: 9, angle: 90*i}, -5, [g.basic, g.pounder, g.artillery, {speed: 0.5, maxSpeed: 0.4, reload: 0.8}])
	)
}
Class.doserSnowdread = { // shotgun
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Doser",
	UPGRADE_TOOLTIP: "Shotguns",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.doserSnowdread.GUNS.push(
		...addShotgun({length: 21, width: 12, x: 6, angle: 90*i}, -2.5, [
			{l: 15, w: 3, y: -3},
			{l: 14, w: 3, y: 3},
			{l: 17, w: 4, y: 0},
			{l: 13, w: 4, y: -1},
			{l: 12, w: 4, y: 1},
		], [g.basic, g.machineGun, g.shotgun, {health: 1.5, damage: 1.5}]),
	)
}
Class.swirlMissileSnowdread = {
	PARENT: 'spinmissile',
	GUNS: [
		{
			POSITION: [14, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				AUTOFIRE: !0,
				SHOOT_SETTINGS: combineStats([g.basic, g.skimmer, {speed: 1.3, maxSpeed: 1.3}]),
				TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
				STAT_CALCULATOR: gunCalcNames.thruster,
			},
		}, {
			POSITION: [14, 8, 1, 0, 0, 180, 0],
			PROPERTIES: {
				AUTOFIRE: !0,
				SHOOT_SETTINGS: combineStats([g.basic, g.skimmer, {speed: 1.3, maxSpeed: 1.3}]),
				TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
				STAT_CALCULATOR: gunCalcNames.thruster,
			},
		},
	],
}
Class.swirlSnowdread = { // twister
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Swirl",
	UPGRADE_TOOLTIP: "Twisters",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.swirlSnowdread.GUNS.push(
		...addTwister({length: 17, width: 10, angle: 90*i}, -5, [g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {speed: 1.3, maxSpeed: 1.3, reload: 1.333}], "swirlMissileSnowdread")
	)
}
Class.pelterSnowdread = { // artillery
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Pelter",
	UPGRADE_TOOLTIP: "Artillery",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.pelterSnowdread.GUNS.push(
		...addGunner({length: 15, width: 3, y: -3.5, angle: 90*i-7, delay: 0.25}, -2.5, [g.basic, g.pelleter, g.artillery, {health: 1.1}]),
		...addGunner({length: 15, width: 3, y: 3.5, angle: 90*i+7, delay: 0.75}, -2.5, [g.basic, g.pelleter, g.artillery, {health: 1.1}]),
		...addHeavy({length: 17, width: 8, angle: 90*i}, 2.5, [g.basic, g.pounder, g.artillery, {health: 1.1}]),
	)
}
Class.inquisitorSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Inquisitor",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.inquisitorSnowdread.GUNS.push(
		...addDrone({length: 5, width: 11, aspect: 1.1, x: 8, angle: 90*i}, -7.5, [g.drone, g.overseer, g.overseer, {size: 1.5, reload: 0.6}], 3)
	)
}
Class.assailantMinionTopSnowdread = {
	SHAPE: "M 0.5 0 L 1 1 L 0 0.5 L -1 1 L -0.5 0 L -1 -1 L 0 -0.5 L 1 -1 L 0.5 0",
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.75},
	MIRROR_MASTER_ANGLE: true,
}
Class.assailantMinionSnowdread = {
	PARENT: ["minion"],
	BODY: { SPEED: 0.5 },
	SHAPE: 4,
	COLOR: 13,
	GUNS: [],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["square", {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "assailantMinionTopSnowdread"
		}
	]
}
for (let i = 0; i < 4; i++) {
	Class.assailantMinionSnowdread.GUNS.push(
		...addGunner({length: 15, width: 7.5, angle: 90*i}, -5, [g.basic, g.assassin, g.minionGun])
	)
}
Class.assailantSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Assailant",
	UPGRADE_TOOLTIP: "Minions",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.assailantSnowdread.GUNS.push(
		...addMinion({length: 12, gap: 3, width: 11, angle: 90*i}, -2.5, [g.factory, {size: 0.9, reload: 0.5}])
	)
}
Class.radiationSnowdread = { // auto-drones
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Radiation",
	UPGRADE_TOOLTIP: "Auto-Drones",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.radiationSnowdread.GUNS.push(
		...addAutoDrone({length: 6, width: 10, angle: 90*i}, -5, [g.drone, g.overseer, {reload: 0.8}], 3)
	)
};
Class.boxerSnowdread = { // honcho
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Boxer",
	UPGRADE_TOOLTIP: "Heavy Drones",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.boxerSnowdread.GUNS.push(
		...addHoncho({length: 5, width: 11, aspect: 1.5, x: 8, angle: 90*i}, -5, [g.drone, g.overseer, g.overseer, g.honcho], i % 2 + 1)
	)
};
Class.disablerSnowdread = { // swarms
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Disabler",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.disablerSnowdread.GUNS.push(
		...addSwarm({length: 7, width: 7, x: 6, y: 3.5, angle: 90*i}, -5, [g.swarm, g.overseer, g.overseer, {reload: 1.5}]),
		...addSwarm({length: 7, width: 7, x: 6, y: -3.5, angle: 90*i, delay: 0.5}, -5, [g.swarm, g.overseer, g.overseer, {reload: 1.5}]),
	)
};
Class.daemonSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Daemon",
	UPGRADE_TOOLTIP: "Trap Spam",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.daemonSnowdread.GUNS.push(
		...addTrap({length: 11, length2: 2, width: 4.5, aspect: 1.7, y: 4.5, angle: 90*i}, 5, [g.trap, g.twin, {health: 2}]),
		...addTrap({length: 11, length2: 2, width: 4.5, aspect: 1.7, y: -4.5, angle: 90*i}, 5, [g.trap, g.twin, {health: 2}]),
	)
}
Class.minotaurSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Minotaur",
	UPGRADE_TOOLTIP: "Blocks",
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.minotaurSnowdread.GUNS.push(
		...addTrap({length: 13, length2: 3.75, width: 7, aspect: 1.75, angle: 90*i}, 0, [g.trap, g.setTrap, {health: 2}], true),
	)
}
Class.cleanerSnowdread = { // auto-traps
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Cleaner",
	UPGRADE_TOOLTIP: "Auto-Traps",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.cleanerSnowdread.GUNS.push(
		...addAutoTrap({length: 15, width: 6, aspect: 1.7, angle: 90*i}, -5, [g.trap, {health: 1.2, reload: 1.15, speed: 0.8}], 7)
	)
}
Class.auraTrapAura = addAura(1/3, 2, 0.15, 0, "Small");
Class.auraTrap = makeAuto(Class.trap, "", {type: 'auraTrapAura'});
Class.shadeSnowdread = { // aura-traps
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Shade",
	UPGRADE_TOOLTIP: "Aura-Traps",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.shadeSnowdread.GUNS.push(
		...addAuraTrap({length: 14, length2: 3, width: 7, aspect: 1.6, angle: 90*i}, -5, [g.trap, g.hexaTrapper, {range: 0.8, health: 1.2}])
	)
}
Class.screwdriverSnowdread = { // trap + gun
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Screwdriver",
	UPGRADE_TOOLTIP: "Traps + Bullets",
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.screwdriverSnowdread.GUNS.push(
		...addNormal({length: 19, width: 7, angle: 90*i}, 0, [g.basic, g.flankGuard]),
		...addTrap({length: 13, length2: 3.75, width: 7, aspect: 1.75, angle: 90*i}, 1.5, [g.trap, g.hexaTrapper]),
	)
}

// T2 Bodies
Class.automationSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Automation",
	UPGRADE_TOOLTIP: "Small Auto Turrets",
	TURRETS: [
		{
			POSITION: [11, 0, 0, 0, 0, 1],
			TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [8, 0, 0, 0, 0, 1],
			TYPE: ["square", {MIRROR_MASTER_ANGLE: true, BORDERLESS: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 15}}],
		},
	],
}
for (let i = 0; i < 4; i++) {
	Class.automationSnowdread.TURRETS.push(
		{
			POSITION: [4, 9, 0, 90*i+45, 200, 1],
			TYPE: "spamAutoTurret",
		},
	)
}
Class.kilobyteTurretSnowdread = {
	PARENT: ["genericTank"],
	CONTROLLERS: ["nearestDifferentMaster"],
	INDEPENDENT: true,
	COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.65 },
	GUNS: [
		{
			POSITION: [21, 12, -1.4, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
			},
		}, { // Main gun
			POSITION: [26, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.autoTurret, {health: 1.2, speed: 0.8}]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.65 },
			},
		}, {
			POSITION: [21.5, 6.5, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.75 },
				BORDERLESS: true,
			},
		}, {
			POSITION: [16.5, 2, -1.35, 0, 5.1, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		}, {
			POSITION: [16.5, 2, -1.35, 0, -5.1, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.assassin, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		}, {
			POSITION: [10, 8, 0.5, 0, 0, 73, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 8, 0.5, 0, 0, -73, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 8, 0.5, 0, 0, 180, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}
	],
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [8, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.kilobyteSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Kilobyte",
	UPGRADE_TOOLTIP: "Heavy Auto Turret",
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "kilobyteTurretSnowdread",
		},
	],
}
Class.lighterTurretSnowdread = {
	PARENT: 'genericTank',
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -12.5},
	BODY: {FOV: 5},
	CONTROLLERS: ['nearestDifferentMaster'],
	INDEPENDENT: true,
	GUNS: [
		{
			POSITION: [15, 11, 1, 0, 0, 180, 0],
			PROPERTIES: {COLOR: 13},
		}, {
			POSITION: [16.5, 7, 1, 0, 0, 180, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}},
		}, {
			POSITION: [14, 2, 1, 0, 7, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
		}, {
			POSITION: [14, 2, 1, 0, -7, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
		}, {
			POSITION: [22, 7, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.flame]),
				TYPE: 'growBullet',
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5},
			}
		}, {
			POSITION: [13, 8, -1.3, 0, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
		},
	],
	TURRETS: [
		{
			POSITION: [13.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 } }],
		}, {
			POSITION: [9, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
};
Class.lighterSnowdread = { // Flamethrower
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Lighter",
	UPGRADE_TOOLTIP: "Flamethrower",
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [9, 0, 0, 0, 360, 1],
			TYPE: 'lighterTurretSnowdread',
		}
	],
}
Class.stormTurretSnowdread = {
	PARENT: 'genericTank',
	LABEL: "",
	BODY: { FOV: 1.5 },
	CONTROLLERS: [[ 'spin', {speed: 0.03}]],
	COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5},
	INDEPENDENT: true,
	MAX_CHILDREN: 6,
	GUNS: [
		...addDroneOnAuto({length: 6, width: 12, x: 8, angle: 90}, 5, [g.drone, {size: 1.2}]),
		...addDroneOnAuto({length: 6, width: 12, x: 8, angle: -90}, 5, [g.drone, {size: 1.2}]),
	],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 } }],
		}, {
			POSITION: [8.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
};
Class.stormSnowdread = { // Drones
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Storm",
	UPGRADE_TOOLTIP: "Drone Turret",
	BODY: {
		SPEED: 0.93,
		FOV: 1.1,
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: 'stormTurretSnowdread',
		}
	],
}
Class.coronaAuraSnowdread = addAura(1.5, 0.8, 0.15);
Class.coronaSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Corona",
	UPGRADE_TOOLTIP: "Damage Aura",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: "coronaAuraSnowdread",
		},
	],
}
Class.thermosphereAuraSnowdread = addAura(-1, 1.5);
Class.thermosphereSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Thermosphere",
	UPGRADE_TOOLTIP: "Healing Aura",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["square", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: "thermosphereAuraSnowdread",
		},
	],
}
Class.octogon = { SHAPE: 8 }
Class.jumboSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Jumbo",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: hpBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: 9}]
		}, {
			POSITION: [7, 0, 0, 0, 0, 1],
			TYPE: ['octogon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 10}, BORDERLESS: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [24, 0, 0, 0, 0, -1],
			TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		},
	],
}
Class.colossusTopSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.colossusTopSnowdread.GUNS.push(
		{
			POSITION: [3.5, 17.5, 0.001, 9, 0, 90*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [2.5, 9, 0, 7, 0, 90*i, 0],
			PROPERTIES: {COLOR: 9, DRAW_ABOVE: true},
		},
	)
}
Class.colossusBottomSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	GUNS: [],
}
for (let i = 0; i < 4; i++) {
	Class.colossusTopSnowdread.GUNS.push(
		{
			POSITION: [3.5, 17.5, 0.001, 9, 0, 90*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
for (let i = 0; i < 4; i++) {
	Class.colossusBottomSnowdread.GUNS.push(
		{
			POSITION: [4, 17.5, 0.001, 9, 0, 90*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.colossusSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "colossus",
	UPGRADE_TOOLTIP: "Speed Buff",
	BODY: speedBuffBodyStats[0],
	GUNS: [],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ['colossusTopSnowdread', {MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ['colossusBottomSnowdread', {MIRROR_MASTER_ANGLE: true}]
		},
	],
}
Class.cottonTurretSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	SHAPE: [[1, 0], [0, 1], [-1, 0], [0, -1]],
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.cottonTurretSnowdread.GUNS.push(
		{
			POSITION: [25, 16, 0.001, 0, 0, 90*i+45, 0],
			PROPERTIES: {COLOR: 9}
		},
	)
}
for(let i = 0; i < 4; i++) { // layering issues
	Class.cottonTurretSnowdread.GUNS.push(
		{
			POSITION: [25 * 3/4, 12, 0.001, 0, 0, 90*i+45, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
		},
	)
}
Class.cottonSnowdread = { // Drifter
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Cotton",
	UPGRADE_TOOLTIP: "Icy Movement",
	BODY: {
		SPEED: 1.9,
		ACCELERATION: 0.25,
	},
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: 'cottonTurretSnowdread',
		}
	],
}
Class.ironTopSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	SHAPE: 0,
	MIRROR_MASTER_ANGLE: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: [],
}
for(let i = 0; i < 8; i++) {
	Class.ironTopSnowdread.GUNS.push(
		{
			POSITION: [8, 6, 0.001, 20, 0, 45*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [8, 6, 0.001, -20, 0, 45*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.ironBottomSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.ironBottomSnowdread.GUNS.push(
		{
			POSITION: [6, 6, 0.001, 9.5, 5, 90*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [6, 6, 0.001, 9.5, -5, 90*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.ironSnowdread = { // Body damage increase
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Iron",
	UPGRADE_TOOLTIP: "Body Damage Buff",
	BODY: {
		DAMAGE: 2,
		PENETRATION: 1.6,
	},
	GUNS: [],
	TURRETS: [
		{
			POSITION: [5.5, 0, 0, 0, 0, 1],
			TYPE: 'ironTopSnowdread',
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: 'ironBottomSnowdread',
		},
	],
}
Class.rollerTurretSnowdread = {
	PARENT: ["genericSquarenoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 4; i++) {
	Class.rollerTurretSnowdread.GUNS.push(
		{
			POSITION: [20, 20, 0, 0, 0, 90*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [15, 15, 0, 2.5, 0, 90*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 7.5}, BORDERLESS: true},
		},
	)
}
Class.rollerSnowdread = { // Size increase
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Roller",
	UPGRADE_TOOLTIP: "Size Increase",
	SIZE: 1.3,
	BODY: sizeBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: 'rollerTurretSnowdread',
		}, {
			POSITION: [6, 0, 0, 0, 0, 1],
			TYPE: ['square', {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -15}, MIRROR_MASTER_ANGLE: true}]
		},
	],
}
Class.owlSnowdread = { // Size decrease
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Owl",
	UPGRADE_TOOLTIP: "Size Decrease",
	SIZE: 0.85,
	BODY: {
		HEALTH: 0.8,
		SPEED: 1.1,
		ACCELERATION: 1.25,
	},
	TURRETS: [
		{
			POSITION: [11, 0, 0, 0, 0, 1],
			TYPE: ['square', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [12.5 / Math.SQRT2, 0, 0, 45, 0, 1],
			TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5}}]
		},
	],
}
Class.baiterTurretSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [["spin", {speed: -0.035}]],
	INDEPENDENT: true,
	LABEL: "",
	COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5},
	GUNS: [
		{ 
			POSITION: [11, 23, 1, -5.5, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5}}
		}, {
			POSITION: [11, 23, 1, -5.5, 0, 90, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5}}
		}, { 
			POSITION: [7, 28, 1, -3.5, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 6}}
		}, {
			POSITION: [7, 28, 1, -3.5, 0, 90, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 6}}
		},
	],
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.45 } }],
		}, {
			POSITION: [7.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.baiterSnowdread = { // Minelayer
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Baiter",
	UPGRADE_TOOLTIP: "Trap Setter",
	GUNS: [
		{
			POSITION: [0, 12, 1, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, {health: 1.3, recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
				TYPE: 'trap',
				STAT_CALCULATOR: gunCalcNames.trap,
			},
		}
	],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [11, 0, 0, 0, 360, 1],
			TYPE: 'baiterTurretSnowdread'
		},
	],
}
Class.spyRadarSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [['spin', {speed: 0.02}]],
	INDEPENDENT: true,
	SHAPE: [[0.2, 1], [0.2, -1], [-0.2, -1], [-0.2, 1]],
	COLOR: 17,
	GUNS: [
		{
			POSITION: [4, 26, 1, -2, 0, 0, 0],
			PROPERTIES: {COLOR: 13}
		}, {
			POSITION: [7, 17, 1, -3.5, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -17.5}}
		}
	]
}
Class.spySnowdread = { // FOV
	PARENT: ["genericSquarenoughtSnowdread"],
	LABEL: "Spy",
	UPGRADE_TOOLTIP: "FOV Boost",
	BODY: {
		FOV: 1.2,
		SPEED: 0.95,
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ['square', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["squareBaseDeco"],
		}, {
			POSITION: [10.5, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 15}, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [7.5, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: 13, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [15, 0, 0, 0, 360, 1],
			TYPE: 'spyRadarSnowdread',
		}
	],
}

// T3 Weapons
Class.bayonetSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Bayonet",
	UPGRADE_TOOLTIP: "Assassins",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.bayonetSnowdread.GUNS.push(
		...addAssassin({length: 28, width: 7, x: 7, angle: 120*i}, 2.5, [g.basic, g.sniper, g.assassin, g.assassin, g.assassin, {reload: 0.8, density: 0.4}])
	)
}
Class.bladeSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Blade",
	UPGRADE_TOOLTIP: "Muskets",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.bladeSnowdread.GUNS.push(
		...addRifle({length: 18, width: 5, angle: 120*i}, -5, [g.basic, g.sniper, g.rifle, g.twin, {speed: 0.8, health: 1.5}], true)
	)
}
Class.atlatlSnowdread = { // hunter
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Atlatl",
	UPGRADE_TOOLTIP: "X-Hunters",
	CONTROLLERS: [["zoom", { distance: 500 }]],
	TOOLTIP: "Hold right click to zoom.",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.atlatlSnowdread.GUNS.push(
		...addHunter({length: 18, width: 9, dimensionDifference: 3, angle: 120*i}, 0, [g.basic, g.sniper, g.assassin, g.hunter, {health: 1.1}]),
		{
			POSITION: [5, 9, -1.6, 6, 0, 120*i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 } },
		}, {
			POSITION: [5, 7.5, -1.6, 4.5, 0, 120*i, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
		},
	)
}
Class.ballistaSnowdread = { // mega-sniper
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Ballista",
	UPGRADE_TOOLTIP: "Mega-Snipers",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.ballistaSnowdread.GUNS.push(
		...addHeavySniper({length: 22, width: 11, angle: 120*i}, -2.5, [g.basic, g.sniper, g.predator, g.predator, g.predator, {speed: 0.93, maxSpeed: 0.93, reload: 1.7, health: 1.2, size: 2}])
	)
}
Class.barbSnowdread = { // railgun
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Barb",
	UPGRADE_TOOLTIP: "Railguns",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.barbSnowdread.GUNS.push(
		...addRailgun({length: 26.5, width: 4, x: 7, angle: 120*i}, 0, [g.basic, g.sniper, g.sniper, g.sniper, g.pounder, {reload: 1.5, damage: 1.2}])
	)
}
Class.mitigatorSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Mitigator",
	UPGRADE_TOOLTIP: "Twins",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.mitigatorSnowdread.GUNS.push(
		...addNormal({length: 10, width: 8, x: 3, y: 5, angle: 120*i}, 5, [g.basic, {reload: 0.85}]),
		...addNormal({length: 10, width: 8, x: 3, y: -5, angle: 120*i, delay: 0.5}, 5, [g.basic, {reload: 0.85}]),
	)
}
Class.appeaserSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Appeaser",
	UPGRADE_TOOLTIP: "Machine Guns",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.appeaserSnowdread.GUNS.push(
		...addNormal({length: 7, width: 11, aspect: 1.35, x: 6, angle: 120*i}, 5, [g.basic, g.machineGun, {size: 0.8}], false),
		...addNormal({length: 7, width: 10, aspect: 1.3, x: 8, angle: 120*i}, 5, [g.basic, g.machineGun, {size: 0.8, reload: 0.9}]),
	)
}
Class.amalgamAutoSnowdread = {
	PARENT: 'autoTankGun',
	BODY: {FOV: 2},
	GUNS: [
		...addGunner({length: 16, width: 4, y: -3.5, delay: 0.5}, 0, [g.basic, g.autoTurret, g.pelleter, g.power, g.twin, g.tripleShot]),
		...addGunner({length: 16, width: 4, y: 3.5, delay: 0.5}, 0, [g.basic, g.autoTurret, g.pelleter, g.power, g.twin, g.tripleShot]),
		...addGunner({length: 18, width: 4, delay: 0}, 0, [g.basic, g.autoTurret, g.pelleter, g.power, g.twin, g.tripleShot]),
		{
			POSITION: [7, 11, -1.3, 5, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 } },
		}, {
			POSITION: [7, 11 - 1.5, -1.3, 3.5, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
		},
	],
	TURRETS: [
		{
			POSITION: [15.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [9.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.amalgamSnowdread = { // all auto
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Amalgam",
	UPGRADE_TOOLTIP: "All Autos",
	TOOLTIP: "Reverse tank to focus more fire.",
	TURRETS: [],
}
for(let i = 0; i < 3; i++) {
	Class.amalgamSnowdread.TURRETS.push(
		{
			POSITION: [11, 7, 0, 120*i, 190, 0],
			TYPE: 'amalgamAutoSnowdread',
		},
	)
};
Class.breakerSnowdread = { // ultra bullet spam
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Breaker",
	UPGRADE_TOOLTIP: "Nailguns",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.breakerSnowdread.GUNS.push(
		...addGunner({length: 19, width: 2.75, y: -3, angle: 120*i, delay: 1/3}, 0, [g.basic, g.pelleter, g.power, g.nailgun, {speed: 1.05, maxSpeed: 1.05}]),
		...addGunner({length: 19, width: 2.75, y: 3, angle: 120*i, delay: 2/3}, 0, [g.basic, g.pelleter, g.power, g.nailgun, {speed: 1.05, maxSpeed: 1.05}]),
		...addGunner({length: 21.5, width: 3.25, y: 0, angle: 120*i}, 0, [g.basic, g.pelleter, g.power, g.nailgun, {speed: 1.05, maxSpeed: 1.05, size: 2.75/3.25}]),
		{
			POSITION: [10, 8.5, 0.6, 5, 0, 120*i, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
		}, {
			POSITION: [5.5, 9, -1.8, 6.5, 0, 120*i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -20, SATURATION_SHIFT: 0.5 }, },
		}, {
			POSITION: [5.5, 7.5, -1.8, 5, 0, 120*i, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
		},
	)
}
Class.clasperTurretSnowdread = {
	PARENT: ["spamAutoTurret"],
	INDEPENDENT: true,
	GUNS: [
		{
			POSITION: [14, 15, -1.2, 0, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
		},
		...addGunner({length: 16, width: 4, y: -4}, 0, [g.basic, g.autoTurret, g.pelleter, g.twin, g.power, g.flankGuard, g.flankGuard, {speed: 0.7, maxSpeed: 0.7, recoil: 0.25}]),
		...addGunner({length: 16, width: 4, y: 4, delay: 0.5}, 0, [g.basic, g.autoTurret, g.pelleter, g.twin, g.power, g.flankGuard, g.flankGuard, {speed: 0.7, maxSpeed: 0.7, recoil: 0.25}]),
	],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: -1}],
		},
	],
};
Class.clasperSnowdread = { // crowbar
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Clasper",
	UPGRADE_TOOLTIP: "Crowbars",
	GUNS: [],
	TURRETS: [],
}
for(let i = 0; i < 3; i++) {
	Class.clasperSnowdread.GUNS.push(
		...addCrowbar({length: 38, width: 6.5, aspect: -1.5, x: 8, angle: 120*i}, 0)
	)
	Class.clasperSnowdread.TURRETS.push(
		{
			POSITION: [6.5, 38, 0, 120*i, 200, 1],
			TYPE: 'clasperTurretSnowdread'
		}, {
			POSITION: [6.5, 28, 0, 120*i, 200, 1],
			TYPE: 'clasperTurretSnowdread'
		}, {
			POSITION: [6.5, 18, 0, 120*i, 200, 1],
			TYPE: 'clasperTurretSnowdread'
		},
	)
}
Class.suppressorSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Suppressor",
	UPGRADE_TOOLTIP: "Destroyers",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.suppressorSnowdread.GUNS.push(
		...addHeavy({length: 16.5, width: 11.5, angle: 120*i}, 0, [g.basic, g.pounder, g.destroyer, {reload: 0.85}])
	)
}
Class.inhibitorSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Inhibitor",
	UPGRADE_TOOLTIP: "Skimmers",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.inhibitorSnowdread.GUNS.push(
		...addLauncher({length: 15, width: 15, angle: 120*i}, -5, [g.basic, g.pounder, g.artillery, g.skimmer, {reload: 1.5}], true, "superMissileSnowdread")
	)
}
Class.tranquilizerSnowdread = { // shotgun
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Tranquilizer",
	UPGRADE_TOOLTIP: "Shotguns",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.tranquilizerSnowdread.GUNS.push(
		...addShotgun({length: 21, width: 14, x: 5, angle: 120*i}, 0, [
			{l: 15, w: 3, y: -3},
			{l: 15, w: 3, y: 3},
			{l: 17, w: 4, y: 0},
			{l: 13, w: 4, y: -1},
			{l: 12, w: 5, y: 1},
			{l: 12, w: 5, y: 0},
		], [g.basic, g.machineGun, g.shotgun, {health: 1.5, damage: 1.5}]),
	)
}
Class.spiralMissileSnowdread = {
	PARENT: 'spinmissile',
	GUNS: [
		{
			POSITION: [14, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				AUTOFIRE: !0,
				SHOOT_SETTINGS: combineStats([g.basic, g.rocketeer, {speed: 1.3, maxSpeed: 1.3}]),
				TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
				STAT_CALCULATOR: gunCalcNames.thruster,
			},
		}, {
			POSITION: [14, 8, 1, 0, 0, 180, 0],
			PROPERTIES: {
				AUTOFIRE: !0,
				SHOOT_SETTINGS: combineStats([g.basic, g.rocketeer, {speed: 1.3, maxSpeed: 1.3}]),
				TYPE: [ "bullet", { PERSISTS_AFTER_DEATH: true } ],
				STAT_CALCULATOR: gunCalcNames.thruster,
			},
		},
	],
}
Class.spiralSnowdread = { // twister
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Spiral",
	UPGRADE_TOOLTIP: "Twisters",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.spiralSnowdread.GUNS.push(
		...addTwister({length: 17, width: 11, aspect: -1.4, angle: 120*i}, -5, [g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {speed: 1.55, maxSpeed: 1.3, reload: 1.333}], "spiralMissileSnowdread")
	)
}
Class.shellerSnowdread = { // artillery
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Sheller",
	UPGRADE_TOOLTIP: "Mortars",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.shellerSnowdread.GUNS.push(
		...addGunner({length: 12.5, width: 3, y: -6.5, angle: 120*i-7, delay: 0.6}, -5, [g.basic, g.pelleter, g.artillery]),
		...addGunner({length: 12.5, width: 3, y: 6.5, angle: 120*i+7, delay: 0.8}, -5, [g.basic, g.pelleter, g.artillery]),
		...addGunner({length: 15.5, width: 3, y: -4.5, angle: 120*i-7, delay: 0.2}, -5, [g.basic, g.pelleter, g.artillery, g.twin]),
		...addGunner({length: 15.5, width: 3, y: 4.5, angle: 120*i+7, delay: 0.4}, -5, [g.basic, g.pelleter, g.artillery, g.twin]),
		...addHeavy({length: 17.5, width: 10, angle: 120*i}, -2.5, [g.basic, g.destroyer, g.artillery])
	)
}
Class.infiltratorSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Infiltrator",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.infiltratorSnowdread.GUNS.push(
		...addDrone({length: 5, width: 6, aspect: 1.4, x: 6, y: 5.5, angle: 120*i}, -2.5, [g.drone, g.overseer, g.overseer, {size: 1.5, reload: 0.6}], 2),
		...addDrone({length: 5, width: 6, aspect: 1.4, x: 6, y: -5.5, angle: 120*i}, -2.5, [g.drone, g.overseer, g.overseer, {size: 1.5, reload: 0.6}], 2),
		...addDrone({length: 5, width: 6, aspect: 1.4, x: 8, angle: 120*i}, -2.5, [g.drone, g.overseer, g.overseer, g.pounder, {size: 2, reload: 0.4}], 2, "betadrone"),
	)
}
Class.aggressorMinionTopSnowdread = {
	SHAPE: "M -1.546 -0.108 L -1.546 0.108 L -0.175 0.303 L 0.679 1.393 L 0.867 1.285 L 0.35 0 L 0.867 -1.285 L 0.679 -1.393 L -0.175 -0.303 L -1.546 -0.108",
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
	MIRROR_MASTER_ANGLE: true,
}
Class.aggressorMinionSnowdread = {
	PARENT: ["minion"],
	SHAPE: 3.5,
	COLOR: 2,
	BODY: { SPEED: 0.8, },
	GUNS: [],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "aggressorMinionTopSnowdread"
		}
	]
}
for (let i = 0; i < 3; i++) {
	Class.aggressorMinionSnowdread.GUNS.push(
		...addGunner({length: 16, width: 8.5, angle: 120*i}, -2.5, [g.basic, g.sniper, g.assassin, g.minionGun, {speed: 0.93, maxSpeed: 0.93}])
	)
}
Class.aggressorSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Aggressor",
	UPGRADE_TOOLTIP: "Minions",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.aggressorSnowdread.GUNS.push(
		...addMinion({length: 12, gap: 3, width: 13, angle: 120*i}, 0, [g.factory, {size: 0.9, reload: 0.5}], "aggressorMinionSnowdread", 2)
	)
}
Class.haloSnowdread = { // auto-drones
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Halo",
	UPGRADE_TOOLTIP: "Auto-Drones",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.haloSnowdread.GUNS.push(
		...addAutoDrone({length: 5, width: 14.5, aspect: 1.2, x: 8, angle: 120*i}, 0, [g.drone, g.overseer, {reload: 1.2, size: 0.8, speed: 1.15, maxSpeed: 1.15}], 4)
	)
}
Class.sluggerSnowdread = { // honcho
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Slugger",
	UPGRADE_TOOLTIP: "Heavy Drones",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.sluggerSnowdread.GUNS.push(
		...addHoncho({length: 5, width: 13, aspect: 1.5, x: 8, angle: 120*i}, 0, [g.drone, g.overseer, g.honcho, {maxSpeed: 0.9, size: 0.75}], 2)
	)
};
Class.debilitatorSnowdread = { // swarms
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Debilitator",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.debilitatorSnowdread.GUNS.push(
		...addSwarm({length: 6, width: 9, aspect: 0.6, x: 6, y: 5, angle: 120*i}, 0, [g.swarm, g.flankGuard, {reload: 1.3}]),
		...addSwarm({length: 6, width: 9, aspect: 0.6, x: 6, y: -5, angle: 120*i, delay: 0.5}, 0, [g.swarm, g.flankGuard, {reload: 1.3}]),
		{
			POSITION: [2, 15, 0.85, 8, 0, 120*i, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
		},
	)
};
Class.hydraSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Hydra",
	UPGRADE_TOOLTIP: "Trap Spam",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.hydraSnowdread.GUNS.push(
		...addTrap({length: 6, length2: 2, width: 3.5, aspect: 1.8, x: 4, y: 8.5, angle: 120*i, delay: 2/3}, 0, [g.trap, g.twin, g.pounder, {speed: 1.2}]),
		...addTrap({length: 6, length2: 2, width: 3.5, aspect: 1.8, x: 4, y: -8.5, angle: 120*i, delay: 1/3}, 0, [g.trap, g.twin, g.pounder, {speed: 1.2}]),
		...addTrap({length: 12, length2: 2.5, width: 5, aspect: 1.7, angle: 120*i}, 0, [g.trap, g.setTrap, g.twin, g.pounder, {speed: 1.2, reload: 1/1.1}], true),
	)
}
Class.beelzebubSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Beelzebub",
	UPGRADE_TOOLTIP: "Blocks",
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.beelzebubSnowdread.GUNS.push(
		...addTrap({length: 13, length2: 3.5, width: 10, aspect: 1.6, angle: 120*i}, 0, [g.trap, g.setTrap, g.pounder, {speed: 1.3, maxSpeed: 1.3, size: 1.2, health: 2}], true)
	)
}
Class.sweeperSnowdread = { // auto-traps
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Sweeper",
	UPGRADE_TOOLTIP: "Auto-Boxes",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.sweeperSnowdread.GUNS.push(
		...addAutoTrap({length: 15.5, length2: 2, width: 15, aspect: 1.3, angle: 120*i}, -2.5, [g.trap, g.setTrap, {reload: 2.5}], 4, true)
	)
}
Class.auraBlockAura = addAura(1/3, 1.6, 0.15, 0, "Small");
Class.auraBlock = {
	PARENT: 'unsetTrap',
	TURRETS: [
		{
			POSITION: [20, 0, 0, 45, 0, 1],
			TYPE: 'unsetPillboxTopSnowdread'
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: 'auraBlockAura'
		}
	]
}
Class.aegisSnowdread = { // aura-traps
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Aegis",
	UPGRADE_TOOLTIP: "Aura-Boxes",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.aegisSnowdread.GUNS.push(
		...addAuraTrap({length: 14, length2: 3, width: 10, aspect: 1.6, angle: 120*i}, 0, [g.trap, g.setTrap, g.hexaTrapper, {reload: 2, range: 0.8, health: 2.4}], true)
	)
}
Class.drillSnowdread = { // trap + gun
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Drill",
	UPGRADE_TOOLTIP: "Blocks + Bullets",
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.drillSnowdread.GUNS.push(
		...addNormal({length: 20, width: 9, angle: 120*i}, 0, [g.basic, g.flankGuard]),
		...addTrap({length: 13.5, length2: 3, width: 11, aspect: 1.4, angle: 120*i}, 0, [g.trap, g.setTrap, g.hexaTrapper], true)
	)
}

// T3 Bodies
Class.mechanismSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Mechanism",
	UPGRADE_TOOLTIP: "Small Auto Spam",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
	],
}
for (let i = 0; i < 3; i++) {
	Class.mechanismSnowdread.TURRETS.push(
		{
			POSITION: [3.5, 6, 0, 120*i, 200, 1],
			TYPE: "spamAutoTurret",
		}, {
			POSITION: [3.5, 10, 0, 120*i+60, 200, 1],
			TYPE: "spamAutoTurret",
		},
	)
}
Class.trinoughtBigAura = addAura(2, 1.5);
Class.fusionSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Fusion",
	UPGRADE_TOOLTIP: "Damage Aura + Small Autos",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtTurretRing(),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "trinoughtBigAura",
		},
	],
}
Class.binarySnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Binary",
	UPGRADE_TOOLTIP: "Heavy Auto + Small Autos",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtTurretRing(),
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "kilobyteTurretSnowdread",
		},
	],
}
Class.trinoughtBigHealAura = addAura(-1.5, 1.5);
Class.exosphereSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Exosphere",
	UPGRADE_TOOLTIP: "Healing Aura + Small Autos",
	TURRETS: [
		{
			POSITION: [15, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtTurretRing(),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "trinoughtBigHealAura",
		},
	],
}
Class.megabyteTurretSnowdread = {
	PARENT: ["autoTankGun"],
	COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.65 },
	INDEPENDENT: true,
	GUNS: [
		{
			POSITION: [21, 14.5, -1.4, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
			},
		}, { // Main gun
			POSITION: [26, 13, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.autoTurret, {health: 1.2, speed: 0.8}]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.65 },
			},
		}, {
			POSITION: [21.5, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.75 },
				BORDERLESS: true,
			},
		}, {
			POSITION: [16.5, 2.6, -1.6, 0, 6.1, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		}, {
			POSITION: [16.5, 2.6, -1.6, 0, -6.1, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pounder, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 },
			},
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, 55, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, -55, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, 135, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, -135, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}
	],
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [8.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.megabyteSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Megabyte",
	UPGRADE_TOOLTIP: "Heavy Auto Turret",
	TURRETS: [
		{
			POSITION: [15.5, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [12, 0, 0, 0, 360, 1],
			TYPE: "megabyteTurretSnowdread",
		},
	],
}
Class.trinoughtSmallAura = addAura(1, 2.1, 0.15, 0, "Small");
Class.trojanSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Trojan",
	UPGRADE_TOOLTIP: "Heavy Auto + Damage Auras",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(),
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "kilobyteTurretSnowdread",
		},
	],
}
Class.trinoughtSmallHealAura = addAura(-2/3, 2.1, 0.15, "red", "Small");
Class.hardwareSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Hardware",
	UPGRADE_TOOLTIP: "Heavy Auto + Healing Auras",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(true),
		{
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "kilobyteTurretSnowdread",
		},
	],
}
Class.burnerTurretSnowdread = {
	PARENT: 'genericTank',
	COLOR: -1,
	CONTROLLERS: ['nearestDifferentMaster'],
	INDEPENDENT: true,
	GUNS: [
		{
			POSITION: [15, 11, 1, 0, 0, 140, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 0.9}},
		}, {
			POSITION: [16.5, 7, 1, 0, 0, 140, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
		}, {
			POSITION: [15, 11, 1, 0, 0, -140, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 0.9}},
		}, {
			POSITION: [16.5, 7, 1, 0, 0, -140, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
		}, {
			POSITION: [16, 2, 1, 0, 7.5, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}}
		}, {
			POSITION: [16, 2, 1, 0, -7.5, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}}
		}, {
			POSITION: [24, 8, 1.25, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.flame, {speed: 1.3, maxSpeed: 1.3}]),
				TYPE: 'growBullet',
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.7},
			}
		}, {
			POSITION: [21.5, 6.5, 1.3, 0, 0, 0, 0],
			PROPERTIES: { 
				SHOOT_SETTINGS: combineStats([g.basic, g.autoTurret, g.flame, g.fake]),
				TYPE: 'bullet',
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.8}, 
				BORDERLESS: true 
			}
		}, {
			POSITION: [14, 8.5, -1.4, 0, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
		},
	],
	TURRETS: [
		{
			POSITION: [15, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 } }],
		}, {
			POSITION: [9, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
};
Class.burnerSnowdread = { // Flamethrower
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Burner",
	UPGRADE_TOOLTIP: "Flamethrower",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [9, 0, 0, 0, 360, 1],
			TYPE: 'burnerTurretSnowdread',
		}
	],
}
Class.tempestTurretSnowdread = {
	PARENT: 'genericTank',
	LABEL: "",
	BODY: { FOV: 1.5 },
	CONTROLLERS: [[ 'spin', {speed: 0.03}]],
	COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5},
	INDEPENDENT: true,
	MAX_CHILDREN: 9,
	GUNS: [],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 } }],
		}, {
			POSITION: [8.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
};
for (let i = 0; i < 3; i++) {
	Class.tempestTurretSnowdread.GUNS.push(
		...addDroneOnAuto({length: 6, width: 12, x: 8, aspect: 1.2, angle: 120*i}, 7.5, [g.drone, g.overseer, {size: 1.4}]),
	)
}
Class.tempestSnowdread = { // Drones
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Tempest",
	UPGRADE_TOOLTIP: "Drone Turret",
	BODY: {
		SPEED: 0.93,
		FOV: 1.1,
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: 'tempestTurretSnowdread',
		},
	]
}
Class.chromosphereSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Chromosphere",
	UPGRADE_TOOLTIP: "Damage Auras",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "trinoughtBigAura",
		},
	],
}
Class.mesosphereSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Mesosphere",
	UPGRADE_TOOLTIP: "Healing Auras",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(true),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "trinoughtBigHealAura",
		},
	],
}
Class.goliathSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Goliath",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: hpBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
	],
}
Class.planetSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Planet",
	UPGRADE_TOOLTIP: "Health Buff + Damage Auras",
	BODY: hpBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(),
	],
}
Class.moonSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Moon",
	UPGRADE_TOOLTIP: "Health Buff + Healing Auras",
	BODY: hpBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(true),
	],
}
Class.burgSnowdread = { // HP + auto spam
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Burg",
	UPGRADE_TOOLTIP: "Health Buff + Small Autos",
	BODY: hpBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtTurretRing(),
	],
}
Class.siloSnowdread = { // HP + big auto
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Silo",
	UPGRADE_TOOLTIP: "Health Buff + Heavy Auto",
	BODY: hpBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		},
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "kilobyteTurretSnowdread",
		},
	],
}
Class.titanTopSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	GUNS: [],
}
for (let i = 0; i < 3; i++) {
	Class.titanTopSnowdread.GUNS.push(
		{
			POSITION: [5, 26, 0.001, 8, 0, 120*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.titanSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Titan",
	UPGRADE_TOOLTIP: "Speed Buff",
	BODY: speedBuffBodyStats[1],
	GUNS: [],
	TURRETS: [
		{
			POSITION: [11, 0, 0, 0, 0, 1],
			TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
	],
}
Class.sirenSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Siren",
	UPGRADE_TOOLTIP: "Speed Buff + Damage Auras",
	BODY: speedBuffBodyStats[0],
	GUNS: [],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
		...addTrinoughtAuraRing(),
	],
}
Class.harpySnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Harpy",
	UPGRADE_TOOLTIP: "Speed Buff + Healing Auras",
	BODY: speedBuffBodyStats[0],
	GUNS: [],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
		...addTrinoughtAuraRing(true),
	],
}
Class.batonSnowdread = { // Speed + auto spam
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Baton",
	UPGRADE_TOOLTIP: "Speed Buff + Small Autos",
	BODY: speedBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
		...addTrinoughtTurretRing(),
	],
}
Class.fireworkSnowdread = { // Speed + big auto
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Firework",
	UPGRADE_TOOLTIP: "Speed Buff + Heavy Auto",
	BODY: speedBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "kilobyteTurretSnowdread",
		},
	],
}
Class.armadaSnowdread = { // Speed + HP
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Armada",
	UPGRADE_TOOLTIP: "Speed Buff + Health Buff",
	BODY: {
		HEALTH: 1.8, 
		SHIELD: 1.8, 
		REGEN: 1.4, 
		SPEED: 1.75,
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ['triangle', {COLOR: 9, MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["titanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
	],
}
Class.featherTurretSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.featherTurretSnowdread.GUNS.push(
		{
			POSITION: [20, 17, 0.001, 3, 0, 120*i, 0],
			PROPERTIES: {COLOR: 9}
		}, {
			POSITION: [15, 12, 0.001, 3, 0, 120*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
		},
	)
}
Class.featherSnowdread = { // Drifter
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Feather",
	UPGRADE_TOOLTIP: "Icy Movement",
	BODY: {
		SPEED: 2.05,
		ACCELERATION: 0.21,
	},
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: 'featherTurretSnowdread',
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}
	],
}
Class.steelTopSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	SHAPE: 0,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 9; i++) {
	Class.steelTopSnowdread.GUNS.push(
		{
			POSITION: [8, 6, 0.001, 17.5, 0, 40*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [8, 6, 0.001, -17.5, 0, 40*i+20, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.steelBottomSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.steelBottomSnowdread.GUNS.push(
		{
			POSITION: [3, 5, 0.001, 8, 7.5, 120*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [3, 5, 0.001, 8, 0, 120*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [3, 5, 0.001, 8, -7.5, 120*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.steelSnowdread = { // Body damage increase
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Steel",
	UPGRADE_TOOLTIP: "Body Damage Buff",
	BODY: {
		DAMAGE: 3,
		PENETRATION: 2.2,
	},
	GUNS: [],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [6, 0, 0, 0, 360, 1],
			TYPE: 'steelTopSnowdread'
		}, {
			POSITION: [20, 0, 0, 0, 360, -1],
			TYPE: 'steelBottomSnowdread'
		},
	],
}
Class.flattenerTurretSnowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	SHAPE: "",
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
Class.flattenerTurret2Snowdread = {
	PARENT: ["genericTrinoughtSnowdread"],
	SHAPE: "",
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 3; i++) {
	Class.flattenerTurretSnowdread.GUNS.push(
		{
			POSITION: [18, 25, 0, 0, 0, 120*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [12, 17, 0, 4.5, 0, 120*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
	Class.flattenerTurret2Snowdread.GUNS.push(
		{
			POSITION: [17, 20, 0, 0, 0, 120*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [11, 12, 0, 4, 0, 120*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
}
Class.flattenerSnowdread = { // Size increase
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Flattener",
	UPGRADE_TOOLTIP: "Size Increase",
	SIZE: 1.4,
	BODY: sizeBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: 'flattenerTurretSnowdread'
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}
	],
}
Class.towerSnowdread = { // Size increase + auras
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Tower",
	UPGRADE_TOOLTIP: "Size Increase + Damage Auras",
	SIZE: 1.3,
	BODY: sizeBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: 'flattenerTurret2Snowdread'
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(),
	],
}
Class.creatureSnowdread = { // Size increase + heal auras
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Creature",
	UPGRADE_TOOLTIP: "Size Increase + Healing Auras",
	SIZE: 1.3,
	BODY: sizeBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: 'flattenerTurret2Snowdread'
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		},
		...addTrinoughtAuraRing(true),
	],
}
Class.spotlightSnowdread = { // Size increase + big aura
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Spotlight",
	UPGRADE_TOOLTIP: "Size Increase + Large Damage Aura",
	SIZE: 1.3,
	BODY: sizeBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: 'flattenerTurretSnowdread'
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "trinoughtBigAura",
		},
	],
}
Class.furnaceSnowdread = { // Size increase + big heal aura
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Furnace",
	UPGRADE_TOOLTIP: "Size Increase + Large Healing Aura",
	SIZE: 1.3,
	BODY: sizeBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: 'flattenerTurretSnowdread'
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "trinoughtBigHealAura",
		},
	],
}
Class.asteroidSnowdread = { // Size increase + big auto
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Asteroid",
	UPGRADE_TOOLTIP: "Size Increase + Heavy Auto",
	SIZE: 1.3,
	BODY: sizeBuffBodyStats[0],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: 'flattenerTurretSnowdread'
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: "kilobyteTurretSnowdread",
		},
	],
}
Class.cardinalSnowdread = { // Size decrease
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Cardinal",
	UPGRADE_TOOLTIP: "Size Decrease",
	SIZE: 0.75,
	BODY: {
		HEALTH: 0.65,
		SPEED: 1.2,
		ACCELERATION: 1.4,
	},
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [7, 0, 0, 0, 0, 1],
			TYPE: ["triangle", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5}, MIRROR_MASTER_ANGLE: true}],
		},
	],
}
Class.cagerTurretSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [["spin", {speed: -0.035}]],
	INDEPENDENT: true,
	LABEL: "",
	COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10},
	GUNS: [],
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 17.5}}]
		}, {
			POSITION: [10, 0, 0, 30, 0, 1],
			TYPE: ['hexagon', {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
		},
	]
};
for (let i = 0; i < 3; i++) {
	Class.cagerTurretSnowdread.GUNS.push(
		{ 
			POSITION: [10, 22, 1, -5, 2.5, 120*i, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.8}}
		}, { 
			POSITION: [6, 30, 1, -3, 1.5, 120*i, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}}
		},
	)
}
Class.cagerSnowdread = { // Minelayer
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Cager",
	UPGRADE_TOOLTIP: "Auto-Block Layer",
	GUNS: [
		{
			POSITION: [0, 9, 1, 0, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 5,
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, {recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
				TYPE: 'unsetPillboxWeakSnowdread',
				INDEPENDENT: true,
				SYNCS_SKILLS: true,
				DESTROY_OLDEST_CHILD: true,
			}
		},
	],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["triangle", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: 'cagerTurretSnowdread',
		}
	],
}
Class.monitorRadarSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [['spin', {speed: 0.02}]],
	INDEPENDENT: true,
	SHAPE: [[0.175, 1], [0.175, -1], [-0.175, -1], [-0.175, 1]],
	COLOR: 17,
	GUNS: [
		{
			POSITION: [6, 17, 1, -3, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -12.5, SATURATION_SHIFT: 0.65}}
		}, {
			POSITION: [3.5, 26, 1, -1.75, 0, 0, 0],
			PROPERTIES: {COLOR: 2}
		}
	]
};
Class.monitorSnowdread = { // FOV
	PARENT: ["genericTrinoughtSnowdread"],
	LABEL: "Monitor",
	UPGRADE_TOOLTIP: "FOV Boost",
	BODY: {
		FOV: 1.3,
		SPEED: 0.9,
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ['triangle', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["triangleBaseDeco"],
		}, {
			POSITION: [9, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10}}]
		}, {
			POSITION: [6, 0, 0, 0, 0, 1],
			TYPE:['egg', {COLOR: 2}]
		}, {
			POSITION: [16, 0, 0, 0, 360, 1],
			TYPE: 'monitorRadarSnowdread'
		}
	]
}

// T4 Weapons
Class.javelinSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Javelin",
	UPGRADE_TOOLTIP: "Assassins",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.javelinSnowdread.GUNS.push(
		...addAssassin({length: 28, width: 7, x: 7, angle: 72*i}, 10, [g.basic, g.sniper, g.assassin, g.assassin, g.assassin, g.assassin, {reload: 0.8, density: 2/9, speed: 0.8, maxSpeed: 0.8, health: 1.25}])
	)
}
Class.rapierSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Rapier",
	UPGRADE_TOOLTIP: "Muskets",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.rapierSnowdread.GUNS.push(
		...addRifle({length: 18, width: 5, angle: 72*i}, 5, [g.basic, g.sniper, g.rifle, {speed: 0.8, health: 1.5}], true)
	)
}
Class.woomeraSnowdread = { // hunter
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Woomera",
	UPGRADE_TOOLTIP: "X-Predators",
	CONTROLLERS: [["zoom", { distance: 450 }]],
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.woomeraSnowdread.GUNS.push(
		...addHunter({length: 20, width: 10.5, dimensionDifference: 2.5, angle: 72*i, barrelCount: 3}, 2.5, [g.basic, g.sniper, g.assassin, g.hunter, g.predator, {health: 1.1}]),
		{
			POSITION: [5, 10.5, -1.6, 7.5, 0, 72*i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 }, },
		}, {
			POSITION: [5, 9, -1.6, 6, 0, 72*i, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 15 } },
		},
	)
}
Class.trebuchetSnowdread = { // mega-sniper
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Trebuchet",
	UPGRADE_TOOLTIP: "Mega-Snipers",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.trebuchetSnowdread.GUNS.push(
		...addHeavySniper({length: 24, width: 9.5, angle: 72*i}, -2.5, [g.basic, g.sniper, g.predator, g.predator, g.predator, g.predator, {speed: 0.93, maxSpeed: 0.93, reload: 1.7, health: 1.4, size: 2}])
	)
}
Class.boltSnowdread = { // railgun
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Bolt",
	UPGRADE_TOOLTIP: "Railgums",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.boltSnowdread.GUNS.push(
		...addRailgun({length: 28.5, width: 4, x: 8, angle: 72*i}, -2.5, [g.basic, g.sniper, g.sniper, g.sniper, g.pounder, {reload: 1.5, damage: 1.2, speed: 1.2, maxSpeed: 1.2}])
	)
}
Class.diplomatSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Diplomat",
	UPGRADE_TOOLTIP: "Triplets",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.diplomatSnowdread.GUNS.push(
		...addNormal({length: 13, width: 7, y: 3.15, angle: 72*i, delay: 0.5}, 10, [g.basic, g.spam, g.spam, {size: 0.85}]),
		...addNormal({length: 13, width: 7, y: -3.15, angle: 72*i, delay: 0.5}, 10, [g.basic, g.spam, g.spam, {size: 0.85}]),
		...addNormal({length: 15, width: 7, angle: 72*i}, 10, [g.basic, g.spam, g.spam, {size: 0.85}]),
	)
}
Class.arbitratorSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Arbitrator",
	UPGRADE_TOOLTIP: "Machine Guns",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.arbitratorSnowdread.GUNS.push(
		...addNormal({length: 7.5, width: 10.75, aspect: 1.33, x: 5.5, angle: 72*i}, 10, [g.basic, g.machineGun, g.spam, g.spam, {size: 0.8, reload: 1.2}], false),
		...addNormal({length: 7.5, width: 9.5, aspect: 1.33, x: 7.5, angle: 72*i}, 10, [g.basic, g.machineGun, g.spam, g.spam, {size: 0.7, reload: 1.1}]),
		...addNormal({length: 7.5, width: 7.25, aspect: 1.25, x: 9.5, angle: 72*i}, 10, [g.basic, g.machineGun, g.spam, g.spam, {size: 0.6, reload: 1}]),
	)
}
Class.dissolverAutoSnowdread = {
	PARENT: 'autoTankGun',
	BODY: {FOV: 5},
	GUNS: [
		...addGunner({length: 25.5, width: 5, y: -3.5}, 0, [g.basic, g.sniper, g.assassin, g.flankGuard, g.flankGuard, g.autoTurret, {recoil: 0.9}]),
		...addGunner({length: 25.5, width: 5, y: 3.5, delay: 0.5}, 0, [g.basic, g.sniper, g.assassin, g.flankGuard, g.flankGuard, g.autoTurret, {recoil: 0.9}]),
		{
			POSITION: [7, 13, -1.3, 6, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 }, },
		}, {
			POSITION: [7, 11, -1.3, 4.5, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 } },
		},
	],
	TURRETS: [
		{
			POSITION: [15.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.dissolverSnowdread = { // all auto
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Dissolver",
	UPGRADE_TOOLTIP: "All Autos",
	TURRETS: [],
}
for(let i = 0; i < 5; i++) {
	Class.dissolverSnowdread.TURRETS.push(
		{
			POSITION: [9, 10, 0, 72*i, 200, 0],
			TYPE: 'dissolverAutoSnowdread',
		},
	)
}
Class.eroderSnowdread = { // ultra bullet spam
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Eroder",
	UPGRADE_TOOLTIP: "Rimflaks",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.eroderSnowdread.GUNS.push(
		...addSpam({length: 14, width: 4, y: 4.5, angle: 72*i, delay: 0}, 0, [g.basic, g.minigun, {health: 1.1}]),
		...addSpam({length: 12, width: 4, y: 4.5, angle: 72*i, delay: 0.5}, 0, [g.basic, g.minigun, {health: 1.1}]),
		...addSpam({length: 14, width: 4, y: -4.5, angle: 72*i, delay: 0.25}, 0, [g.basic, g.minigun, {health: 1.1}]),
		...addSpam({length: 12, width: 4, y: -4.5, angle: 72*i, delay: 0.75}, 0, [g.basic, g.minigun, {health: 1.1}]),
		...addGunner({length: 18, width: 1.6, y: -2, angle: 72*i}, 0, [g.basic, g.pelleter, g.twin, g.power, {speed: 0.7, maxSpeed: 0.7}]),
		...addGunner({length: 18, width: 1.6, y: 2, angle: 72*i, delay: 0.5}, 0, [g.basic, g.pelleter, g.twin, g.power, {speed: 0.7, maxSpeed: 0.7}]),
		{
			POSITION: [13.5, 7.5, 1, 0, 0, 72*i, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.5 }, },
		}, {
			POSITION: [12.5, 6, 1, 0, 0, 72*i, 0],
			PROPERTIES: { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 } },
		},
	)
}
Class.gripperTurretSnowdread = {
	PARENT: ["spamAutoTurret"],
	INDEPENDENT: true,
	GUNS: [
		{
			POSITION: [15, 14, -1.4, 0, 0, 0, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.6 } },
		},
		...addGunner({length: 23, width: 13}, -2.5, [g.basic, g.pounder, g.flankGuard, g.flankGuard, g.autoTurret, {reload: 0.9, recoil: 0.25}])
	],
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ["egg", {COLOR: -1}],
		},
	],
};
Class.gripperSnowdread = { // crowbar
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Gripper",
	UPGRADE_TOOLTIP: "Crowbars",
	GUNS: [],
	TURRETS: [],
}
for(let i = 0; i < 5; i++) {
	Class.gripperSnowdread.GUNS.push(
		...addCrowbar({length: 38, width: 7.5, x: 8, angle: 72*i}, 0)
	)
	Class.gripperSnowdread.TURRETS.push(
		{
			POSITION: [7.5, 38, 0, 72*i, 200, 1],
			TYPE: 'gripperTurretSnowdread',
		}, {
			POSITION: [7.5, 28, 0, 72*i, 200, 1],
			TYPE: 'gripperTurretSnowdread',
		},
	)
}
Class.retardantSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Retardant",
	UPGRADE_TOOLTIP: "Destroyers",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.retardantSnowdread.GUNS.push(
		...addHeavy({length: 17, width: 11, angle: 72*i}, 2.5, [g.basic, g.pounder, g.destroyer, g.annihilator, {reload: 0.9, health: 1.5}])
	)
}
Class.tyrantSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Tyrant",
	UPGRADE_TOOLTIP: "Skimmers",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.tyrantSnowdread.GUNS.push(
		...addLauncher({length: 15, width: 12, angle: 72*i}, 0, [g.basic, g.pounder, g.artillery, g.skimmer, {damage: 1.2, reload: 1.5}], true, "superMissileSnowdread")
	)
}
Class.anesthesiologistSnowdread = { // shotgun
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Anesthesiologist",
	UPGRADE_TOOLTIP: "Shotguns",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.anesthesiologistSnowdread.GUNS.push(
		...addShotgun({length: 20.5, width: 11, x: 7.5, angle: 72*i}, 5, [
			{l: 15, w: 4, y: -3},
			{l: 15, w: 4, y: 3},
			{l: 17, w: 5, y: 0},
			{l: 13, w: 5, y: -2},
			{l: 12, w: 1.5, y: -1, small: true},
			{l: 12, w: 2, y: 1, small: true},
			{l: 12, w: 2, y: 2, small: true},
		], [g.basic, g.machineGun, g.shotgun, {reload: 1.2, health: 1.75, damage: 1.1}], [g.basic, g.machineGun, g.shotgun, {speed: 1.55, maxSpeed: 1.3, reload: 1.2, damage: 0.9}])
	)
}
Class.helixSnowdread = { // twister
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Helix",
	UPGRADE_TOOLTIP: "Twisters",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.helixSnowdread.GUNS.push(
		...addTwister({length: 17, width: 9.5, angle: 72*i}, 0, [g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, {speed: 1.9, maxSpeed: 1.3, reload: 1.333}], "spiralMissileSnowdread")
	)
}
Class.bombardmentSnowdread = { // artillery
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Bombardment",
	UPGRADE_TOOLTIP: "Mortars",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.bombardmentSnowdread.GUNS.push(
		...addGunner({length: 14, width: 2, y: -4.25, angle: 72*i-7, delay: 0.6}, 0, [g.basic, g.pelleter, g.artillery, {speed: 1.1, maxSpeed: 1.1}]),
		...addGunner({length: 14, width: 2, y: 4.25, angle: 72*i+7, delay: 0.8}, 0, [g.basic, g.pelleter, g.artillery, {speed: 1.1, maxSpeed: 1.1}]),
		...addGunner({length: 15.5, width: 2, y: -2.5, angle: 72*i-7, delay: 0.2}, 0, [g.basic, g.pelleter, g.artillery]),
		...addGunner({length: 15.5, width: 2, y: 2.5, angle: 72*i+7, delay: 0.4}, 0, [g.basic, g.pelleter, g.artillery]),
		...addHeavy({length: 17.5, width: 8, angle: 72*i}, 2.5, [g.basic, g.destroyer, g.artillery, {speed: 1.1, maxSpeed: 1.1}])
	)
}
Class.raiderSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Raider",
	UPGRADE_TOOLTIP: "Drones",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.raiderSnowdread.GUNS.push(
		...addDrone({length: 4, width: 5, aspect: 2.1, x: 9, y: 3.25, angle: 72*i}, 0, [g.drone, g.overseer, g.overseer, g.overseer, {size: 1.5, reload: 0.6}], 2, "drone"),
		...addDrone({length: 4, width: 5, aspect: 2.1, x: 9, y: -3.25, angle: 72*i}, 0, [g.drone, g.overseer, g.overseer, g.overseer, {size: 1.5, reload: 0.6}], 2, "drone"),
		...addDrone({length: 6, width: 6.5, aspect: 1.4, x: 9, angle: 72*i}, 0, [g.drone, g.overseer, g.overseer, g.overseer, g.pounder, {size: 2, reload: 0.4}], 2, "betadrone"),
	)
}
Class.gladiatorGenericMinionSnowdread = {
	PARENT: ["minion"],
	BODY: { SPEED: 1 },
	SHAPE: 3.5,
	GUNS: [],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "aggressorMinionTopSnowdread"
		}
	]
}
Class.gladiatorTritankMinionSnowdread = {
	PARENT: ["gladiatorGenericMinionSnowdread"],
	GUNS: [],
}
Class.gladiatorTritrapMinionSnowdread = {
	PARENT: ["gladiatorGenericMinionSnowdread"],
	GUNS: [],
}
Class.gladiatorTriswarmMinionSnowdread = {
	PARENT: ["gladiatorGenericMinionSnowdread"],
	GUNS: [],
}
Class.gladiatorAutoMinionTurretSnowdread = {
	PARENT: "spamAutoTurret",
	GUNS: [
		{
			POSITION: [18, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 },
			},
		}, { // Main gun
			POSITION: [22, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, {range: 0.5}]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.5 },
			},
		}, {
			POSITION: [14.5, 2, 1, 0, 5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 17.5 },
			},
		}, {
			POSITION: [14.5, 2, 1, 0, -5, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.turret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 17.5 },
			},
		},
	]
}
Class.gladiatorAutoMinionSnowdread = {
	PARENT: ["gladiatorGenericMinionSnowdread"],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "aggressorMinionTopSnowdread"
		}, {
			POSITION: [12, 0, 0, 0, 360, 1],
			TYPE: "gladiatorAutoMinionTurretSnowdread"
		}
	]
}
Class.gladiatorAuraMinionAuraSnowdread = addAura(1, 1.2, 0.3, 0, "Small");
Class.gladiatorAuraMinionSnowdread = {
	PARENT: ["gladiatorGenericMinionSnowdread"],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "aggressorMinionTopSnowdread"
		}, {
			POSITION: [12, 0, 0, 0, 360, 1],
			TYPE: "gladiatorAuraMinionAuraSnowdread",
		}
	]
}
Class.gladiatorHealAuraMinionAuraSnowdread = addAura(-2/3, 1.2, 0.3, "red", "Small");
Class.gladiatorHealAuraMinionSnowdread = {
	PARENT: ["gladiatorGenericMinionSnowdread"],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: "aggressorMinionTopSnowdread"
		}, {
			POSITION: [12, 0, 0, 0, 360, 1],
			TYPE: "gladiatorHealAuraMinionAuraSnowdread",
		}
	]
}
for (let i = 0; i < 3; i++) {
	Class.gladiatorTritankMinionSnowdread.GUNS.push(
		{
			POSITION: [15, 8.5, 1, 0, 0, 120*i, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.minionGun, {speed: 0.7, maxSpeed: 0.7, range: 0.6}]),
				WAIT_TO_CYCLE: true,
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 10 },
				TYPE: 'bullet',
			},
		}, {
			POSITION: [13.5, 5.5, 1, 0, 0, 120*i, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.minionGun, g.fake]),
				WAIT_TO_CYCLE: true,
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.85 },
				TYPE: 'bullet',
			},
		},
	);
	Class.gladiatorTritrapMinionSnowdread.GUNS.push(
		...addTrap({length: 13, length2: 3, width: 7, aspect: 1.7, angle: 120*i}, 5, [g.trap, g.flankGuard, g.minionGun, {reload: 1.6, shudder: 0.2}])
	);
	Class.gladiatorTriswarmMinionSnowdread.GUNS.push(
		{
			POSITION: [7, 8.5, -1.5, 7, 0, 120*i, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.minionGun, {size: 1.6, range: 0.5}]),
				TYPE: 'swarm',
				STAT_CALCULATOR: gunCalcNames.swarm,
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -10, SATURATION_SHIFT: 0.7}
			},
		}, {
			POSITION: [10.5, 6.8, -1.5, 2.5, 0, 120*i, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.minionGun, g.fake]),
				TYPE: 'swarm',
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -2.5, SATURATION_SHIFT: 0.7},
				BORDERLESS: true
			},
		},
	);
}
Class.gladiatorSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Gladiator",
	UPGRADE_TOOLTIP: "Minions",
	GUNS: [
		...addMinion({length: 13, width: 13, gap: 2.75, angle: 0}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorTritankMinionSnowdread", 2),
		...addMinion({length: 13, width: 13, gap: 2.75, angle: 72}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorTritrapMinionSnowdread", 2),
		...addMinion({length: 13, width: 13, gap: 2.75, angle: 144}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorTriswarmMinionSnowdread", 2),
		...addMinion({length: 13, width: 13, gap: 2.75, angle: -144}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorAutoMinionSnowdread", 2),
		...addMinion({length: 13, width: 13, gap: 2.75, angle: -72}, 0, [g.factory, {size: 0.9, reload: 0.5}], "gladiatorAuraMinionSnowdread", 2),
	],
}
Class.starlightSnowdread = { // auto-drones
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Starlight",
	UPGRADE_TOOLTIP: "Auto-Drones",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.starlightSnowdread.GUNS.push(
		...addAutoDrone({length: 5, width: 10, aspect: 1.2, x: 9, angle: 72*i}, 0, [g.drone, g.overseer, {reload: 1.5, speed: 1.15, maxSpeed: 1.15}], 3)
	)
}
Class.bruiserSnowdread = { // honcho
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Bruiser",
	UPGRADE_TOOLTIP: "Heavy Drones",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.bruiserSnowdread.GUNS.push(
		...addHoncho({length: 5, width: 8.5, aspect: 1.5, x: 9, angle: 72*i}, 0, [g.drone, g.overseer, g.overseer, g.honcho, {maxSpeed: 0.85}], 2)
	)
};
Class.incapacitatorSnowdread = { // swarms
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Incapacitator",
	UPGRADE_TOOLTIP: "Swarms",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.incapacitatorSnowdread.GUNS.push(
		...addSwarm({length: 6, width: 6, x: 8, y: 3.25, angle: 72*i, delay: 0}, 0, [g.swarm, g.flankGuard, g.flankGuard, {maxSpeed: 1.2}]),
		...addSwarm({length: 6, width: 6, x: 8, y: -3.25, angle: 72*i, delay: 0.5}, 0, [g.swarm, g.flankGuard, g.flankGuard, {maxSpeed: 1.2}]),
		{
			POSITION: [3, 10, 0.85, 9, 0, 72*i, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
		},
	)
};
Class.cerberusSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Cerberus",
	UPGRADE_TOOLTIP: "Trap Spam",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.cerberusSnowdread.GUNS.push(
		...addTrap({length: 13, length2: 1.5, width: 4, y: 2.2, angle: 72*i+10, delay: 0.5}, 0, [g.trap, g.pounder, {speed: 1.2, reload: 1.09}]),
		...addTrap({length: 13, length2: 1.5, width: 4, y: -2.2, angle: 72*i-10, delay: 0.5}, 0, [g.trap, g.pounder, {speed: 1.2, reload: 1.09}]),
		...addTrap({length: 15, length2: 2, width: 5.5, aspect: 1.7, angle: 72*i}, 0, [g.trap, g.setTrap, g.pounder, {speed: 1.2, reload: 1.09}], true),
	)
}
Class.luciferSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Lucifer",
	UPGRADE_TOOLTIP: "Blocks",
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.luciferSnowdread.GUNS.push(
		...addTrap({length: 13, length2: 3.5, width: 10, angle: 72*i}, 0, [g.trap, g.setTrap, g.pounder, {speed: 1.3, maxSpeed: 1.3, size: 1.3, health: 2}], true),
	)
}
Class.sterilizerSnowdread = { // auto-traps
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Sterilizer",
	UPGRADE_TOOLTIP: "Auto-Blocks",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.sterilizerSnowdread.GUNS.push(
		...addAutoTrap({length: 16.5, length2: 2, width: 11, aspect: 1.3, angle: 72*i}, 0, [g.trap, g.setTrap, {reload: 2.667}], 4, true)
	)
}
Class.hielamanSnowdread = { // aura-traps
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Hielaman",
	UPGRADE_TOOLTIP: "Aura-Traps",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.hielamanSnowdread.GUNS.push(
		...addAuraTrap({length: 15, length2: 3, width: 9, aspect: 1.6, angle: 72*i}, 0, [g.trap, g.setTrap, g.hexaTrapper, {reload: 2.4, health: 2.4}], true)
	)
}
Class.jackhammerSnowdread = { // trap + gun
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Jackhammer",
	UPGRADE_TOOLTIP: "Blocks + Bullets",
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.jackhammerSnowdread.GUNS.push(
		...addNormal({length: 21, width: 8, angle: 72*i}, 7.5),
		...addTrap({length: 14.5, length2: 3, width: 10, aspect: 1.4, angle: 72*i}, 0, [g.trap, g.setTrap, g.hexaTrapper], true)
	)
}

// T4 Bodies
Class.skynetSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Skynet",
	UPGRADE_TOOLTIP: "Small Auto Spam",
	TURRETS: [
		{
			POSITION: [11, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
	],
}
for (let i = 0; i < 5; i++) {
	Class.skynetSnowdread.TURRETS.push(
		{
			POSITION: [3.25, 4.5, 0, 72*i, 200, 1],
			TYPE: "spamAutoTurret",
		},
	)
}
for (let i = 0; i < 5; i++) {
	Class.skynetSnowdread.TURRETS.push(
		{
			POSITION: [3.25, 8, 0, 72*i+36, 200, 1],
			TYPE: "spamAutoTurret",
		},
	)
}
Class.pentanoughtBigAura = addAura(2.5, 1.45, 0.3, 0, "Large");
Class.supernovaSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Supernova",
	UPGRADE_TOOLTIP: "Damage Aura + Small Autos",
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
		...addPentanoughtTurretRing(),
		{
			POSITION: [9, 0, 0, 0, 360, 1],
			TYPE: "pentanoughtBigAura",
		},
	],
}
Class.cipherSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Cipher",
	UPGRADE_TOOLTIP: "Heavy Auto + Small Autos",
	TURRETS: [
		{
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
		...addPentanoughtTurretRing(),
		{
			POSITION: [11.5, 0, 0, 0, 360, 1],
			TYPE: "megabyteTurretSnowdread",
		},
	],
}
Class.pentanoughtBigHealAura = addAura(-2, 1.45, 0.3, "red", "Large");
Class.interstellarSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Interstellar",
	UPGRADE_TOOLTIP: "Healing Aura + Small Autos",
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "pentanoughtBigHealAura",
		},
		...addPentanoughtTurretRing(),
	],
}
Class.gigabyteTurretSnowdread = {
	PARENT: ["autoTankGun"],
	INDEPENDENT: true,
	COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
	GUNS: [
		{
			POSITION: [14, 8, 0.001, -2, -11, 135, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 1.2 } },
		}, {
			POSITION: [14, 8, 0.001, -2, 11, -135, 0],
			PROPERTIES: { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 1.2 } },
		}, {
			POSITION: [21, 16, 1.3, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 5 },
			},
		}, { // Main gun
			POSITION: [26, 16, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.autoTurret, {speed: 1.1, health: 0.8}]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 },
			},
		}, {
			POSITION: [21.5, 10, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.7 },
				BORDERLESS: true,
			},
		}, {
			POSITION: [16.5, 3, -1.6, 0, 6.1, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 },
			},
		}, {
			POSITION: [16.5, 3, -1.6, 0, -6.1, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, g.autoTurret, g.fake]),
				TYPE: "bullet",
				COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 },
			},
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, 55, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, -55, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, 135, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}, {
			POSITION: [10, 9.5, 0.5, 0, 0, -135, 0],
			PROPERTIES: { COLOR: 17, DRAW_ABOVE: true }
		}
	],
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -17.5, SATURATION_SHIFT: 0.5 } }],
		}, {
			POSITION: [9.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
Class.gigabyteSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Gigabyte",
	UPGRADE_TOOLTIP: "Heavy Auto Turret",
	TURRETS: [
		{
			POSITION: [14.5, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [13, 0, 0, 0, 360, 1],
			TYPE: "gigabyteTurretSnowdread",
		},
	],
}
Class.pentanoughtSmallAura = addAura(1, 1.6, 0.15, 0, "Small");
Class.malwareSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Malware",
	UPGRADE_TOOLTIP: "Heavy Auto + Damage Auras",
	TURRETS: [
		{
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
		...addPentanoughtAuraRing(),
		{
			POSITION: [11.5, 0, 0, 0, 360, 1],
			TYPE: "megabyteTurretSnowdread",
		},
	],
}
Class.pentanoughtSmallHealAura = addAura(-2/3, 1.6, 0.15, "red", "Small");
Class.softwareSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Software",
	UPGRADE_TOOLTIP: "Heavy Auto + Healing Auras",
	TURRETS: [
		{
			POSITION: [13, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
		...addPentanoughtAuraRing(true),
		{
			POSITION: [11.5, 0, 0, 0, 360, 1],
			TYPE: "megabyteTurretSnowdread",
		},
	],
}
Class.roasterTurretSnowdread = {
	PARENT: 'genericTank',
	COLOR: -1,
	CONTROLLERS: ['nearestDifferentMaster'],
	INDEPENDENT: true,
	GUNS: [
		{
			POSITION: [15, 12, 1.6, 0, 0, 180, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5, SATURATION_SHIFT: 0.9}},
		}, {
			POSITION: [16.5, 7, 1.5, 0, 0, 180, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}},
		}, {
			POSITION: [13, 2, 1, 0, -8, -10, 0],
				PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
		}, {
			POSITION: [20.5, 7, 1.1, 0, -2, -10, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.autoTurret, g.flame]),
				TYPE: 'growBullet',
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.7},
			}
		}, {
			POSITION: [13, 2, 1, 0, 8, 10, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 12.5}},
		}, {
			POSITION: [20.5, 7, 1.1, 0, 2, 10, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.autoTurret, g.flame]),
				TYPE: 'growBullet',
				COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -5, SATURATION_SHIFT: 0.7},
			}
		}, {
			POSITION: [13, 11.5, -1.4, 0, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}}
		},
	],
	TURRETS: [
		{
			POSITION: [15.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: 17, BRIGHTNESS_SHIFT: 7.5 } }],
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -2.5 } }]
		},
	]
};
Class.roasterSnowdread = { // Flamethrower
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Roaster",
	UPGRADE_TOOLTIP: "Flamethrower",
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ['pentagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [10.5, 0, 0, 0, 360, 1],
			TYPE: 'roasterTurretSnowdread'
		},
	],
}
Class.monsoonTurretSnowdread = {
	PARENT: 'genericTank',
	LABEL: "",
	BODY: { FOV: 1.5 },
	CONTROLLERS: [[ 'spin', {speed: 0.03}]],
	COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5},
	INDEPENDENT: true,
	MAX_CHILDREN: 9,
	GUNS: [],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 } }],
		}, {
			POSITION: [9.5, 0, 0, 0, 0, 1],
			TYPE: ["egg", { COLOR: { BASE: -1 } }]
		},
	]
}
for (let i = 0; i < 3; i++) {
	Class.monsoonTurretSnowdread.GUNS.push(
		...addDroneOnAuto({length: 6.5, width: 12.5, aspect: 1.2, x: 7.5, angle: 120*i}, 5, [g.drone, {size: 1.5, health: 1.1}])
	)
}
Class.monsoonSnowdread = { // Drones
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Monsoon",
	UPGRADE_TOOLTIP: "Drone Turret",
	BODY: {
		SPEED: 0.93,
		FOV: 1.1,
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ['pentagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [10.5, 0, 0, 0, 360, 1],
			TYPE: 'monsoonTurretSnowdread'
		},
	],
}
if (useOldPhotosphere) {
	Class.photosphereSmallAuraSnowdread = addAura(1, 1.85, 0.1, 0, "Small");
	Class.photosphereBigAuraSnowdread = addAura(1.5, 4, 0.15);
}
Class.photosphereSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Photosphere",
	UPGRADE_TOOLTIP: "Damage Auras",
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
	],
}
if (useOldPhotosphere) {
	for (let i = 0; i < 5; i++) {
		Class.photosphereSnowdread.TURRETS.push(
			{
				POSITION: [3.5, 8.75, 0, 72*i+36, 360, 1],
				TYPE: "photosphereSmallAuraSnowdread",
			},
		)
	}
	for (let i = 0; i < 5; i++) {
		Class.photosphereSnowdread.TURRETS.push(
			{
				POSITION: [3, 4, 0, 72*i, 360, 1],
				TYPE: "photosphereBigAuraSnowdread",
			},
		)
	}
} else {
	Class.photosphereSnowdread.TURRETS.push(
		...addPentanoughtAuraRing(),
		{
			POSITION: [9, 0, 0, 0, 360, 1],
			TYPE: "pentanoughtBigAura",
		},
	)
}
Class.stratosphereSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Stratosphere",
	UPGRADE_TOOLTIP: "Healing Auras",
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
		...addPentanoughtAuraRing(true),
		{
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "pentanoughtBigHealAura",
		},
	],
}
Class.behemothSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Behemoth",
	UPGRADE_TOOLTIP: "Health Buff",
	BODY: hpBuffBodyStats[2],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [7.5, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 10}, BORDERLESS: true}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ["pentagon", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
		},
	],
}
Class.astronomicSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Astronomic",
	UPGRADE_TOOLTIP: "Health Buff + Damage Auras",
	BODY: hpBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
		...addPentanoughtAuraRing(),
	],
}
Class.grandioseSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Grandiose",
	UPGRADE_TOOLTIP: "Health Buff + Healing Auras",
	BODY: hpBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
		},
		...addPentanoughtAuraRing(true),
	],
}
Class.bunkerSnowdread = { // HP + auto spam
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Bunker",
	UPGRADE_TOOLTIP: "Health Buff + Small Autos",
	BODY: hpBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
		},
		...addPentanoughtTurretRing(),
	],
}
Class.arsenalSnowdread = { // HP + big auto
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Arsenal",
	UPGRADE_TOOLTIP: "Health Buff + Heavy Auto",
	BODY: hpBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [24, 0, 0, 180, 0, -1],
			TYPE: ["pentagon", {COLOR: 9,MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [11.5, 0, 0, 0, 360, 1],
			TYPE: "megabyteTurretSnowdread",
		},
	],
}
Class.pentagonLeviathanTopSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Leviathan",
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
Class.pentagonLeviathanBottomSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Leviathan",
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for (let i = 0; i < 5; i++) {
	Class.pentagonLeviathanTopSnowdread.GUNS.push(
		{
			POSITION: [6, 13.5, 0.001, 9, 0, 72*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [4, 11.5, 0, 5.7, 0, 72*i, 0],
			PROPERTIES: {COLOR: 9, DRAW_ABOVE: true},
		},
	);
	Class.pentagonLeviathanBottomSnowdread.GUNS.push(
		{
			POSITION: [7, 17, 0.001, 9, 0, 72*i, 0],
			PROPERTIES: {COLOR: 9},
		}
	);
}
Class.hexagonLeviathanTopSnowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	LABEL: "Leviathan",
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
Class.hexagonLeviathanBottomSnowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	LABEL: "Leviathan",
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for (let i = 0; i < 6; i++) {
	Class.hexagonLeviathanTopSnowdread.GUNS.push(
		{
			POSITION: [6, 10, 0.001, 9.5, 0, 60*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [3, 9, 0, 7, 0, 60*i, 0],
			PROPERTIES: {COLOR: 9, DRAW_ABOVE: true},
		},
	)
	Class.hexagonLeviathanBottomSnowdread.GUNS.push(
		{
			POSITION: [7, 13.5, 0.001, 9.5, 0, 60*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.leviathanSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Leviathan",
	UPGRADE_TOOLTIP: "Speed Buff",
	BODY: speedBuffBodyStats[2],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: ["pentagonLeviathanTopSnowdread", {MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
	],
}
Class.valrayvnSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Valrayvn",
	UPGRADE_TOOLTIP: "Speed Buff + Damage Auras",
	BODY: speedBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
		...addPentanoughtAuraRing(),
	],
}
Class.pegasusSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Pegasus",
	UPGRADE_TOOLTIP: "Speed Buff + Healing Auras",
	BODY: speedBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
		...addPentanoughtAuraRing(true),
	],
}
Class.maceSnowdread = { // Speed + auto spam
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Mace",
	UPGRADE_TOOLTIP: "Speed Buff + Small Autos",
	BODY: speedBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [12, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
		...addPentanoughtTurretRing(),
	],
}
Class.missileSnowdread = { // Speed + big auto
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Missile",
	UPGRADE_TOOLTIP: "Speed Buff + Heavy Auto",
	BODY: speedBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
		}, {
			POSITION: [11.5, 0, 0, 0, 360, 1],
			TYPE: "megabyteTurretSnowdread",
		},
	],
}
Class.battalionSnowdread = { // Speed + HP
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Battalion",
	UPGRADE_TOOLTIP: "Speed Buff + Health Buff",
	BODY: {
		HEALTH: 2.8, 
		SHIELD: 2.8, 
		REGEN: 1.8, 
		SPEED: 2.15,
	},
	TURRETS: [
		{
			POSITION: [15, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {COLOR: 9, MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [20, 0, 0, 0, 0, -1],
			TYPE: ["pentagonLeviathanBottomSnowdread", {MIRROR_MASTER_ANGLE: true}]
		},
	],
}
Class.pentagonWispTurretSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	SHAPE: 5,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.pentagonWispTurretSnowdread.GUNS.push(
		{
			POSITION: [26, 13, 0.001, 3, 0, 72*i+36, 0],
			PROPERTIES: {COLOR: 9}
		}, {
			POSITION: [23.5, 10, 0.001, 0, 0, 72*i+36, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
		},
	)
}
Class.hexagonWispTurretSnowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	SHAPE: 6,
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 6; i++) {
	Class.hexagonWispTurretSnowdread.GUNS.push(
		{
			POSITION: [26, 13, 0.001, 3, 0, 60*i, 0],
			PROPERTIES: {COLOR: 9}
		}, {
			POSITION: [23.5, 10, 0.001, 0, 0, 60*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true}
		},
	)
}
Class.wispSnowdread = { // Drifter
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Wisp",
	UPGRADE_TOOLTIP: "Icy Movement",
	BODY: {
		SPEED: 2.2,
		ACCELERATION: 0.18,
	},
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [11, 0, 0, 0, 0, 1],
			TYPE: ['pentagonWispTurretSnowdread']
		}
	],
}
Class.pentagonTitaniumTopSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	SHAPE: 0,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 10; i++) {
	Class.pentagonTitaniumTopSnowdread.GUNS.push(
		{
			POSITION: [8, 6, 0.001, 20, 0, 36*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [8, 6, 0.001, -20, 0, 36*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.pentagonTitaniumBottomSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.pentagonTitaniumBottomSnowdread.GUNS.push(
		{
			POSITION: [5, 6, 0.001, 9.5, 3.5, 72*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [5, 6, 0.001, 9.5, -3.5, 72*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.hexagonTitaniumTopSnowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	SHAPE: 0,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 12; i++) {
	Class.hexagonTitaniumTopSnowdread.GUNS.push(
		{
			POSITION: [7, 5, 0.001, 18, 0, 30*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [7, 5, 0.001, -18, 0, 30*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.hexagonTitaniumBottomSnowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	GUNS: [],
}
for(let i = 0; i < 6; i++) {
	Class.hexagonTitaniumBottomSnowdread.GUNS.push(
		{
			POSITION: [5, 5, 0.001, 9.5, 3.25, 60*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [5, 5, 0.001, 9.5, -3.25, 60*i, 0],
			PROPERTIES: {COLOR: 9},
		},
	)
}
Class.titaniumSnowdread = { // Body damage increase
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Titanium",
	UPGRADE_TOOLTIP: "Body Damage Buff",
	BODY: {
		DAMAGE: 3.7,
		PENETRATION: 2.9,
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [6, 0, 0, 0, 360, 1],
			TYPE: ['pentagonTitaniumTopSnowdread']
		}, {
			POSITION: [20, 0, 0, 0, 360, -1],
			TYPE: ['pentagonTitaniumBottomSnowdread']
		},
	],
}
Class.pentagonCrusherTurretSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: [],
}
Class.pentagonCrusherTurret2Snowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: [],
}
Class.pentagonCrusherTurret3Snowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: [],
}
for(let i = 0; i < 5; i++) {
	Class.pentagonCrusherTurretSnowdread.GUNS.push(
		{
			POSITION: [20, 16, 0, 0, 0, 72*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [14, 10, 0, 3.5, 0, 72*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
	Class.pentagonCrusherTurret2Snowdread.GUNS.push(
		{
			POSITION: [21, 11, 0, 0, 0, 72*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [15, 6, 0, 3.5, 0, 72*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
	Class.pentagonCrusherTurret3Snowdread.GUNS.push(
		{
			POSITION: [17, 16, 0, 0, 0, 72*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [10, 11, 0, 5, 0, 72*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
}
Class.hexagonCrusherTurretSnowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: [],
}
Class.hexagonCrusherTurret2Snowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: [],
}
Class.hexagonCrusherTurret3Snowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5},
	GUNS: [],
}
for(let i = 0; i < 6; i++) {
	Class.hexagonCrusherTurretSnowdread.GUNS.push(
		{
			POSITION: [20, 13.5, 0, 0, 0, 60*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [14, 7.5, 0, 3.5, 0, 60*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
	Class.hexagonCrusherTurret2Snowdread.GUNS.push(
		{
			POSITION: [21, 8.5, 0, 0, 0, 60*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [15, 4, 0, 3.5, 0, 60*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
	Class.hexagonCrusherTurret3Snowdread.GUNS.push(
		{
			POSITION: [17, 13.5, 0, 0, 0, 60*i, 0],
			PROPERTIES: {COLOR: 9},
		}, {
			POSITION: [10, 9, 0, 5, 0, 60*i, 0],
			PROPERTIES: {COLOR: {BASE: 9, BRIGHTNESS_SHIFT: 6}, BORDERLESS: true},
		},
	)
}
Class.crusherSnowdread = { // Size increase
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Crusher",
	UPGRADE_TOOLTIP: "Size Increase",
	SIZE: 1.5,
	BODY: sizeBuffBodyStats[2],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ['pentagonCrusherTurretSnowdread']
		}
	],
}
Class.mountainSnowdread = { // Size increase + auras
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Mountain",
	UPGRADE_TOOLTIP: "Size Increase + Damage Auras",
	SIZE: 1.4,
	BODY: sizeBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ['pentagonCrusherTurret2Snowdread']
		},
		...addPentanoughtAuraRing(),
	],
}
Class.beastSnowdread = { // Size increase + heal auras
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Beast",
	UPGRADE_TOOLTIP: "Size Increase + Healing Auras",
	SIZE: 1.4,
	BODY: sizeBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ['pentagonCrusherTurret2Snowdread']
		},
		...addPentanoughtAuraRing(true),
	],
}
Class.luminanceSnowdread = { // Size increase + big aura
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Luminance",
	UPGRADE_TOOLTIP: "Size Increase + Large Damage Aura",
	SIZE: 1.4,
	BODY: sizeBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: ['pentagonCrusherTurret3Snowdread']
		}, {
			POSITION: [9, 0, 0, 0, 360, 1],
			TYPE: "pentanoughtBigAura",
		},
	],
}
Class.foundrySnowdread = { // Size increase + big heal aura
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Foundry",
	UPGRADE_TOOLTIP: "Size Increase + Large Healing Aura",
	SIZE: 1.4,
	BODY: sizeBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: ['pentagonCrusherTurret3Snowdread']
		}, {
			POSITION: [9.5, 0, 0, 0, 360, 1],
			TYPE: "pentanoughtBigHealAura",
		},
	],
}
Class.planetoidSnowdread = { // Size increase + big auto
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Planetoid",
	UPGRADE_TOOLTIP: "Size Increase + Heavy Auto",
	SIZE: 1.4,
	BODY: sizeBuffBodyStats[1],
	TURRETS: [
		{
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [12, 0, 0, 0, 0, 1],
			TYPE: ['pentagonCrusherTurret3Snowdread']
		}, {
			POSITION: [11.5, 0, 0, 0, 360, 1],
			TYPE: "megabyteTurretSnowdread",
		},
	],
}
Class.pentagonFinchTurretSnowdread = {
	PARENT: ["genericPentanoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: 9,
	TURRETS: [
		{
			POSITION: [15.5, 0, 0, 0, 0, 1],
			TYPE: ['pentagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
		}
	]
}
Class.hexagonFinchTurretSnowdread = {
	PARENT: ["genericHexnoughtSnowdread"],
	MIRROR_MASTER_ANGLE: true,
	COLOR: 9,
	TURRETS: [
		{
			POSITION: [16.5, 0, 0, 30, 0, 1],
			TYPE: ['hexagon', {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}]
		}
	]
}
Class.finchSnowdread = { // Size decrease
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Finch",
	UPGRADE_TOOLTIP: "Size Decrease",
	SIZE: 0.65,
	BODY: {
		HEALTH: 0.5,
		SPEED: 1.3,
		ACCELERATION: 1.6,
	},
	TURRETS: [
		{
			POSITION: [13, 0, 0, 0, 0, 1],
			TYPE: ['pentagonFinchTurretSnowdread']
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		},
	],
}
Class.pentagonHoarderTurretSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [["spin", {speed: -0.035}]],
	INDEPENDENT: true,
	LABEL: "",
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5},
	GUNS: [],
	TURRETS: [
		{
			POSITION: [17, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: -1}]
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10}}]
		},
	]
};
Class.hexagonHoarderTurretSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [["spin", {speed: -0.035}]],
	INDEPENDENT: true,
	LABEL: "",
	COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 5},
	GUNS: [],
	TURRETS: [
		{
			POSITION: [17, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: -1}]
		}, {
			POSITION: [10, 0, 0, 0, 0, 1],
			TYPE: ['egg', {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 10}}]
		},
	]
};
for(let i = 0; i < 5; i++) {
	Class.pentagonHoarderTurretSnowdread.GUNS.push(
		{ 
			POSITION: [15, 5.5, -2.5, 0, 0, 72*i, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
		},
	)
}
for(let i = 0; i < 6; i++) {
	Class.hexagonHoarderTurretSnowdread.GUNS.push(
		{ 
			POSITION: [16, 5, -2.5, 0, 0, 60*i, 0],
			PROPERTIES: {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 7.5}},
		},
	)
}
Class.hoarderSnowdread = { // Minelayer
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Hoarder",
	UPGRADE_TOOLTIP: "Auto-Block Layer",
	GUNS: [
		{
			POSITION: [0, 14, 1, 0, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 5,
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct, {recoil: 0, maxSpeed: 1e-3, speed: 1e-3}]),
				TYPE: 'unsetPillboxSnowdread',
				INDEPENDENT: true,
				SYNCS_SKILLS: true,
				DESTROY_OLDEST_CHILD: true,
			}
		},
	],
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [10, 0, 0, 0, 360, 1],
			TYPE: ['pentagonHoarderTurretSnowdread']
		}
	],
}
Class.trackerRadarSnowdread = {
	PARENT: 'genericTank',
	CONTROLLERS: [['spin', {speed: 0.02}]],
	INDEPENDENT: true,
	SHAPE: [[0.16, 1], [0.16, -1], [-0.16, -1], [-0.16, 1]],
	COLOR: 17,
	GUNS: [
		{
			POSITION: [6.2, 17, 1, -3.1, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.65}}
		}, {
			POSITION: [3.2, 26, 1, -1.6, 0, 0, 0],
			PROPERTIES: {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 2.5}}
		}
	]
};
Class.trackerSnowdread = { // FOV
	PARENT: ["genericPentanoughtSnowdread"],
	LABEL: "Tracker",
	UPGRADE_TOOLTIP: "FOV Boost",
	BODY: {
		FOV: 1.4,
		SPEED: 0.85
	},
	TURRETS: [
		{
			POSITION: [14, 0, 0, 180, 0, 1],
			TYPE: ["pentagon", {MIRROR_MASTER_ANGLE: true, COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}}],
		}, {
			POSITION: [20, 0, 0, 0, 0, 1],
			TYPE: ["pentagonBaseDeco"],
		}, {
			POSITION: [11, 0, 0, 180, 0, 1],
			TYPE: ["egg", {COLOR: {BASE: 17, BRIGHTNESS_SHIFT: 5}, MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [7.5, 0, 0, 180, 0, 1],
			TYPE: ["egg", {COLOR: -1, MIRROR_MASTER_ANGLE: true}],
		}, {
			POSITION: [15.5, 0, 0, 0, 360, 1],
			TYPE: 'trackerRadarSnowdread'
		},
	],
}

Class.addons.UPGRADES_TIER_0.push("dreadSnowdread");
	Class.dreadSnowdread.UPGRADES_TIER_0 = [
		["sword2Snowdread", "dreadBodySnowdread",],
		["pacifier2Snowdread", "dreadBodySnowdread"],
		["peacekeeper2Snowdread", "dreadBodySnowdread"],
		["invader2Snowdread", "dreadBodySnowdread"],
		["centaur2Snowdread", "dreadBodySnowdread"],
	];

	Class.sword2Snowdread.UPGRADES_TIER_0 = ["swordSnowdread"];
	Class.pacifier2Snowdread.UPGRADES_TIER_0 = ["pacifierSnowdread"];
	Class.peacekeeper2Snowdread.UPGRADES_TIER_0 = ["peacekeeperSnowdread"];
	Class.invader2Snowdread.UPGRADES_TIER_0 = ["invaderSnowdread"];
	Class.centaur2Snowdread.UPGRADES_TIER_0 = ["centaurSnowdread"];

	Class.dreadWeaponSnowdread.UPGRADES_TIER_0 = ["swordSnowdread", "pacifierSnowdread", "peacekeeperSnowdread", "invaderSnowdread", "centaurSnowdread"];

		Class.swordSnowdread.UPGRADES_TIER_0 = ["gladiusSnowdread", "sabreSnowdread", "slingSnowdread", "catapultSnowdread", "dartSnowdread"];
			Class.gladiusSnowdread.UPGRADES_TIER_0 = ["bladeSnowdread"];
				Class.bladeSnowdread.UPGRADES_TIER_0 = ["rapierSnowdread"];
					Class.rapierSnowdread.UPGRADES_TIER_0 = [];
			Class.sabreSnowdread.UPGRADES_TIER_0 = ["bayonetSnowdread"];
				Class.bayonetSnowdread.UPGRADES_TIER_0 = ["javelinSnowdread"];
					Class.javelinSnowdread.UPGRADES_TIER_0 = [];
			Class.slingSnowdread.UPGRADES_TIER_0 = ["atlatlSnowdread"];
				Class.atlatlSnowdread.UPGRADES_TIER_0 = ["woomeraSnowdread"];
					Class.woomeraSnowdread.UPGRADES_TIER_0 = [];
			Class.catapultSnowdread.UPGRADES_TIER_0 = ["ballistaSnowdread"];
				Class.ballistaSnowdread.UPGRADES_TIER_0 = ["trebuchetSnowdread"];
					Class.trebuchetSnowdread.UPGRADES_TIER_0 = [];
			Class.dartSnowdread.UPGRADES_TIER_0 = ["barbSnowdread"];
				Class.barbSnowdread.UPGRADES_TIER_0 = ["boltSnowdread"];
					Class.boltSnowdread.UPGRADES_TIER_0 = [];

		Class.pacifierSnowdread.UPGRADES_TIER_0 = ["mediatorSnowdread", "negotiatorSnowdread", "melderSnowdread", "crackerSnowdread", "grabberSnowdread"];
			Class.mediatorSnowdread.UPGRADES_TIER_0 = ["mitigatorSnowdread"];
				Class.mitigatorSnowdread.UPGRADES_TIER_0 = ["diplomatSnowdread"];
					Class.diplomatSnowdread.UPGRADES_TIER_0 = [];
			Class.negotiatorSnowdread.UPGRADES_TIER_0 = ["appeaserSnowdread"];
				Class.appeaserSnowdread.UPGRADES_TIER_0 = ["arbitratorSnowdread"];
					Class.arbitratorSnowdread.UPGRADES_TIER_0 = [];
			Class.melderSnowdread.UPGRADES_TIER_0 = ["amalgamSnowdread"];
				Class.amalgamSnowdread.UPGRADES_TIER_0 = ["dissolverSnowdread"];
					Class.dissolverSnowdread.UPGRADES_TIER_0 = [];
			Class.crackerSnowdread.UPGRADES_TIER_0 = ["breakerSnowdread"];
				Class.breakerSnowdread.UPGRADES_TIER_0 = ["eroderSnowdread"];
					Class.eroderSnowdread.UPGRADES_TIER_0 = [];
			Class.grabberSnowdread.UPGRADES_TIER_0 = ["clasperSnowdread"];
				Class.clasperSnowdread.UPGRADES_TIER_0 = ["gripperSnowdread"];
					Class.gripperSnowdread.UPGRADES_TIER_0 = [];

		Class.peacekeeperSnowdread.UPGRADES_TIER_0 = ["enforcerSnowdread", "executorSnowdread", "doserSnowdread", "swirlSnowdread", "pelterSnowdread"];
			Class.enforcerSnowdread.UPGRADES_TIER_0 = ["suppressorSnowdread"];
				Class.suppressorSnowdread.UPGRADES_TIER_0 = ["retardantSnowdread"];
					Class.retardantSnowdread.UPGRADES_TIER_0 = [];
			Class.executorSnowdread.UPGRADES_TIER_0 = ["inhibitorSnowdread"];
				Class.inhibitorSnowdread.UPGRADES_TIER_0 = ["tyrantSnowdread"];
					Class.tyrantSnowdread.UPGRADES_TIER_0 = [];
			Class.doserSnowdread.UPGRADES_TIER_0 = ["tranquilizerSnowdread"];
				Class.tranquilizerSnowdread.UPGRADES_TIER_0 = ["anesthesiologistSnowdread"];
					Class.anesthesiologistSnowdread.UPGRADES_TIER_0 = [];
			Class.swirlSnowdread.UPGRADES_TIER_0 = ["spiralSnowdread"];
				Class.spiralSnowdread.UPGRADES_TIER_0 = ["helixSnowdread"];
					Class.helixSnowdread.UPGRADES_TIER_0 = [];
			Class.pelterSnowdread.UPGRADES_TIER_0 = ["shellerSnowdread"];
				Class.shellerSnowdread.UPGRADES_TIER_0 = ["bombardmentSnowdread"];
					Class.bombardmentSnowdread.UPGRADES_TIER_0 = [];

		Class.invaderSnowdread.UPGRADES_TIER_0 = ["inquisitorSnowdread", "assailantSnowdread", "radiationSnowdread", "boxerSnowdread", "disablerSnowdread"];
			Class.inquisitorSnowdread.UPGRADES_TIER_0 = ["infiltratorSnowdread"];
				Class.infiltratorSnowdread.UPGRADES_TIER_0 = ["raiderSnowdread"];
					Class.raiderSnowdread.UPGRADES_TIER_0 = [];
			Class.assailantSnowdread.UPGRADES_TIER_0 = ["aggressorSnowdread"];
				Class.aggressorSnowdread.UPGRADES_TIER_0 = ["gladiatorSnowdread"];
					Class.gladiatorSnowdread.UPGRADES_TIER_0 = [];
			Class.radiationSnowdread.UPGRADES_TIER_0 = ["haloSnowdread"];
				Class.haloSnowdread.UPGRADES_TIER_0 = ["starlightSnowdread"];
					Class.starlightSnowdread.UPGRADES_TIER_0 = [];
			Class.boxerSnowdread.UPGRADES_TIER_0 = ["sluggerSnowdread"];
				Class.sluggerSnowdread.UPGRADES_TIER_0 = ["bruiserSnowdread"];
					Class.bruiserSnowdread.UPGRADES_TIER_0 = [];
			Class.disablerSnowdread.UPGRADES_TIER_0 = ["debilitatorSnowdread"];
				Class.debilitatorSnowdread.UPGRADES_TIER_0 = ["incapacitatorSnowdread"];
					Class.incapacitatorSnowdread.UPGRADES_TIER_0 = [];

		Class.centaurSnowdread.UPGRADES_TIER_0 = ["daemonSnowdread", "minotaurSnowdread", "cleanerSnowdread", "shadeSnowdread", "screwdriverSnowdread"];
			Class.daemonSnowdread.UPGRADES_TIER_0 = ["hydraSnowdread"];
				Class.hydraSnowdread.UPGRADES_TIER_0 = ["cerberusSnowdread"];
					Class.cerberusSnowdread.UPGRADES_TIER_0 = [];
			Class.minotaurSnowdread.UPGRADES_TIER_0 = ["beelzebubSnowdread"];
				Class.beelzebubSnowdread.UPGRADES_TIER_0 = ["luciferSnowdread"];
					Class.luciferSnowdread.UPGRADES_TIER_0 = [];
			Class.cleanerSnowdread.UPGRADES_TIER_0 = ["sweeperSnowdread"];
				Class.sweeperSnowdread.UPGRADES_TIER_0 = ["sterilizerSnowdread"];
					Class.sterilizerSnowdread.UPGRADES_TIER_0 = [];
			Class.shadeSnowdread.UPGRADES_TIER_0 = ["aegisSnowdread"];
				Class.aegisSnowdread.UPGRADES_TIER_0 = ["hielamanSnowdread"];
					Class.hielamanSnowdread.UPGRADES_TIER_0 = [];
			Class.screwdriverSnowdread.UPGRADES_TIER_0 = ["drillSnowdread"];
				Class.drillSnowdread.UPGRADES_TIER_0 = ["jackhammerSnowdread"];
					Class.jackhammerSnowdread.UPGRADES_TIER_0 = [];

	Class.dreadBodySnowdread.UPGRADES_TIER_0 = ["byteSnowdread", "showerSnowdread", "atmosphereSnowdread", "juggernautSnowdread", "stomperSnowdread", "dropperSnowdread", "spotterSnowdread"];

		Class.byteSnowdread.UPGRADES_TIER_0 = ["automationSnowdread", "kilobyteSnowdread", "lighterSnowdread"];

			Class.automationSnowdread.UPGRADES_TIER_0 = ["mechanismSnowdread", "fusionSnowdread", "binarySnowdread", "exosphereSnowdread", "burgSnowdread", "batonSnowdread"];
				Class.mechanismSnowdread.UPGRADES_TIER_0 = ["skynetSnowdread"];
					Class.skynetSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("skynetSnowdread")];
				Class.fusionSnowdread.UPGRADES_TIER_0 = ["supernovaSnowdread"];
					Class.supernovaSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("supernovaSnowdread")];
				Class.binarySnowdread.UPGRADES_TIER_0 = ["cipherSnowdread"];
					Class.cipherSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("cipherSnowdread")];
				Class.exosphereSnowdread.UPGRADES_TIER_0 = ["interstellarSnowdread"];
					Class.interstellarSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("interstellarSnowdread")];
				Class.burgSnowdread.UPGRADES_TIER_0 = ["bunkerSnowdread"];
					Class.bunkerSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("bunkerSnowdread")];
				Class.batonSnowdread.UPGRADES_TIER_0 = ["maceSnowdread"];
					Class.maceSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("maceSnowdread")];

			Class.kilobyteSnowdread.UPGRADES_TIER_0 = ["megabyteSnowdread", "binarySnowdread", "trojanSnowdread", "hardwareSnowdread", "siloSnowdread", "fireworkSnowdread"];
				Class.megabyteSnowdread.UPGRADES_TIER_0 = ["gigabyteSnowdread"];
					Class.gigabyteSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("gigabyteSnowdread")];
				// Class.binarySnowdread.UPGRADES_TIER_0 = ["cipherSnowdread"];
				Class.trojanSnowdread.UPGRADES_TIER_0 = ["malwareSnowdread"];
					Class.malwareSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("malwareSnowdread")];
				Class.hardwareSnowdread.UPGRADES_TIER_0 = ["softwareSnowdread"];
					Class.softwareSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("softwareSnowdread")];
				Class.siloSnowdread.UPGRADES_TIER_0 = ["arsenalSnowdread"];
					Class.arsenalSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("arsenalSnowdread")];
				Class.fireworkSnowdread.UPGRADES_TIER_0 = ["missileSnowdread"];
					Class.missileSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("missileSnowdread")];
				
			Class.lighterSnowdread.UPGRADES_TIER_0 = ["burnerSnowdread"];
				Class.burnerSnowdread.UPGRADES_TIER_0 = ["roasterSnowdread"];
					Class.roasterSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("roasterSnowdread")];

		Class.showerSnowdread.UPGRADES_TIER_0 = ["stormSnowdread"];
			Class.stormSnowdread.UPGRADES_TIER_0 = ["tempestSnowdread"];
				Class.tempestSnowdread.UPGRADES_TIER_0 = ["monsoonSnowdread"];
					Class.monsoonSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("monsoonSnowdread")];

		Class.atmosphereSnowdread.UPGRADES_TIER_0 = ["coronaSnowdread", "thermosphereSnowdread"];

			Class.coronaSnowdread.UPGRADES_TIER_0 = ["chromosphereSnowdread", "fusionSnowdread", "trojanSnowdread", "planetSnowdread", "sirenSnowdread", "towerSnowdread"];
				Class.chromosphereSnowdread.UPGRADES_TIER_0 = ["photosphereSnowdread"];
					Class.photosphereSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("photosphereSnowdread")];
				// Class.fusionSnowdread.UPGRADES_TIER_0 = ["supernovaSnowdread"];
				// Class.trojanSnowdread.UPGRADES_TIER_0 = ["malwareSnowdread"];
				Class.planetSnowdread.UPGRADES_TIER_0 = ["astronomicSnowdread"];
					Class.astronomicSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("astronomicSnowdread")];
				Class.sirenSnowdread.UPGRADES_TIER_0 = ["valrayvnSnowdread"];
					Class.valrayvnSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("valrayvnSnowdread")];
				Class.towerSnowdread.UPGRADES_TIER_0 = ["mountainSnowdread"];
					Class.mountainSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("mountainSnowdread")];

			Class.thermosphereSnowdread.UPGRADES_TIER_0 = ["mesosphereSnowdread", "exosphereSnowdread", "hardwareSnowdread", "moonSnowdread", "harpySnowdread", "creatureSnowdread"];
				Class.mesosphereSnowdread.UPGRADES_TIER_0 = ["stratosphereSnowdread"];
					Class.stratosphereSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("stratosphereSnowdread")];
				// Class.exosphereSnowdread.UPGRADES_TIER_0 = ["interstellarSnowdread"];
				// Class.hardwareSnowdread.UPGRADES_TIER_0 = ["softwareSnowdread"];
				Class.moonSnowdread.UPGRADES_TIER_0 = ["grandioseSnowdread"];
					Class.grandioseSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("grandioseSnowdread")];
				Class.harpySnowdread.UPGRADES_TIER_0 = ["pegasusSnowdread"];
					Class.pegasusSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("pegasusSnowdread")];
				Class.creatureSnowdread.UPGRADES_TIER_0 = ["beastSnowdread"];
					Class.beastSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("beastSnowdread")];

		Class.juggernautSnowdread.UPGRADES_TIER_0 = ["jumboSnowdread", "colossusSnowdread", "cottonSnowdread", "ironSnowdread"];

			Class.jumboSnowdread.UPGRADES_TIER_0 = ["goliathSnowdread", "planetSnowdread", "moonSnowdread", "burgSnowdread", "siloSnowdread", "armadaSnowdread"];
				Class.goliathSnowdread.UPGRADES_TIER_0 = ["behemothSnowdread"];
					Class.behemothSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("behemothSnowdread")];
				// Class.planetSnowdread.UPGRADES_TIER_0 = ["astronomicSnowdread"];
				// Class.moonSnowdread.UPGRADES_TIER_0 = ["grandioseSnowdread"];
				// Class.burgSnowdread.UPGRADES_TIER_0 = ["bunkerSnowdread"];
				// Class.siloSnowdread.UPGRADES_TIER_0 = ["arsenalSnowdread"];
				Class.armadaSnowdread.UPGRADES_TIER_0 = ["battalionSnowdread"];
					Class.battalionSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("battalionSnowdread")];

			Class.colossusSnowdread.UPGRADES_TIER_0 = ["titanSnowdread", "sirenSnowdread", "harpySnowdread", "batonSnowdread", "fireworkSnowdread", "armadaSnowdread"];
				Class.titanSnowdread.UPGRADES_TIER_0 = ["leviathanSnowdread"];
					Class.leviathanSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("leviathanSnowdread")];
				// Class.sirenSnowdread.UPGRADES_TIER_0 = ["valrayvnSnowdread"];
				// Class.harpySnowdread.UPGRADES_TIER_0 = ["pegasusSnowdread"];
				// Class.batonSnowdread.UPGRADES_TIER_0 = ["maceSnowdread"];
				// Class.fireworkSnowdread.UPGRADES_TIER_0 = ["missileSnowdread"];
				// Class.armadaSnowdread.UPGRADES_TIER_0 = ["battalionSnowdread"];

			Class.cottonSnowdread.UPGRADES_TIER_0 = ["featherSnowdread"];
				Class.featherSnowdread.UPGRADES_TIER_0 = ["wispSnowdread"];
					Class.wispSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("wispSnowdread")];

			Class.ironSnowdread.UPGRADES_TIER_0 = ["steelSnowdread"];
				Class.steelSnowdread.UPGRADES_TIER_0 = ["titaniumSnowdread"];
					Class.titaniumSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("titaniumSnowdread")];
		
		Class.stomperSnowdread.UPGRADES_TIER_0 = ["rollerSnowdread", "owlSnowdread"];

			Class.rollerSnowdread.UPGRADES_TIER_0 = ["flattenerSnowdread", "towerSnowdread", "creatureSnowdread", "spotlightSnowdread", "furnaceSnowdread", "asteroidSnowdread"];
				Class.flattenerSnowdread.UPGRADES_TIER_0 = ["crusherSnowdread"];
					Class.crusherSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("crusherSnowdread")];
				// Class.towerSnowdread.UPGRADES_TIER_0 = ["mountainSnowdread"];
				// Class.creatureSnowdread.UPGRADES_TIER_0 = ["beastSnowdread"];
				Class.spotlightSnowdread.UPGRADES_TIER_0 = ["luminanceSnowdread"];
					Class.luminanceSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("luminanceSnowdread")];
				Class.furnaceSnowdread.UPGRADES_TIER_0 = ["foundrySnowdread"];
					Class.foundrySnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("foundrySnowdread")];
				Class.asteroidSnowdread.UPGRADES_TIER_0 = ["planetoidSnowdread"];
					Class.planetoidSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("planetoidSnowdread")];

			Class.owlSnowdread.UPGRADES_TIER_0 = ["cardinalSnowdread"];
				Class.cardinalSnowdread.UPGRADES_TIER_0 = ["finchSnowdread"];
					Class.finchSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("finchSnowdread")];

		Class.dropperSnowdread.UPGRADES_TIER_0 = ["baiterSnowdread"];
			Class.baiterSnowdread.UPGRADES_TIER_0 = ["cagerSnowdread"];
				Class.cagerSnowdread.UPGRADES_TIER_0 = ["hoarderSnowdread"];
					Class.hoarderSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("hoarderSnowdread")];

		Class.spotterSnowdread.UPGRADES_TIER_0 = ["spySnowdread"];
			Class.spySnowdread.UPGRADES_TIER_0 = ["monitorSnowdread"];
				Class.monitorSnowdread.UPGRADES_TIER_0 = ["trackerSnowdread"];
					Class.trackerSnowdread.UPGRADES_TIER_0 = [makeHexnoughtBodyV2("trackerSnowdread")];

const hexDreadNames = {
	Javelin: {
		Javelin: 'Javelin',
		Rapier: 'Lance',
		Woomera: 'Shikari',
		Trebuchet: 'Ballista',
		Bolt: 'Tomahawk',
		Diplomat: 'Envoy',
		Arbitrator: 'Cutlass',
		Dissolver: 'Hellfire',
		Eroder: 'Partisan',
		Gripper: 'Encircler',
		Retardant: 'Rebel',
		Tyrant: 'Autocrat',
		Anesthesiologist: 'Patriot',
		Helix: 'Stinger',
		Bombardment: 'Downpour',
		Raider: 'Pirate',
		Gladiator: 'Pillager',
		Starlight: 'Hornet',
		Bruiser: 'Felon',
		Incapacitator: 'Stretcher',
		Cerberus: 'Argonaut',
		Lucifer: 'Kitsune',
		Sterilizer: 'Mastermind',
		Hielaman: 'Swordsman', 
		Jackhammer: 'Fissure',
	},
	Rapier: {
		Rapier: 'Rapier',
		Woomera: 'Cavalier',
		Trebuchet: 'Katana',
		Bolt: 'Claymore',
		Diplomat: 'Emissary',
		Arbitrator: 'Umpire',
		Dissolver: 'Relocator',
		Eroder: 'Debris',
		Gripper: 'Interrogator',
		Retardant: 'Impeder',
		Tyrant: 'Oppressor',
		Anesthesiologist: 'Slumberer',
		Helix: 'Vortex',
		Bombardment: 'Butcher',
		Raider: 'Bandit',
		Gladiator: 'Injurer',
		Starlight: 'Radiance',
		Bruiser: 'Ringster',
		Incapacitator: 'Swamper',
		Cerberus: 'Cyclops',
		Lucifer: 'Damocles',
		Sterilizer: 'Sanitizer',
		Hielaman: 'Escutcheon', 
		Jackhammer: 'Borer',
	},
	Woomera: {
		Woomera: 'Woomera',
		Trebuchet: 'Cannonball',
		Bolt: 'Piercer', // Soap
		Diplomat: 'Contractor',
		Arbitrator: 'Spirit',
		Dissolver: 'Venom',
		Eroder: 'Decomposer',
		Gripper: 'Crucifier',
		Retardant: 'Overrunner',
		Tyrant: 'Revolutionary',
		Anesthesiologist: 'Guerilla',
		Helix: 'Cultivator',
		Bombardment: 'Incendiary',
		Raider: 'Dispatcher', // Soap
		Gladiator: 'Pugilist',
		Starlight: 'Starborne',
		Bruiser: 'Soldier',
		Incapacitator: 'Scavenger', // Soap
		Cerberus: 'Poltergeist',
		Lucifer: 'Hunkerer',
		Sterilizer: 'Janitor',
		Hielaman: 'Reinforcer', 
		Jackhammer: 'Pyroclastic',
	},
	Trebuchet: {
		Trebuchet: 'Trebuchet',
		Bolt: 'Archer',
		Diplomat: 'Sherman',
		Arbitrator: 'Ultimatum',
		Dissolver: 'Grapeshot',
		Eroder: 'Shrapnel',
		Gripper: 'Razer',
		Retardant: 'Mangonel',
		Tyrant: 'Incarcerator', // Zenphia
		Anesthesiologist: 'Evacuator',
		Helix: 'Hurricane',
		Bombardment: 'Surrenderer',
		Raider: 'Capitulator',
		Gladiator: 'Uprising',
		Starlight: 'Magnetar',
		Bruiser: 'Crumpler',
		Incapacitator: 'Pinner',
		Cerberus: 'Phantom', // Umbra
		Lucifer: 'Sisyphus',
		Sterilizer: 'Operation',
		Hielaman: 'Entrencher', 
		Jackhammer: 'Demolitionist',
	},
	Bolt: {
		Bolt: 'Bolt',
		Diplomat: 'Informant',
		Arbitrator: 'Assaulter',
		Dissolver: 'Sprinter',
		Eroder: 'Discharger', // Soap
		Gripper: 'Lightning',
		Retardant: 'Evicter',
		Tyrant: 'Minister',
		Anesthesiologist: 'Ambusher',
		Helix: 'Ultraviolet',
		Bombardment: 'Dynamo',
		Raider: 'Infector',
		Gladiator: 'Blinder',
		Starlight: 'Neutrino',
		Bruiser: 'Impactor',
		Incapacitator: 'Volt',
		Cerberus: 'Collapse',
		Lucifer: 'Barycenter',
		Sterilizer: 'Greenhouse',
		Hielaman: 'Nebula', 
		Jackhammer: 'Archaeologist',
	},
	Diplomat: {
		Diplomat: 'Diplomat',
		Arbitrator: 'Moderator',
		Dissolver: 'Impaler', // Soap
		Eroder: 'Vulcan',
		Gripper: 'Politician',
		Retardant: 'Insurgent',
		Tyrant: 'Dictator',
		Anesthesiologist: 'Transporter',
		Helix: 'Signature',
		Bombardment: 'Berserker', // Soap
		Raider: 'Marauder',
		Gladiator: 'Champion',
		Starlight: 'Comet',
		Bruiser: 'Ambassador',
		Incapacitator: 'Erebus', // Yharon
		Cerberus: 'Orion',
		Lucifer: 'Manticore',
		Sterilizer: 'Officer',
		Hielaman: 'Investigator', 
		Jackhammer: 'Devourer', // Soap
	},
	Arbitrator: {
		Arbitrator: 'Arbitrator',
		Dissolver: 'Bargainer',
		Eroder: 'Stipulator',
		Gripper: 'Adjudicator',
		Retardant: 'Extinguisher',
		Tyrant: 'Shogun',
		Anesthesiologist: 'Brute',
		Helix: 'Referee',
		Bombardment: 'Jury',
		Raider: 'Buccaneer',
		Gladiator: 'Warrior',
		Starlight: 'Genesis', // Siece
		Bruiser: 'Terminator', // Soap
		Incapacitator: 'Debater',
		Cerberus: 'Gorgon',
		Lucifer: 'Keres',
		Sterilizer: 'Warden',
		Hielaman: 'Crusader', 
		Jackhammer: 'Excavator',
	},
	Dissolver: {
		Dissolver: 'Dissolver',
		Eroder: 'Current',
		Gripper: 'Patronizer',
		Retardant: 'Corroder',
		Tyrant: 'Throne',
		Anesthesiologist: 'Neurotoxin',
		Helix: 'Solution',
		Bombardment: 'Chlorine',
		Raider: 'Traitor',
		Gladiator: 'Abolitionist',
		Starlight: 'Accretion',
		Bruiser: 'Piranha',
		Incapacitator: 'Sandstorm',
		Cerberus: 'Appalachian',
		Lucifer: 'Styx',
		Sterilizer: 'Peroxide',
		Hielaman: 'Frontier', 
		Jackhammer: 'Fracker',
	},
	Eroder: {
		Eroder: 'Eroder',
		Gripper: 'Psychologist',
		Retardant: 'Shatterer',
		Tyrant: 'Crackdown',
		Anesthesiologist: 'Torrent',
		Helix: 'Tornado',
		Bombardment: 'Backstabber',
		Raider: 'Militant', // Umbra
		Gladiator: 'Vitrifier',
		Starlight: 'Stardust',
		Bruiser: 'Gasher', // Soap
		Incapacitator: 'Lacerator', // Soap
		Cerberus: 'Inevitability',
		Lucifer: 'Fragment',
		Sterilizer: 'Cynic',
		Hielaman: 'Polisher', 
		Jackhammer: 'Hoser',
	},
	Gripper: {
		Gripper: 'Gripper',
		Retardant: 'Arrestor',
		Tyrant: 'Tormentor', // Soap
		Anesthesiologist: 'Experimenter',
		Helix: 'Blockader',
		Bombardment: 'Striker',
		Raider: 'Warmongerer', // Umbra
		Gladiator: 'Throwdown',
		Starlight: 'Cryogen',
		Bruiser: 'Knockout',
		Incapacitator: 'Restrainer',
		Cerberus: 'Prometheus',
		Lucifer: 'Mortician',
		Sterilizer: 'Cleanser',
		Hielaman: 'Periscope', 
		Jackhammer: 'Vice',
	},
	Retardant: {
		Retardant: 'Retardant',
		Tyrant: 'Anarchist',
		Anesthesiologist: 'Buckshot', // Soap
		Helix: 'Magnetron',
		Bombardment: 'Sergeant',
		Raider: 'Freebooter',
		Gladiator: 'Combatant',
		Starlight: 'Apparition',
		Bruiser: 'Executioner', // Soap
		Incapacitator: 'Smotherer',
		Cerberus: 'Gigantes',
		Lucifer: 'Demogorgon',
		Sterilizer: 'Fumigator',
		Hielaman: 'Avalanche', 
		Jackhammer: 'Propagator',
	},
	Tyrant: {
		Tyrant: 'Tyrant',
		Anesthesiologist: 'Barbarian',
		Helix: 'Nautilus',
		Bombardment: 'Admiral',
		Raider: 'Corsair',
		Gladiator: 'Amazon',
		Starlight: 'Theocrat',
		Bruiser: 'Authoritarian',
		Incapacitator: 'Jailkeeper',
		Cerberus: 'Ouroboros',
		Lucifer: 'Raiju',
		Sterilizer: 'Purifier',
		Hielaman: 'Protectorate', 
		Jackhammer: 'Detailer',
	},
	Anesthesiologist: {
		Anesthesiologist: 'Anesthesiologist',
		Helix: 'Blizzard',
		Bombardment: 'Nightmare',
		Raider: 'Vaccinator',
		Gladiator: 'Harbinger', // Siece
		Starlight: 'Hypnotizer',
		Bruiser: 'Tactician',
		Incapacitator: 'Psychic', // Soap
		Cerberus: 'Revenant',
		Lucifer: 'Rehabilitator',
		Sterilizer: 'Pestilence',
		Hielaman: 'Heater', 
		Jackhammer: 'Sledgehammer',
	},
	Helix: {
		Helix: 'Helix',
		Bombardment: 'Derecho',
		Raider: 'Deliverer',
		Gladiator: 'Constrictor',
		Starlight: 'Orbit',
		Bruiser: 'Cobra',
		Incapacitator: 'Windfall',
		Cerberus: 'Viper',
		Lucifer: 'Taipan',
		Sterilizer: 'Networker',
		Hielaman: 'Turbine', 
		Jackhammer: 'Spindler',
	},
	Bombardment: {
		Bombardment: 'Bombardment',
		Raider: 'Specialist',
		Gladiator: 'Leonidas',
		Starlight: 'Meteor',
		Bruiser: 'Grenadier',
		Incapacitator: 'Shellshocker',
		Cerberus: 'Deluge',
		Lucifer: 'Containment',
		Sterilizer: 'Haven',
		Hielaman: 'Ballistic', 
		Jackhammer: 'Mallet', // Soap
	},
	Raider: {
		Raider: 'Raider',
		Gladiator: 'Filibuster',
		Starlight: 'Colonizer',
		Bruiser: 'Plunderer', // Umbra
		Incapacitator: 'Blitzkrieg',
		Cerberus: 'Wyvern',
		Lucifer: 'Kraken',
		Sterilizer: 'Splatterer',
		Hielaman: 'Strategist', 
		Jackhammer: 'Extractor',
	},
	Gladiator: {
		Gladiator: 'Gladiator',
		Starlight: 'Enveloper',
		Bruiser: 'Fistfighter',
		Incapacitator: 'Overloader', // Umbra
		Cerberus: 'Ogre',
		Lucifer: 'Wendigo',
		Sterilizer: 'Garrison', // Umbra
		Hielaman: 'Uziel', // Zenphia
		Jackhammer: 'Warlord',
	},
	Starlight: {
		Starlight: 'Starlight',
		Bruiser: 'Wanderer',
		Incapacitator: 'Starstruck',
		Cerberus: 'Constellation',
		Lucifer: 'Galaxy',
		Sterilizer: 'Evaporator',
		Hielaman: 'Protostar', 
		Jackhammer: 'Illuminator',
	},
	Bruiser: {
		Bruiser: 'Bruiser',
		Incapacitator: 'Mauler',
		Cerberus: 'Serpent',
		Lucifer: 'Trident',
		Sterilizer: 'Suture',
		Hielaman: 'Heavyweight', 
		Jackhammer: 'Stapler',
	},
	Incapacitator: {
		Incapacitator: 'Incapacitator',
		Cerberus: 'Opportunist',
		Lucifer: 'Condemner',
		Sterilizer: 'Poisoner',
		Hielaman: 'Eyrie', 
		Jackhammer: 'Thrasher', // Soap
	},
	Cerberus: {
		Cerberus: 'Cerberus',
		Lucifer: 'Oni',
		Sterilizer: 'Antibody',
		Hielaman: 'Typhon', 
		Jackhammer: 'Paver',
	},
	Lucifer: {
		Lucifer: 'Lucifer',
		Sterilizer: 'Lipid',
		Hielaman: 'Insulator', 
		Jackhammer: 'Earthquaker',
	},
	Sterilizer: {
		Sterilizer: 'Sterilizer',
		Hielaman: 'Homeland', 
		Jackhammer: 'Bulldozer',
	},
	Hielaman: {
		Hielaman: 'Hielaman', 
		Jackhammer: 'Compactor',
	},
	Jackhammer: {
		Jackhammer: 'Jackhammer',
	},
};

function mergeHexnoughtWeaponV2(weapon1, weapon2) {
	weapon1 = ensureIsClass(Class, weapon1);
	weapon2 = ensureIsClass(Class, weapon2);

	let PARENT = Class.genericHexnoughtSnowdread,
		BODY = JSON.parse(JSON.stringify(PARENT.BODY)),
		GUNS = [],
		gunsOnOneSide = [],
		weapon2GunsOnOneSide = [],
		TURRETS = [],
		turretsOnOneSide = [],
		weapon2TurretsOnOneSide = [],
		CONTROLLERS = weapon2.CONTROLLERS,
		UPGRADE_TOOLTIP = weapon1.UPGRADE_TOOLTIP + " + " + weapon2.UPGRADE_TOOLTIP;

	// Label
	let name1 = hexDreadNames[weapon1.LABEL][weapon2.LABEL],
		name2 = hexDreadNames[weapon2.LABEL][weapon1.LABEL],
		weaponName = weapon1.LABEL + weapon2.LABEL,
		orientationId = 0;
	if (name1) {
		weaponName = name1;
	} else if (name2) {
		weaponName = name2,
		orientationId = 1;
	}
	let LABEL = weaponName,
		className = weapon1.LABEL.toLowerCase() + weapon2.LABEL + orientationId + "Snowdread";

	// Upgrade Tooltip
	if (weapon1.LABEL == weapon2.LABEL) UPGRADE_TOOLTIP = weapon1.UPGRADE_TOOLTIP;
	
	// Guns ----------------------
	if (weapon1.GUNS) gunsOnOneSide.push(...JSON.parse(JSON.stringify(weapon1.GUNS.slice(0, weapon1.GUNS.length / 5))));
	if (weapon2.GUNS) weapon2GunsOnOneSide = JSON.parse(JSON.stringify(weapon2.GUNS.slice(0, weapon2.GUNS.length / 5)));

	for (let g in weapon2GunsOnOneSide) weapon2GunsOnOneSide[g].POSITION[5] += 60;
	gunsOnOneSide.push(...weapon2GunsOnOneSide)

	// Turrets -------------------
	if (weapon1.TURRETS) turretsOnOneSide.push(...JSON.parse(JSON.stringify(weapon1.TURRETS.slice(0, weapon1.TURRETS.length / 5))));
	if (weapon2.TURRETS) weapon2TurretsOnOneSide = JSON.parse(JSON.stringify(weapon2.TURRETS.slice(0, weapon2.TURRETS.length / 5)));

	for (let t in weapon2TurretsOnOneSide) weapon2TurretsOnOneSide[t].POSITION[3] += 60;
	turretsOnOneSide.push(...weapon2TurretsOnOneSide)

	// Scale to fit size constraints
	for (let g in gunsOnOneSide) {
		gunsOnOneSide[g].POSITION[1] *= hexnoughtScaleFactor ** 2;
		gunsOnOneSide[g].POSITION[4] *= hexnoughtScaleFactor ** 2;
	}

	for (let t in turretsOnOneSide) {
		turretsOnOneSide[t].POSITION[0] *= hexnoughtScaleFactor ** 2;
	}

	for (let i = 0; i < 3; i++) {
		for (let g in gunsOnOneSide) {
			let gun = JSON.parse(JSON.stringify(gunsOnOneSide[g]));
			gun.POSITION[5] += 120 * i;
			GUNS.push(gun);
		}
		for (let t in turretsOnOneSide) {
			let turret = JSON.parse(JSON.stringify(turretsOnOneSide[t]));
			turret.POSITION[3] += 120 * i;
			TURRETS.push(turret);
		}
	};

	// Gladiator
	if (weapon1.LABEL == "Gladiator" || weapon2.LABEL == "Gladiator") {
		let droneSpawnerIndex = 0
		for (let g in GUNS) {
			let gun = GUNS[g];
			if (gun.PROPERTIES && gun.PROPERTIES.TYPE == "gladiatorTritankMinionSnowdread") {
				switch (droneSpawnerIndex) {
					case 1:
						gun.PROPERTIES.TYPE = "gladiatorTritrapMinionSnowdread";
						break;
					case 2:
						gun.PROPERTIES.TYPE = "gladiatorTriswarmMinionSnowdread";
						break;
					case 3:
						gun.PROPERTIES.TYPE = "gladiatorAutoMinionSnowdread";
						break;
					case 4:
						gun.PROPERTIES.TYPE = "gladiatorAuraMinionSnowdread";
						break;
					case 5:
						gun.PROPERTIES.TYPE = "gladiatorHealAuraMinionSnowdread";
						break;
				}
				droneSpawnerIndex++;
			}
		}
	}
	
	// Body stat modification
	if (weapon1.BODY) for (let m in weapon1.BODY) BODY[m] *= weapon1.BODY[m];
	if (weapon2.BODY) for (let m in weapon2.BODY) BODY[m] *= weapon2.BODY[m];

	// Smash it together
	Class[className] = {
		PARENT, BODY, LABEL, UPGRADE_TOOLTIP, GUNS, TURRETS, CONTROLLERS
	};
	return className;
}

function makeHexnoughtBodyV2(body) {
	if (!buildHexnoughts) return;
	
	body = ensureIsClass(Class, body);

	let PARENT = Class.genericHexnoughtSnowdread,
		SIZE = body.SIZE ?? 1,
		BODY = {},
		GUNS = body.GUNS ?? [],
		TURRETS = [],
		LABEL = body.LABEL,
		UPGRADE_TOOLTIP = body.UPGRADE_TOOLTIP;

	// Label
	let className = LABEL.toLowerCase() + "HexSnowdread";
	
	// Turrets --------------------
	let turretRingLoopLength = Math.floor(body.TURRETS.length / 5);

	// Turret adding
	for (let t = 0; t < body.TURRETS.length; t++) {
		let turret = body.TURRETS[t];
		if (turret.TYPE[0].indexOf('pentagon') >= 0) { // Replace pentagons with hexagons
			TURRETS.push(
				{
					POSITION: [turret.POSITION[0], 0, 0, turret.POSITION[3], turret.POSITION[4], turret.POSITION[5]],
					TYPE: ['hexagon' + turret.TYPE[0].substring(8), turret.TYPE[1] ?? {}],
				}
			);
		} else if (turret.POSITION[1]) { // Do whole turret loop at once
			for (let i = 0; i < turretRingLoopLength; i++) {
				for (let j = 0; j < 6; j++) {
					turret = body.TURRETS[t + i * 5];
					TURRETS.push(
						{
							POSITION: [turret.POSITION[0] * hexnoughtScaleFactor, turret.POSITION[1] * hexnoughtScaleFactor ** 0.5, turret.POSITION[2], turret.POSITION[3] / 6 * 5 + 60 * j, turret.POSITION[4], turret.POSITION[5]],
							TYPE: turret.TYPE,
						}
					)
				}
			}
			t += 5 * turretRingLoopLength - 1;
		} else { // Centered turrets
			TURRETS.push(
				{
					POSITION: [turret.POSITION[0] * hexnoughtScaleFactor ** 0.5, 0, 0, turret.POSITION[3], turret.POSITION[4], turret.POSITION[5]],
					TYPE: turret.TYPE,
				}
			) 
		}
	}
	
	// Body stat modification
	if (body.BODY) for (let m in body.BODY) BODY[m] = body.BODY[m];

	// Smash it together
	Class[className] = {
		PARENT, SIZE, BODY, LABEL, UPGRADE_TOOLTIP, GUNS, TURRETS,
	};
	return className;
}

// Merge hexdreads
const pentanoughtWeapons = [
							"rapierSnowdread",     "javelinSnowdread",     "woomeraSnowdread",           "trebuchetSnowdread",  "boltSnowdread",
							"diplomatSnowdread",   "arbitratorSnowdread",  "dissolverSnowdread",         "eroderSnowdread",     "gripperSnowdread",
							"retardantSnowdread",  "tyrantSnowdread",      "anesthesiologistSnowdread",  "helixSnowdread",      "bombardmentSnowdread",
							"raiderSnowdread",     "gladiatorSnowdread",   "starlightSnowdread",         "bruiserSnowdread",    "incapacitatorSnowdread",
							"cerberusSnowdread",   "luciferSnowdread",     "sterilizerSnowdread",        "hielamanSnowdread",   "jackhammerSnowdread",
							];
if(buildHexnoughts) {
	for (let i of pentanoughtWeapons) {
		for (let j of pentanoughtWeapons) {
			Class[i].UPGRADES_TIER_0.push(mergeHexnoughtWeaponV2(i, j));
		}
	}
}
