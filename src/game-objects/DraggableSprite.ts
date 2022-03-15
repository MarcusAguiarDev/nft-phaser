/**
 *  DraggableSprite class
 */

import { MapObjectsState, MatrixPosition } from "~/services/MapObjectsState"



const GREEN_COLOR = 0x00ff6e
const RED_COLOR = 0xff0000
const PREVIEW_ALPHA = 0.3

export default class DraggableSprite extends Phaser.Physics.Arcade.Sprite {

    scene: Phaser.Scene
    mapObjectsState: MapObjectsState
    group!: Phaser.Physics.Arcade.Group
    container: Phaser.GameObjects.Container
    sprite: string
    frameName: string | number | undefined
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
        sprite: string,
        frame?: string | number
    ) {
        super(scene, 0, 0, sprite, frame)


        this.scene = scene
        this.mapObjectsState = mapObjectsState
        this.sprite = sprite
        this.frameName = frame

        const {x, y} = this.getPixelsByPos(line, column)

        //create containers
        this.container = this.scene.add.container(x, y, this)
        this.container.setSize(this.width, this.height)

        //drag functions
        this.setDragFunctions(this.container)

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
        console.log(this.container.width, this.container.height)
        console.log(this.container.y)

        const layerWidth = this.mapObjectsState.layerData.width * this.mapObjectsState.layerData.tileWidth
        const layerHeight = this.mapObjectsState.layerData.height * this.mapObjectsState.layerData.tileHeight

        console.log(layerWidth, layerHeight)

        const line = (this.container.y + (layerHeight / 2) - (this.container.height / 2)) / this.mapObjectsState.layerData.tileHeight
        const column = (this.container.x + (layerWidth / 2) - (this.container.width / 2)) / this.mapObjectsState.layerData.tileWidth
        const tilePositions = new Array<MatrixPosition>()
        const tilesX = this.container.width / this.mapObjectsState.layerData.tileWidth
        const tilesY = this.container.height / this.mapObjectsState.layerData.tileHeight

        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                tilePositions.push({ line: line + y, column: column + x })
            }
        }
        return tilePositions
    }

    onDragStart(pointer, gameObject: Phaser.GameObjects.Container) {
        if (gameObject != this.container)
            return
        //create locate preview
        const leftPos = gameObject.x - (gameObject.width / 2)
        const topPos = gameObject.y - (gameObject.height / 2)
        this.locationPreview = this.scene.add
            .rectangle(leftPos, topPos, gameObject.width, gameObject.height)
            .setFillStyle(RED_COLOR, PREVIEW_ALPHA)
            .setOrigin(0, 0)

        //create temp container
        this.tempContainer = this.scene.add.container(gameObject.x, gameObject.y)
        this.tempContainer.add(gameObject.getAll().map(el => {
            return new Phaser.Physics.Arcade.Sprite(this.scene, 0, 0, this.sprite, this.frameName)
        }))

        this.dragStartX = gameObject.x
        this.dragStartY = gameObject.y
    }
    onDragEnd(pointer, gameObject: Phaser.GameObjects.Container) {
        if (gameObject != this.container)
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

        // gameObject.x = Math.round(gameObject.x / 32) * 32
        // gameObject.y = Math.round(gameObject.y / 32) * 32
    }
    onDragHandler(pointer, gameObject: Phaser.GameObjects.Container, dragX, dragY) {
        if (gameObject != this.container)
            return
        gameObject.x = dragX
        gameObject.y = dragY

        const leftPos = gameObject.x - (gameObject.width / 2)
        const topPos = gameObject.y - (gameObject.height / 2)
        const layerWidth = this.mapObjectsState.layerData.width * this.mapObjectsState.layerData.tileWidth
        const layerHeight = this.mapObjectsState.layerData.height * this.mapObjectsState.layerData.tileHeight

        const column = Math.round((leftPos + (layerWidth / 2)) / this.mapObjectsState.layerData.tileWidth)
        const line = Math.round((topPos + (layerHeight / 2)) / this.mapObjectsState.layerData.tileHeight)

        this.locationPreview.x = (column * this.mapObjectsState.layerData.tileWidth) - (layerWidth / 2)
        this.locationPreview.y = (line * this.mapObjectsState.layerData.tileHeight) - (layerHeight / 2)

        //get preview tile positions
        this.tilePositions = new Array<MatrixPosition>()
        const tilesX = gameObject.width / this.mapObjectsState.layerData.tileWidth
        const tilesY = gameObject.height / this.mapObjectsState.layerData.tileHeight
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

    setDragFunctions(container: Phaser.GameObjects.Container) {
        container.setInteractive()
        this.scene.input.setDraggable(container)
        this.scene.input.on('dragend', this.onDragEnd.bind(this))
        this.scene.input.on('drag', this.onDragHandler.bind(this))
        this.scene.input.on('dragstart', this.onDragStart.bind(this))
    }

    setCollision(collisionObject, callbackFunction) {

        this.scene.physics.add.collider(this, collisionObject, callbackFunction)
    }
}