export default class CustomGamepad {

    scene: Phaser.Scene
    walkHotkeys: KeyMap
    actionHotkeys: KeyMap

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.walkHotkeys = scene.input.keyboard.addKeys('W,D,S,A,UP,RIGHT,DOWN,LEFT') as KeyMap
        this.actionHotkeys = scene.input.keyboard.addKeys('SPACE') as KeyMap
    }
}

interface KeyMap { [index: string]: Phaser.Input.Keyboard.Key }