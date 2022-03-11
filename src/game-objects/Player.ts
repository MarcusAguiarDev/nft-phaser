/**
 *  Player class
 */

import createAnimations from "~/animations/PlayerAnimations";
import { chatBalloon, chatInput } from "~/dom-components/chat-components";

const PLAYER_SPEED = 200
const PLAYER_BODY_WIDTH = 32
const PLAYER_BODY_HEIGHT = 20
const CHAT_INPUT_ID = 'chat-input'
const CHAT_BALLOON_ID = 'chat-balloon'
const CONTAINER_HEIGHT = 80
const CONTAINER_WIDTH = 100
const CONTAINER_Y_OFFSET = -56


export default class Player extends Phaser.Physics.Arcade.Sprite {

    attachedContainer: Phaser.GameObjects.Container
    attachedContainerBody: Phaser.Physics.Arcade.Body

    keyMap: KeyMap

    direction = Direction.DOWN

    focus: Focus
    chatInput: Phaser.GameObjects.DOMElement
    chatInputDom: HTMLInputElement
    chatBalloonElement!: Phaser.GameObjects.DOMElement
    chatBalloonDom!: HTMLDivElement

    timers = new Array<number>()

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.scene = scene
        //Create hotkey maps
        this.keyMap = scene.input.keyboard.addKeys('W,D,S,A,UP,RIGHT,DOWN,LEFT,SPACE,ENTER', false) as KeyMap
        this.focus = Focus.GAME
        //Create a player attachedContainer and add to scene
        this.attachedContainer = this.scene.add.container(x, y).setDepth(5000)
        this.attachedContainer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT)
        //Render the player in scene
        this.scene.add.existing(this)
        //Add body to player and container
        this.scene.physics.add.existing(this)
        this.scene.physics.world.enable(this.attachedContainer)
        //Adjust body to correct collide
        this.body.setSize(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT)
        this.body.setOffset(0, 44)
        //adjusto body container to player body
        this.attachedContainerBody = this.attachedContainer.body as Phaser.Physics.Arcade.Body
        this.attachedContainerBody.setSize(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT)
        this.attachedContainerBody.setOffset(34, 80)
        this.attachedContainer.setPosition(x, y - 28)
        //set player animations
        createAnimations(this.anims)
        //chat
        this.chatInput = this.createChatInput(20, 580)
        this.chatInputDom = document.getElementById(CHAT_INPUT_ID) as HTMLInputElement
        //set nickname
        this.createNicknameLabel(name)
        this.createChatBalloon()
        this.setChatKeyListeners()
    }
    //the update should be called in the scene update() method
    update() {

        if (this.focus === Focus.GAME) {
            let idle = false
            if (this.keyMap['UP'].isDown || this.keyMap['W'].isDown) {
                this.direction = Direction.UP
            } else if (this.keyMap['RIGHT'].isDown || this.keyMap['D'].isDown) {
                this.direction = Direction.RIGHT
            } else if (this.keyMap['DOWN'].isDown || this.keyMap['S'].isDown) {
                this.direction = Direction.DOWN
            } else if (this.keyMap['LEFT'].isDown || this.keyMap['A'].isDown) {
                this.direction = Direction.LEFT
            } else {
                //idle
                idle = true
                this.anims.play(IDLE_ANIMATIONS[this.direction], true)
                this.setVelocity(0, 0)
                this.attachedContainerBody.setVelocity(0, 0)
            }
            if (!idle) {
                const xV = VELOCITY[this.direction].x
                const yV = VELOCITY[this.direction].y
                this.anims.play(WALK_ANIMATIONS[this.direction], true)
                this.setVelocity(xV, yV)
                this.attachedContainerBody.setVelocity(xV, yV)
            }
        }
    }

    //Chat functions
    setChatKeyListeners() {
        this.keyMap['ENTER'].on('down', () => {
            if (this.focus === Focus.GAME) {
                this.chatInput.setVisible(true)
                //set focus
                setTimeout(() => this.chatInputDom?.focus(), 100)
                this.focus = Focus.CHAT
            } else if (this.focus === Focus.CHAT) {
                const message = this.chatInputDom.value
                //clear box
                this.chatInputDom.value = ''
                this.chatInput.setVisible(false)
                this.focus = Focus.GAME
                this.showMessage(message)
                //TODO: send message to server
            }
        })
    }
    createChatInput(x: number, y: number): Phaser.GameObjects.DOMElement {
        return this.scene.add.dom(x, y, chatInput)
            .setOrigin(0, 1)
            .setScrollFactor(0)
            .setVisible(false)
    }
    createChatBalloon() {
        const chatBalloonContainer = this.scene.add
            .container(0, 0)
            .setName('chatBalloon')
        this.attachedContainer.add(chatBalloonContainer)
    }
    showMessage(message: string) {
        if(message.trim().length <= 0) return
        const chatBalloonContainer = this.attachedContainer.getByName('chatBalloon') as Phaser.GameObjects.Container

        //destroy previous balloons
        chatBalloonContainer.removeAll(true)

        const text = this.scene.add
            .text(22, 18, message, {
                wordWrap: { width: 80, useAdvancedWrap: true },
                color: '#4B4B4B',
                fontStyle: 'bold',
                fontFamily: 'monospace',
                fontSize: '14px'
            }).setOrigin(0, 1)

        const chatBallonX = text.x - 4
        const chatBallonY = text.y - text.height -  4
        const chatBalloonWidth = text.width + 8
        const chatBalloonHeight = text.height + 8
        const borderRadius = 10
        const borders: Phaser.Types.GameObjects.Graphics.RoundedRectRadius = {
            tl: borderRadius,
            tr: borderRadius,
            br: borderRadius,
            bl: 0
        }
        const chatBalloon = this.scene.add
            .graphics()
            .lineStyle(2, 0xBFBDAE, 1)
            .fillStyle(0xFFFEF5, 0.8)
            .fillRoundedRect(chatBallonX, chatBallonY, chatBalloonWidth, chatBalloonHeight, borders)
            .strokePath()

        chatBalloonContainer.add([chatBalloon, text])
        //remove ballon after a time
        const timeToDestroy = 6000
        setTimeout(() => chatBalloonContainer.removeAll(true), timeToDestroy)
    }

    createNicknameLabel(nickname: string) {
        const text = this.scene.add
            .text(0, 70, nickname)
            .setOrigin(0.5)
            .setColor('#fff')
            .setFontFamily('monospace')
            .setStroke('#000', 3)
        this.attachedContainer.add(text)
    }


    //Move functions
    keyDownWalkHandler(key: string, event: KeyboardEvent) {
        if (this.focus === Focus.GAME) {
            if (this.anims.currentAnim !== WALK_ANIMATIONS[key]) {
                this.anims.play(WALK_ANIMATIONS[key])
                this.setVelocity(VELOCITY[key].x, VELOCITY[key].y)
                this.attachedContainerBody.setVelocity(VELOCITY[key].x, VELOCITY[key].y)
            }
        } else if (this.focus === Focus.CHAT) {

        }
    }
    keyUpWalkHandler(animationKey: string, event: KeyboardEvent) {
        if (this.focus === Focus.GAME) {
            if (this.anims.currentAnim.key === WALK_ANIMATIONS[animationKey]) {
                this.anims.play(IDLE_ANIMATIONS[animationKey])
                this.setVelocity(0, 0)
                this.attachedContainerBody.setVelocity(0, 0)
            }
        } else if (this.focus === Focus.CHAT) {

        }
    }

}

enum Focus {
    GAME,
    CHAT,
    MENU
}

enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT
}

const IDLE_ANIMATIONS = {
    [Direction.UP]: 'idle-up',
    [Direction.RIGHT]: 'idle-right',
    [Direction.DOWN]: 'idle-down',
    [Direction.LEFT]: 'idle-left',
}
const WALK_ANIMATIONS = {
    [Direction.UP]: 'walk-up',
    [Direction.RIGHT]: 'walk-right',
    [Direction.DOWN]: 'walk-down',
    [Direction.LEFT]: 'walk-left',
}
const VELOCITY = {
    [Direction.UP]: { x: 0, y: -PLAYER_SPEED, },
    [Direction.RIGHT]: { x: PLAYER_SPEED, y: 0 },
    [Direction.DOWN]: { x: 0, y: PLAYER_SPEED },
    [Direction.LEFT]: { x: -PLAYER_SPEED, y: 0 },
}

interface KeyMap { [index: string]: Phaser.Input.Keyboard.Key }