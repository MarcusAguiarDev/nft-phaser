/**
 *  DraggableContainer class
 */

import { MapObjectsState, MatrixPosition } from "~/services/MapObjectsState"
import DraggableSprite from "./DraggableSprite"

const GREEN_COLOR = 0x00ff6e
const RED_COLOR = 0xff0000
const PREVIEW_ALPHA = 0.3

export default class DraggableContainer extends Phaser.GameObjects.Container {

    scene: Phaser.Scene
    mapObjectsState: MapObjectsState
    dragStartX = 0
    dragStartY = 0
    tempContainer!: Phaser.GameObjects.Container
    locationPreview!: Phaser.GameObjects.Rectangle
    lastDragPositionAvailable = false
    tilePositions = new Array()

    constructor(
        scene: Phaser.Scene,
        mapObjectsState: MapObjectsState,
        line: number,
        column: number,
        containedSprites: DraggableContainedSprites[]
    ) {

        super(scene, 0, 0, [])

        this.scene = scene
        this.mapObjectsState = mapObjectsState
        const { x, y } = this.getPixelsByPos(line, column)
        this.x = x
        this.y = y

        //add the sprites to the container
        containedSprites.forEach(containedSprite => {
            const sprite = containedSprite.sprite
            const x = (containedSprite.column - 1) * mapObjectsState.layerData.tileWidth
            const y = (containedSprite.line - 1) * mapObjectsState.layerData.tileHeight
            sprite.setPosition(x, y, containedSprite.z)
            this.add(sprite)
        })
        //sort container child by Z propertie
        this.sort('z')

        //Render the player in scene
        this.scene.add.existing(this)

        //drag functions
        this.setDragFunctions()

        //register object in MapObjectsState
        this.mapObjectsState.insertObject(this.getInitialOccupiedTiles(), this)
    }

    getPixelsByPos(line: number, column: number) {
        const layerWidth = this.mapObjectsState.layerData.width * this.mapObjectsState.layerData.tileWidth
        const layerHeight = this.mapObjectsState.layerData.height * this.mapObjectsState.layerData.tileHeight
        const tileWidth = this.mapObjectsState.layerData.tileWidth
        const tileHeight = this.mapObjectsState.layerData.tileHeight
        const x = ((line * tileWidth) - (layerWidth / 2)) + (this.width / 2)
        const y = ((column * tileHeight) - (layerHeight / 2)) + (this.height / 2)
        return { x, y }
    }

