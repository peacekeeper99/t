const { skillSet, menu, combineStats } = require('../facilitators.js');
const { base, statnames } = require('../constants.js');

const baseColor = '#50516e';
const bright1 = {BASE: baseColor, BRIGHTNESS_SHIFT: 7.5, SATURATION_SHIFT: 0.8};
const bright2 = {BASE: baseColor, BRIGHTNESS_SHIFT: 12.5, SATURATION_SHIFT: 0.55};
const dark1 = {BASE: baseColor, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 1.25};

const trim = '#cb52f7';

const shape3 = "M 0.78 -1.35 L -1.56 0 L -0.9 0 L -0.44 -0.26 L -0.35 -0.61 L 0 -0.51 L 0.45 -0.78 Z" +
            "M -1.56 0 L 0.78 1.35 L 0.45 0.78 L 0 0.51 L -0.35 0.61 L -0.44 0.26 L -0.9 0 Z" + 
            "M 0.78 1.35 L 0.78 -1.35 L 0.45 -0.78 L 0.45 -0.25 L 0.7 0 L 0.45 0.25 L 0.45 0.78 Z";
const insert3 = "M -0.7 0.11 L -0.39 0.18 L -0.35 0.61 L 0.04 0.43 L 0.25 0.66 L 0.04 0.54 L -0.5 0.87 L -0.48 0.24 Z" + 
            "M -0.7 -0.11 L -0.39 -0.18 L -0.35 -0.61 L 0.04 -0.43 L 0.25 -0.66 L 0.04 -0.54 L -0.5 -0.87 L -0.48 -0.24 Z" +
            "M 0.45 0.55 L 0.35 0.25 L 0.7 0 L 0.35 -0.25 L 0.45 -0.55 L 0.45 -0.3 L 1 0 L 0.45 0.3 Z";
Class.voidlingInsert3 = {
    SHAPE: insert3,
    COLOR: dark1,
    MIRROR_MASTER_ANGLE: true,
}

Class.voidlingCore = {
    PARENT: 'auraBase',
    SHAPE: 6,
    COLOR: 6,
    ALPHA: 0.7,
}

Class.genericVoidling = {
    PARENT: "genericTank",
    TYPE: "miniboss",
    DANGER: 15,
    COLOR: baseColor,
    SKILL: skillSet({
        rld: 0.4,
        dam: 0.7,
        pen: 0.6,
        str: 1,
        spd: 0.8,
        atk: 0.3,
        hlt: 1,
        shi: 0.7,
        rgn: 0,
        mob: 1,
    }),
    CONTROLLERS: ["nearestDifferentMaster", "canRepel"],
    HITS_OWN_TYPE: "hardOnlyBosses",
    SIZE: 32,
    BODY: {
        PUSHABILITY: 0.7,
        HEALTH: base.HEALTH * 8,
        DAMAGE: base.DAMAGE * 2,
        PENETRATION: base.PENETRATION * 2,
        SHIELD: base.SHIELD * 4,
        REGEN: base.REGEN * 0.3,
        SPEED: base.SPEED * 0.85,
        ACCELERATION: base.ACCEL * 0.7,
        FOV: base.FOV * 1.4,
        DENSITY: base.DENSITY * 8,
    }
}

Class.relativity = {
    PARENT: 'genericVoidling',
    LABEL: "Relativity",
    SHAPE: shape3,
    GUNS: [
        {
            POSITION: [0, 5.5, 1, 0, 0, 0, 0,],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([]),
                TYPE: ['voidlingCore', { FACING_TYPE: ["spin", {speed: -1.3}], }],
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                BORDERLESS: true,
            }, 
        }, {
            POSITION: [0, 6.5, 1, 0, 0, 0, 0,],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([]),
                TYPE: ['voidlingCore', { FACING_TYPE: ["spin", {speed: 0.9}], }],
                MAX_CHILDREN: 1,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                BORDERLESS: true,
            }, 
        },
    ],
    TURRETS: [
        {
            POSITION: [20, 0, 0, 0, 0, 1],
            TYPE: 'voidlingInsert3',
        }
    ]
}
for (let a = 0; a < 3; a++) {
    for (let i = 0; i < 3; i++) {
        Class.relativity.GUNS.push({
            POSITION: [0.7, 1.6, 0.8, 6 + 1.4 * i, 3.7 - 0.9 * i, 120 * a + 60, 0],
            PROPERTIES: {
                COLOR: trim,
                BORDERLESS: true,
                DRAW_ABOVE: true,
                BLINKER: {
                    REPEAT: 800,
                    START: 125 * i,
                    END: 400 + 125 * i,
                    OFF_COLOR: 17,
                }
            }
        }, {
            POSITION: [0.7, 1.6, 0.8, 6 + 1.4 * i, -3.7 + 0.9 * i, 120 * a - 60, 0],
            PROPERTIES: {
                COLOR: trim,
                BORDERLESS: true,
                DRAW_ABOVE: true,
                BLINKER: {
                    REPEAT: 800,
                    START: 125 * i,
                    END: 400 + 125 * i,
                    OFF_COLOR: 17,
                }
            }
        })
    }
}

Class.voidlingsMenu = menu("Voidlings");
Class.voidlingsMenu.SHAPE = 3.5;
Class.voidlingsMenu.COLOR = baseColor;

Class.addons.UPGRADES_TIER_0.push("voidlingsMenu");
    Class.voidlingsMenu.UPGRADES_TIER_0 = ["relativity"];
