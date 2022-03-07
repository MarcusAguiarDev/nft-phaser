import { chatBalloon, chatInput } from "~/dom-components/chat-components";
import CustomGamepad from "./Gamepad";

const PLAYER_SPEED = 200
const CHAT_INPUT_ID = 'chat-input'
const CHAT_BALLOON_ID = 'chat-balloon'

export default class Player extends CustomGamepad {

    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    focus: Focus
    chatInput: Phaser.GameObjects.DOMElement
    chatInputDom: HTMLInputElement
    chatBalloonElement!: Phaser.GameObjects.DOMElement
    chatBalloonDom!: HTMLDivElement

    timers = new Array<number>()

    constructor(scene: Phaser.Scene, playerElement: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        super(scene)
        this.player = playerElement
        this.focus = Focus.GAME
        //Adjust body to correct collide
        this.player.body.setSize(32, 20)
        this.player.body.setOffset(0, 44)
        this.createAnimations()
        //walkHotkeys event handlers
        Object.keys(this.walkHotkeys).forEach(index => {
            this.walkHotkeys[index].on('down', e => this.keyDownWalkHandler(index, e))
        })
        Object.keys(this.walkHotkeys).forEach(index => {
            this.walkHotkeys[index].on('up', e => this.keyUpWalkHandler(index, e))
        })
        //actionHotkeys event handlers
        Object.keys(this.actionHotkeys).forEach(index => {
            this.actionHotkeys[index].on('down', e => this.chatEventHandler(index, e))
        })
        //chat
        this.chatInput = this.scene.add.dom(20, 580, chatInput)
            .setOrigin(0, 1)
            .setScrollFactor(0)
            .setVisible(false)
        this.chatInputDom = document.getElementById(CHAT_INPUT_ID) as HTMLInputElement
        
    }
    createChatBalloon(message: string){
        //destroy older balloon
        if (this.chatBalloonElement)
            this.chatBalloonElement.destroy()
        //create balloon phaser element and dom
        this.chatBalloonElement = this.scene.add.dom(410, 280, chatBalloon, null, message)
            .setOrigin(0, 1)
            .setVisible(true)
            .setScrollFactor(0)
        this.chatBalloonDom = document.getElementById(CHAT_BALLOON_ID) as HTMLInputElement
    }
    
    //Chat functions
    chatEventHandler(key: string, event: KeyboardEvent) {
        if (key === 'ENTER') {
            //close chat and send message
            if (this.focus == Focus.CHAT) {
                this.focus = Focus.GAME
                if (this.chatInputDom) {
                    const message = this.chatInputDom.value
                    this.chatInputDom.value = ""
                    //show text balloon
                    this.showMessageBalloon(message)
                    //TODO: send message to server
                }
                this.chatInput.setVisible(false)
            } else if (this.focus == Focus.GAME) {
                //Send message and close chat input
                this.focus = Focus.CHAT
                this.chatInput.setVisible(true)
                //set focus
                setTimeout(() => this.chatInputDom?.focus(), 100)
            }
        }
    }
    showMessageBalloon(message: string) {
        const balloonLife = 6000
        this.createChatBalloon(message)
        //clear previous timers
        this.timers.forEach(timer => clearTimeout(timer))
        const timer = setTimeout( () => this.chatBalloonElement.destroy(), balloonLife)
        this.timers.push(timer)
    }
    //Move functions
    keyDownWalkHandler(key: string, event: KeyboardEvent) {
        if (this.focus === Focus.GAME) {
            if (this.player.anims.currentAnim !== WALK_ANIMATIONS[key]) {
                this.player.anims.play(WALK_ANIMATIONS[key])
                this.player.setVelocity(VELOCITY[key].x, VELOCITY[key].y)
            }
        } else if (this.focus === Focus.CHAT) {

        }
    }
    keyUpWalkHandler(animationKey: string, event: KeyboardEvent) {
        if (this.focus === Focus.GAME) {
            if (this.player.anims.currentAnim.key === WALK_ANIMATIONS[animationKey]) {
                this.player.anims.play(IDLE_ANIMATIONS[animationKey])
                this.player.setVelocity(0, 0)
            }
        } else if (this.focus === Focus.CHAT) {

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

enum Focus {
    GAME,
    CHAT,
    MENU
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