export default function createAnimations(anims: Phaser.Animations.AnimationState) {
    anims.create({
        key: 'walk-right',
        frames: anims.generateFrameNumbers('player', { start: 112, end: 117 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idle-right',
        frames: [{ key: 'player', frame: 0 }]
    })
    anims.create({
        key: 'walk-up',
        frames: anims.generateFrameNumbers('player', { start: 118, end: 123 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idle-up',
        frames: [{ key: 'player', frame: 1 }]
    })
    anims.create({
        key: 'walk-left',
        frames: anims.generateFrameNumbers('player', { start: 124, end: 128 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idle-left',
        frames: [{ key: 'player', frame: 2 }]
    })
    anims.create({
        key: 'walk-down',
        frames: anims.generateFrameNumbers('player', { start: 130, end: 135 }),
        frameRate: 10,
        repeat: -1
    })
    anims.create({
        key: 'idle-down',
        frames: [{ key: 'player', frame: 3 }]
    })
}