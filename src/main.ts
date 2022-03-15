/**
 * Main file
 */

import Phaser from 'phaser'
import RoomScene from './scenes/RoomScene'
import SquareScene from './scenes/SquareScene'


const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    pixelArt: true,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    autoFocus: true,
    scene: [RoomScene, SquareScene]
}

export default new Phaser.Game(gameConfig)