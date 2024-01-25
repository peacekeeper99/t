const { combineStats, menu } = require('../facilitators.js');
const { base } = require('../constants.js');

Class.spectator.CAN_GO_OUTSIDE_ROOM = true;
Class.fastSpectator = {
    PARENT: "spectator",
    LABEL: "Fast Spectator",
    BODY: {
        SPEED: 25,
        ACCELERATION: base.ACCEL * 5,
        FOV: 5,
    },
}
Class.superFastSpectator = {
    PARENT: "genericTank",
    LABEL: "Super Fast Spectator",
    BODY: {
        SPEED: 75,
        ACCELERATION: base.ACCEL * 10,
        FOV: 10,
    },
}

Class.snowtanksTesting = menu("SnowTesting");
Class.snowtanksTesting.SHAPE = -6;
Class.snowtanksTesting.COLOR = {BASE: 0, SATURATION_SHIFT: 0.7, BRIGHTNESS_SHIFT: 15};

Class.particleEmitterTest = {
    PARENT: 'genericTank',
    LABEL: "Particle Emitter Testing",
    COLOR: 6,
    PARTICLE_EMITTER: {
        RATE: 20,
        SIZE: 10,
        ALPHA: 0.6,
    }
}
Class.blinkerTest = {
    PARENT: 'genericTank',
    LABEL: "Blinker Testing",
    SHAPE: 4,
    COLOR: 16,
    SIZE: 20,
    GUNS: [],
}
for (let a = 0; a < 4; a++) {
    Class.blinkerTest.GUNS.push({
        POSITION: [2, 1, 1, 8.5, 0, 90 * a + 45, 0],
        PROPERTIES: {
            COLOR: 0,
            BORDERLESS: true,
            DRAW_ABOVE: true,
            BLINKER: {
                REPEAT: 700,
                START: 0,
                END: 350,
                OFF_COLOR: 17,
            }
        }
    })
    for (let i = 1; i < 3; i++) {
        Class.blinkerTest.GUNS.push({
            POSITION: [2, 1, 1, 8.5 - 1 * i, 1.5 * i, 90 * a + 45, 0],
            PROPERTIES: {
                COLOR: 0,
                BORDERLESS: true,
                DRAW_ABOVE: true,
                BLINKER: {
                    REPEAT: 700,
                    START: 100 * i,
                    END: 350 + 100 * i,
                    OFF_COLOR: 17,
                }
            }
        }, {
            POSITION: [2, 1, 1, 8.5 - 1 * i, -1.5 * i, 90 * a + 45, 0],
            PROPERTIES: {
                COLOR: 0,
                BORDERLESS: true,
                DRAW_ABOVE: true,
                BLINKER: {
                    REPEAT: 700,
                    START: 100 * i,
                    END: 350 + 100 * i,
                    OFF_COLOR: 17,
                }
            }
        })
    }
}

Class.spectator.UPGRADES_TIER_0 = ["spectator", "fastSpectator", "superFastSpectator"];
Class.fastSpectator.UPGRADES_TIER_0 = ["spectator", "fastSpectator", "superFastSpectator"];
Class.superFastSpectator.UPGRADES_TIER_0 = ["spectator", "fastSpectator", "superFastSpectator"];

Class.testing.UPGRADES_TIER_0.push('snowtanksTesting');
    Class.snowtanksTesting.UPGRADES_TIER_0 = ["particleEmitterTest", "blinkerTest"];
