import Phaser from 'phaser'

import DraggableContainer, { DraggableContainedSprites } from '~/game-objects/DraggableContainer'
import DraggableSprite from '~/game-objects/DraggableSprite'


import MiningRig from '~/game-objects/MiningRig'
import Player from '~/game-objects/Player'
import GameUi from '~/services/GameUi'
import { MapObjectsState } from '~/services/MapObjectsState'


export default class RoomScene extends Phaser.Scene {

    player!: Player
    mapObjectsState!: MapObjectsState


    constructor() {
        super('roomScene')
    }
    preload() {
        this.load.spritesheet('player', '../assets/characters/player1.png', { frameWidth: 32, frameHeight: 64 })
        this.load.spritesheet('laptops', '../assets/objects/laptops.png', { frameWidth: 32, frameHeight: 32 })
        this.load.image('tiles', '../assets/maps/tiles/icecream.png')
        this.load.tilemapTiledJSON('room', '../assets/maps/room.json')
        this.load.image('collider', '../assets/objects/collider.png')
    }

    create() {

        //Add map
        const map = this.make.tilemap({ key: 'room' })
        //add tileset
        const tileset = map.addTilesetImage('icecream', 'tiles', 32, 32)
        //Create map layers
        const tileWidth = 32
        const tileHeight = 32
        const mapTilerWidth = 15
        const mapTilerHeight = 12
        const mapX = (-mapTilerWidth * tileWidth / 2)
        const mapY = (-mapTilerHeight * tileHeight / 2)
        const ground = map.createLayer('ground', tileset, mapX, mapY)
        const walls = map.createLayer('walls', tileset, mapX, mapY)

        //create MapObjects state
        const groundLayer = map.getLayer('ground')
        this.mapObjectsState = new MapObjectsState(groundLayer)

        //add objects
        const containedSprites: DraggableContainedSprites[] = [
            {
                line: 1,
                column: 1,
                sprite: new DraggableSprite(this, 'laptops', 0),
                z: 1
            },
            {
                line: 1,
                column: 1,
                sprite: new DraggableSprite(this, 'laptops', 4),
                z: 2
            },
            {
                line: 2,
                column: 1,
                sprite: new DraggableSprite(this, 'laptops', 9),
                z: 1
            },
        ]
        const dragContainer = new DraggableContainer(this, this.mapObjectsState, 8, 8, containedSprites)

        //Add Player
        this.player = new Player(this, 0, 0, 'player', 'Marcus')

        //Add out collider  
        const outCollider = this.physics.add.staticSprite(0, 6 * tileHeight + 16, 'collider')
        outCollider.setBodySize(3 * tileWidth, 1 * tileHeight).setAlpha(0)
        this.physics.add.collider(this.player, outCollider, () => {
            this.scene.start('squareScene')
        })
        //Set colliders
        walls.setCollisionByExclusion([-1])
        this.physics.add.collider([this.player, this.player.attachedContainer], [walls])
        //Set camera
        this.cameras.main.startFollow(this.player)
        //Create Game UI
        const gameUi = new GameUi(this)
    }

    update(time: number, delta: number): void {

        this.player.update()
    }

}