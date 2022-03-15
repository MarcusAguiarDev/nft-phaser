import Player from "~/game-objects/Player"
import DraggableSprite from "~/game-objects/DraggableSprite"
import { MapObjectsState } from "~/services/MapObjectsState"

export default class SandboxScene extends Phaser.Scene {

    constructor() {
        super('SandboxScene')
    }

    player!: Player
    mapObjectsState!: MapObjectsState

    preload() {
        this.load.spritesheet('player', 'assets/characters/player1.png', { frameWidth: 32, frameHeight: 64 })
        this.load.spritesheet('laptops', 'assets/objects/laptops.png', { frameWidth: 32, frameHeight: 64 })
        this.load.tilemapTiledJSON('room', 'assets/maps/room.json')
        this.load.image('tiles', 'assets/maps/tiles/icecream.png')
    }

    create() {

        //map
        const map = this.add.tilemap('room')
        const tileset = map.addTilesetImage('icecream', 'tiles')


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

        const deskOBject = new DraggableSprite(this, this.mapObjectsState, 64, 0, 'laptops', 0)
        const deskOBject2 = new DraggableSprite(this, this.mapObjectsState, 128, 0, 'laptops', 1)
        const deskOBject3 = new DraggableSprite(this, this.mapObjectsState, -64, 0, 'laptops', 2)


        //player
        this.player = new Player(this, 0, 0, 'player', 'Marcus')
        this.cameras.main.startFollow(this.player)
    }

    update(time: number, delta: number): void {
        this.player.update()
    }
}