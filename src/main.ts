/**
 * Main file
 */

import Phaser from 'phaser'
import RoomScene from './scenes/room.scene'

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    scene: [RoomScene]
}

export default new Phaser.Game(gameConfig)