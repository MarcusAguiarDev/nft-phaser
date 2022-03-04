import Phaser from 'phaser'



const PLAYER_SPEED = 200

class RoomScene extends Phaser.Scene {

    player!: Phaser.Physics.Arcade.Sprite
    cursor!: Phaser.Types.Input.Keyboard.CursorKeys
    walkHotkeys!: KeyMap
    actionHotkeys!: KeyMap

    iddleAnimations = {
        'W': 'idle-up',
        'D': 'idle-right',
        'S': 'idle-down',
        'A': 'idle-left',
        'UP': 'idle-up',
        'RIGHT': 'idle-right',
        'DOWN': 'idle-down',
        'LEFT': 'idle-left',
    }
    walkAnimations = {
        'W': 'walk-up',
        'D': 'walk-right',
        'S': 'walk-down',
        'A': 'walk-left',
        'UP': 'walk-up',
        'RIGHT': 'walk-right',
        'DOWN': 'walk-down',
        'LEFT': 'walk-left',
    }
    velocity = {
        'W': { x: 0, y: -PLAYER_SPEED, },
        'D': { x: PLAYER_SPEED, y: 0 },
        'S': { x: 0, y: PLAYER_SPEED },
        'A': { x: -PLAYER_SPEED, y: 0 },
        'UP': { x: 0, y: -PLAYER_SPEED },
        'RIGHT': { x: PLAYER_SPEED, y: 0 },
        'DOWN': { x: 0, y: PLAYER_SPEED },
        'LEFT': { x: -PLAYER_SPEED, y: 0 },
    }

    constructor() {
        super('room-scene')
    }
    preload() {
        this.load.spritesheet('player', '../assets/characters/player1.png', {
            frameWidth: 32,
            frameHeight: 64,
        })
    }
    create() {
        this.player = this.physics.add.sprite(400, 300, 'player')
        this.createAnimations()

        //set hotkeys
        this.walkHotkeys = this.input.keyboard.addKeys('W,D,S,A,UP,RIGHT,DOWN,LEFT') as KeyMap
        this.actionHotkeys = this.input.keyboard.addKeys('SPACE') as KeyMap

        Object.keys(this.walkHotkeys).forEach(index => {
            this.walkHotkeys[index].on('down', e => this.keyDownEventHandler(index, e))
        })
        Object.keys(this.walkHotkeys).forEach(index => {
            this.walkHotkeys[index].on('up', e => this.keyUpEventHandler(index, e))
        })

    }

    keyDownEventHandler(key: string, event: KeyboardEvent) {
        if (this.player.anims.currentAnim !== this.walkAnimations[key]) {
            this.player.anims.play(this.walkAnimations[key])
            this.player.setVelocity(this.velocity[key].x, this.velocity[key].y)
        }
    }
    keyUpEventHandler(animationKey: string, event: KeyboardEvent) {
        console.log(this.player.anims.currentAnim, animationKey)
        if (this.player.anims.currentAnim.key === this.walkAnimations[animationKey]) {
            this.player.anims.play(this.iddleAnimations[animationKey])
            this.player.setVelocity(0, 0)
        }
    }


    update(time: number, delta: number): void {
        // Object.keys(this.walkAnimations).forEach(animationKey => {
        //     if (!this.player.anims.isPlaying && this.walkHotkeys[animationKey].isDown)
        //         this.player.anims.play(this.walkAnimations[animationKey])
        // })
    }

    createAnimations() {
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 112, end: 117 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'idle-right',
            frames: [{ key: 'player', frame: 0 }]
        })
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 118, end: 123 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'idle-up',
            frames: [{ key: 'player', frame: 1 }]
        })
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 124, end: 128 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'idle-left',
            frames: [{ key: 'player', frame: 2 }]
        })
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 130, end: 135 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'idle-down',
            frames: [{ key: 'player', frame: 3 }]
        })
    }
}

interface KeyMap { [index: string]: Phaser.Input.Keyboard.Key }

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export default RoomScene