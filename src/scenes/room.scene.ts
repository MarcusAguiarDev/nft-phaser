import Phaser from 'phaser'
import Player from '~/services/Player'

class RoomScene extends Phaser.Scene {

    player!: Player

    constructor() {
        super('room-scene')
    }
    preload() {
        //player sprites
        this.load.spritesheet('player', '../assets/characters/player1.png', {
            frameWidth: 32,
            frameHeight: 64,
        })
        //map sprites
        this.load.image('tiles', '../assets/maps/tiles/icecream.png')
        this.load.tilemapTiledJSON('room', '../assets/maps/room.json')
    }

    create() {
        //Add map
        const map = this.make.tilemap({ key: 'room', tileWidth: 32, tileHeight: 32 })
        //add tileset
        const tileset = map.addTilesetImage('icecream', 'tiles')
        //Create map layers
        const ground = map.createLayer('ground', tileset)
        const walls = map.createLayer('walls', tileset)
        //Add Player
        const playerElement = this.physics.add.sprite(0, 0, 'player')
        this.player = new Player(this, playerElement)
        //Set collider
        walls.setCollisionByExclusion([-1])
        this.physics.add.collider(this.player.player, walls)
        //Set camera
        this.cameras.main.startFollow(this.player.player)
    }

    update(time: number, delta: number): void {

    }

}

export default RoomScene