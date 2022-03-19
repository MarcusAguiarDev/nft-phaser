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
    attachedContainers: Phaser.GameObjects.Container[] = []
    dragStartX = 0
    dragStartY = 0
    tempContainer!: Phaser.GameObjects.Container
    locationPreview!: Phaser.GameObjects.Rectangle
    lastDragPositionAvailable = false
    tilePositions = new Array()

    constructor(
        scene: Phaser.Scene,
        mapObjectsState: MapObjectsState,
        spriteContainers: SpriteContainer[]
    ) {

        super(scene, 0, 0)
        this.scene = scene
        this.scene.add.existing(this)
        this.mapObjectsState = mapObjectsState

        //add the sprites to the containers
        spriteContainers.forEach((spriteContainer, idx) => {
            let container: Phaser.GameObjects.Container
            const { x, y } = this.getPixelsByPos(spriteContainer.line, spriteContainer.column)
            //if first container, assign to this, else create a attached container
            if (idx === 0) {
                container = this
            }
            else {
                container = this.scene.add.container(x, y)
            }

            container.setDepth(spriteContainer.depth)


            spriteContainer.sprites.forEach(containedSprite => {
                const sprite = containedSprite.sprite
                const x = (containedSprite.column - 1) * mapObjectsState.layerData.tileWidth
                const y = (containedSprite.line - 1) * mapObjectsState.layerData.tileHeight
                sprite.setPosition(x, y)
                container.add(sprite)
            })
            //create a body for the first container
            if (idx === 0) {
                this.scene.physics.world.enable(container, 0);
                const boundsRect = container.getBounds();
                (container.body as any).setSize(boundsRect.width, boundsRect.height);
                (container.body as any).immovable = true;
                container.setPosition(x, y)
            } else {
                container.setPosition(container.x - (container.width / 2), container.y - (container.height / 2))
                this.attachedContainers.push(container)
            }

        })

        //sort container child by Z propertie
        this.sort('z')



        //drag functions
        this.setDragFunctions()

        //register object in MapObjectsState
        // this.mapObjectsState.insertObject(this.getInitialOccupiedTiles(), this)
    }

    getPixelsByPos(line: number, column: number) {
        const layerWidth = this.mapObjectsState.layerData.width * this.mapObjectsState.layerData.tileWidth
        const layerHeight = this.mapObjectsState.layerData.height * this.mapObjectsState.layerData.tileHeight
        const tileWidth = this.mapObjectsState.layerData.tileWidth
        const tileHeight = this.mapObjectsState.layerData.tileHeight
        const x = (((column - 1) * tileWidth) - (layerWidth / 2)) + (this.width / 2)
        const y = (((line - 1) * tileHeight) - (layerHeight / 2)) + (this.height / 2)
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

        //add main container
        this.tempContainer.add(gameObject.getAll().map(el => {
            const draggableSpprite = el as DraggableSprite
            return this.scene.add.sprite(draggableSpprite.x, draggableSpprite.y, draggableSpprite.textureName, draggableSpprite.frameName).setOrigin(0, 0)
        }))
        //add attached containers
        this.attachedContainers.forEach(container => {
            const xOffset = this.x - container.x
            const yOffset = this.y - container.y
            container.getAll().forEach(sprite => {
                const draggableSpprite = sprite as DraggableSprite
                const spriteObj = this.scene.add.sprite(draggableSpprite.x - xOffset, draggableSpprite.y - yOffset, draggableSpprite.textureName, draggableSpprite.frameName).setOrigin(0, 0)
                this.tempContainer.add(spriteObj)
            })
        })


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
            const xDiff = (this.locationPreview.x + (gameObject.width / 2)) - gameObject.x
            const yDiff = (this.locationPreview.y + (gameObject.height / 2)) - gameObject.y
            gameObject.x = this.locationPreview.x + (gameObject.width / 2)
            gameObject.y = this.locationPreview.y + (gameObject.height / 2)
            //update attached containers position
            this.attachedContainers.forEach(container => {
                container.x += xDiff
                container.y += yDiff
            })
            //update MapObjectsState 
            this.mapObjectsState.removeObject(this)
            this.mapObjectsState.insertObject(this.tilePositions, this)
        } else {
            //reset
            const xDiff = this.dragStartX - gameObject.x
            const yDiff = this.dragStartY - gameObject.y
            gameObject.x = this.dragStartX
            gameObject.y = this.dragStartY
            //update attached containers position
            this.attachedContainers.forEach(container => {
                container.x += xDiff
                container.y += yDiff
            })
        }

        //destroy location preview
        if (this.locationPreview) {
            this.locationPreview.destroy(true)
        }
    }
    onDragHandler(pointer, gameObject: Phaser.GameObjects.Container, dragX, dragY) {
        if (gameObject != this)
            return
        const xDiff = dragX - gameObject.x
        const yDiff = dragY - gameObject.y
        gameObject.x = dragX
        gameObject.y = dragY

        //update attached containers position
        this.attachedContainers.forEach(container => {
            container.x += xDiff
            container.y += yDiff
        })

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

    setCollision(collisionObjects, callbackFunction?) {
        this.scene.physics.add.collider(this, collisionObjects, callbackFunction)
    }
}

export interface SpriteContainer {
    line: number
    column: number
    collide: boolean
    depth: number
    sprites: ContainedSprites[]
}

export interface ContainedSprites {
    sprite: DraggableSprite
    line: number
    column: number
    z?: number
}