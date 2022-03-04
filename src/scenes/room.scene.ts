import Phaser from 'phaser'
import Player from '~/services/Player'

class RoomScene extends Phaser.Scene {

    player!: Player

    constructor() {
        super('room-scene')
    }
    preload() {
        this.load.spritesheet('player', '../assets/characters/player1.png', {
            frameWidth: 32,
            frameHeight: 64,
        })
    }

    create() {
        const playerElement = this.physics.add.sprite(400, 300, 'player')
        this.player = new Player(this, playerElement)
    }

    update(time: number, delta: number): void {

    }

}


export default RoomScene