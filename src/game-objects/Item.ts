export default class Item extends Phaser.Physics.Arcade.Sprite {


    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.scene.add.existing(this)
    }
}