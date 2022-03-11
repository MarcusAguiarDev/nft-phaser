import Phaser from 'phaser'
import Player from '~/game-objects/Player'

export default class SquareScene extends Phaser.Scene {

    player!: Player

    constructor() {
        super('squareScene')
    }
    preload() {
        //player sprites
        this.load.spritesheet('player', '../assets/characters/player1.png', {
            frameWidth: 32,
            frameHeight: 64,
        })
        //map sprites
        this.load.image('tilesTerrain', '../assets/maps/tiles/terrain.png')
        this.load.tilemapTiledJSON('square', '../assets/maps/square.json')
        //collider image
        this.load.image('collider', '../assets/objects/collider.png')
    }

    create() {
        //Add map
        const map = this.make.tilemap({ key: 'square', tileWidth: 32, tileHeight: 32 })
        //add tileset
        const tileset = map.addTilesetImage('terrain', 'tilesTerrain')
        //Create map layers
        const sidewalk = map.createLayer('sidewalk', tileset)
        const street = map.createLayer('street', tileset)
        const grass = map.createLayer('grass', tileset)
        const lake = map.createLayer('lake', tileset)
        const landscape = map.createLayer('landscape', tileset)
        const landscapeCollider = map.createLayer('landscape-collider', tileset)
        const bridge = map.createLayer('bridge', tileset)
        //Add Player
        this.player = new Player(this, 200,200, 'player', 'Marcus')

        //Add top layer
        const top = map.createLayer('top', tileset).setZ(99)
        //Collider objects
        const lakeCollider1 = this.physics.add.staticSprite(572,482, 'collider').setAlpha(0)
        lakeCollider1.body.setCircle(74)
        const lakeCollider2 = this.physics.add.staticSprite(572,674, 'collider').setAlpha(0)
        lakeCollider2.body.setCircle(74)
        //Set collider
        landscapeCollider.setCollisionByExclusion([-1])
        this.physics.add.collider([this.player, this.player.attachedContainer], [lakeCollider1, lakeCollider2, landscapeCollider])
        //Set camera
        this.cameras.main.startFollow(this.player)
    }

    update(time: number, delta: number): void {
        this.player.update()
    }

}