    getInitialOccupiedTiles() {

        const layerWidth = this.mapObjectsState.layerData.width * this.mapObjectsState.layerData.tileWidth
        const layerHeight = this.mapObjectsState.layerData.height * this.mapObjectsState.layerData.tileHeight

        const line = (this.y + (layerHeight / 2) - (this.height / 2)) / this.mapObjectsState.layerData.tileHeight
        const column = (this.x + (layerWidth / 2) - (this.width / 2)) / this.mapObjectsState.layerData.tileWidth
        const tilePositions = new Array<MatrixPosition>()
        const tilesX = this.input.hitArea.width / this.mapObjectsState.layerData.tileWidth
        const tilesY = this.input.hitArea.height / this.mapObjectsState.layerData.tileHeight

        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                tilePositions.push({ line: line + y, column: column + x })
            }
        }
        return tilePositions
    }

    onDragStart(pointer, gameObject: Phaser.GameObjects.Container) {
        if (gameObject !== this)
            return
        //create locate preview
        const leftPos = gameObject.x - (gameObject.width / 2)
        const topPos = gameObject.y - (gameObject.height / 2)

        this.locationPreview = this.scene.add
            .rectangle(leftPos, topPos, gameObject.input.hitArea.width, gameObject.input.hitArea.height)
            .setFillStyle(RED_COLOR, PREVIEW_ALPHA)
            .setOrigin(0, 0)

        //create temp container
        this.tempContainer = this.scene.add.container(gameObject.x, gameObject.y)
        this.tempContainer.add(gameObject.getAll().map(el => {
            const draggableSpprite = el as DraggableSprite
            return this.scene.add.sprite(draggableSpprite.x, draggableSpprite.y, draggableSpprite.textureName, draggableSpprite.frameName).setOrigin(0, 0)
        }))

        this.dragStartX = gameObject.x
        this.dragStartY = gameObject.y
    }
    onDragEnd(pointer, gameObject: Phaser.GameObjects.Container) {
        if (gameObject != this)
            return
        //destroy temp comtainer
        if (this.tempContainer) {
            this.tempContainer.removeAll(true)
            this.tempContainer.destroy(true)
        }
        gameObject.setAlpha(1)
        gameObject.getAll().forEach((el) => {
            if (el instanceof Phaser.Physics.Arcade.Sprite) {
                el.clearTint()
            }
        })
        if (this.lastDragPositionAvailable) {
            //confirm gameObject position
            gameObject.x = this.locationPreview.x + (gameObject.width / 2)
            gameObject.y = this.locationPreview.y + (gameObject.height / 2)
            //update MapObjectsState 
            this.mapObjectsState.removeObject(this)
            this.mapObjectsState.insertObject(this.tilePositions, this)
        } else {
            //reset
            gameObject.x = this.dragStartX
            gameObject.y = this.dragStartY
        }

        //destroy location preview
        if (this.locationPreview) {
            this.locationPreview.destroy(true)
        }
    }
    onDragHandler(pointer, gameObject: Phaser.GameObjects.Container, dragX, dragY) {
        if (gameObject != this)
            return
        gameObject.x = dragX
        gameObject.y = dragY

        const leftPos = gameObject.x
        const topPos = gameObject.y
        const layerWidth = this.mapObjectsState.layerData.width * this.mapObjectsState.layerData.tileWidth
        const layerHeight = this.mapObjectsState.layerData.height * this.mapObjectsState.layerData.tileHeight

        const column = Math.round((leftPos + (layerWidth / 2)) / this.mapObjectsState.layerData.tileWidth)
        const line = Math.round((topPos + (layerHeight / 2)) / this.mapObjectsState.layerData.tileHeight)

        this.locationPreview.x = (column * this.mapObjectsState.layerData.tileWidth) - (layerWidth / 2)
        this.locationPreview.y = (line * this.mapObjectsState.layerData.tileHeight) - (layerHeight / 2)

        //get preview tile positions
        this.tilePositions = new Array<MatrixPosition>()
        const tilesX = gameObject.input.hitArea.width / this.mapObjectsState.layerData.tileWidth
        const tilesY = gameObject.input.hitArea.height / this.mapObjectsState.layerData.tileHeight
        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                this.tilePositions.push({ line: line + y, column: column + x })
            }
        }
        //check if tiles is available
        if (this.mapObjectsState.isPositionsAvailable(this.tilePositions)) {
            this.lastDragPositionAvailable = true
            this.locationPreview.setFillStyle(GREEN_COLOR, PREVIEW_ALPHA)
        } else {
            this.lastDragPositionAvailable = false
            this.locationPreview.setFillStyle(RED_COLOR, PREVIEW_ALPHA)
        }
    }

    setDragFunctions() {

        const rect = this.getBounds()
        rect.setPosition(0, 0)
        const rectangle = new Phaser.Geom.Rectangle(rect.x, rect.y, rect.width, rect.height)
        this.setInteractive(rectangle, Phaser.Geom.Rectangle.Contains);

        this.scene.input.setDraggable(this)
        this.scene.input.on('dragend', this.onDragEnd.bind(this))
        this.scene.input.on('drag', this.onDragHandler.bind(this))
        this.scene.input.on('dragstart', this.onDragStart.bind(this))
    }

    setCollision(collisionObject, callbackFunction) {
        this.scene.physics.add.collider(this, collisionObject, callbackFunction)
    }
}

export interface DraggableContainedSprites {
    sprite: DraggableSprite
    line: number
    column: number,
    z?: number
}