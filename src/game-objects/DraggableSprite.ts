/**
 *  DraggableSprite class
 */

export default class DraggableSprite extends Phaser.Physics.Arcade.Sprite {

    scene: Phaser.Scene
    textureName: string
    frameName: string | number | undefined

    constructor(
        scene: Phaser.Scene,
        texture: string,
        frame?: string | number
    ) {
        super(scene, 0, 0, texture, frame)
        this.scene = scene
        this.textureName = texture
        this.frameName = frame
        this.setOrigin(0, 0)
    }
}