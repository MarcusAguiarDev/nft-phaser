/**
 *  DraggableSprite class
 */

 import { Physics } from "phaser"


 export default class DraggableSprite extends Phaser.Physics.Arcade.Sprite {
 
     group!: Physics.Arcade.Group
     container: Phaser.GameObjects.Container
 
     constructor(scene: Phaser.Scene, x: number, y: number, sprite: string, frame?: string|number) {
 
         super(scene, x, y, sprite, frame)
         this.scene = scene
 
         //create containers
         this.container = this.scene.add.container(x,y, this)
         this.container.setSize(this.width, this.height)
     

         //drag functions
         this.setDragFunctions(this.container)
 
     }
 
     onDragHandler(pointer, gameObject, dragX, dragY) {
         console.log(dragX)
         gameObject.x = dragX
         gameObject.y = dragY
     }
 
     setDragFunctions(container: Phaser.GameObjects.Container) {
 
         container.setInteractive()
         this.scene.input.setDraggable(container)
 
         this.scene.input.on('drag', this.onDragHandler.bind(this))
 
         this.scene.input.on('dragstart', function (pointer, gameObject, dragX, dragY) {
             console.log("start")
         });
 
         this.scene.input.on('dragend', function (_, gameObject) {
             gameObject.x = Math.round(gameObject.x / 32) * 32
             gameObject.y = Math.round(gameObject.y / 32) * 32
         });
     }
     setCollision(collisionObject, callbackFunction) {
 
         this.scene.physics.add.collider(this, collisionObject, callbackFunction)
     }
 }