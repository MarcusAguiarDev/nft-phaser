import CustomGamepad from "./Gamepad";

const PLAYER_SPEED = 200

export default class Player extends CustomGamepad {
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

    constructor(scene: Phaser.Scene, playerElement: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        super(scene)
        this.player = playerElement
        //Adjust body to correct collide
        this.player.body.setSize(32,20)
        this.player.body.setOffset(0,44)
        this.createAnimations()
        Object.keys(this.walkHotkeys).forEach(index => {
            this.walkHotkeys[index].on('down', e => this.keyDownEventHandler(index, e))
        })
        Object.keys(this.walkHotkeys).forEach(index => {
            this.walkHotkeys[index].on('up', e => this.keyUpEventHandler(index, e))
        })
    }

    keyDownEventHandler(key: string, event: KeyboardEvent) {
        if (this.player.anims.currentAnim !== WALK_ANIMATIONS[key]) {
            this.player.anims.play(WALK_ANIMATIONS[key])
            this.player.setVelocity(VELOCITY[key].x, VELOCITY[key].y)
        }
    }

    keyUpEventHandler(animationKey: string, event: KeyboardEvent) {
        if (this.player.anims.currentAnim.key === WALK_ANIMATIONS[animationKey]) {
            this.player.anims.play(IDLE_ANIMATIONS[animationKey])
            this.player.setVelocity(0, 0)
        }
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'walk-right',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 112, end: 117 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'idle-right',
            frames: [{ key: 'player', frame: 0 }]
        })
        this.scene.anims.create({
            key: 'walk-up',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 118, end: 123 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'idle-up',
            frames: [{ key: 'player', frame: 1 }]
        })
        this.scene.anims.create({
            key: 'walk-left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 124, end: 128 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'idle-left',
            frames: [{ key: 'player', frame: 2 }]
        })
        this.scene.anims.create({
            key: 'walk-down',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 130, end: 135 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'idle-down',
            frames: [{ key: 'player', frame: 3 }]
        })
    }
}

const IDLE_ANIMATIONS = {
    'W': 'idle-up',
    'D': 'idle-right',
    'S': 'idle-down',
    'A': 'idle-left',
    'UP': 'idle-up',
    'RIGHT': 'idle-right',
    'DOWN': 'idle-down',
    'LEFT': 'idle-left',
}
const WALK_ANIMATIONS = {
    'W': 'walk-up',
    'D': 'walk-right',
    'S': 'walk-down',
    'A': 'walk-left',
    'UP': 'walk-up',
    'RIGHT': 'walk-right',
    'DOWN': 'walk-down',
    'LEFT': 'walk-left',
}
const VELOCITY = {
    'W': { x: 0, y: -PLAYER_SPEED, },
    'D': { x: PLAYER_SPEED, y: 0 },
    'S': { x: 0, y: PLAYER_SPEED },
    'A': { x: -PLAYER_SPEED, y: 0 },
    'UP': { x: 0, y: -PLAYER_SPEED },
    'RIGHT': { x: PLAYER_SPEED, y: 0 },
    'DOWN': { x: 0, y: PLAYER_SPEED },
    'LEFT': { x: -PLAYER_SPEED, y: 0 },
}