/**
 *  MiningRig class
 */

import DraggableSprite from "./DraggableSprite"


export default class MiningRig extends DraggableSprite {

    constructor(scene: Phaser.Scene, x: number, y: number, sprite: string, frame?: string|number) {

        super(scene, x, y, sprite, frame)
    }
}