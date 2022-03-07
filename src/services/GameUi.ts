/**
 * GameUi class
 * responsible for the menu interactions to open other features, setup configurations, etc
 */

import { quickMenu } from "~/dom-components/ui-components"

const QUICK_MENU_ID = 'quick-menu'

export default class GameUi {

    scene: Phaser.Scene
    quickMenuElement!: Phaser.GameObjects.DOMElement
    quickMenuDom!: HTMLDivElement

    timers = new Array<number>()

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.createQuickMenu()
    }

    createQuickMenu() {
        //create quickMenu phaser element and dom
        this.quickMenuElement = this.scene.add.dom(760, 580, quickMenu)
            .setOrigin(1, 1)
            .setVisible(true)
            .setScrollFactor(0)
        this.quickMenuDom = document.getElementById(QUICK_MENU_ID) as HTMLInputElement
    }
}
