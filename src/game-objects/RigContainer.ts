import { MapObjectsState } from "~/services/MapObjectsState";
import DraggableContainer, { SpriteContainer } from "./DraggableContainer";

export default class RigContainer extends DraggableContainer implements ActionSprite {

    constructor(
        scene: Phaser.Scene,
        mapObjectsState: MapObjectsState,
        spriteContainers: SpriteContainer[]
    ) {
        super(scene, mapObjectsState, spriteContainers)
    }

    collideCallback(_, colliderObject) {
        console.log("collide", colliderObject)
    }

    setCollision(collisionObjects) {
        this.scene.physics.add.collider(this, collisionObjects, this.collideCallback.bind(this))
    }
}

interface ActionSprite extends DraggableContainer {
    collideCallback(thisClass, otherObject): void
    setCollision(collisionObjects): void
}
