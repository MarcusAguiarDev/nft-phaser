/**
 * GameUi class
 * responsible for the menu interactions to open other features, setup configurations, etc
 */

import { InventoryMenu, QuickMenu } from "~/dom-components/ui-components"


const QUICK_MENU_ID = 'quick-menu'
const INVENTORY_MENU_ID = 'inventory-menu'
const QUICK_MENU_INVENTORY_ID = "quick-menu-inventory"
const QUICK_MENU_SETTINGS_ID = "quick-menu-settings"

export default class GameUi {

    scene: Phaser.Scene
    quickMenuElement!: Phaser.GameObjects.DOMElement
    quickMenuDom!: HTMLDivElement

    timers = new Array<number>()

    quickMenuInventoryDom!: HTMLDivElement
    quickMenuSettingsDom!: HTMLDivElement

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.createQuickMenu()
    }

    createInventoryMenu(items: Array<any>) {
        const inventoryMenuElement = this.scene.add.dom(0, 580, InventoryMenu(items))
            .setOrigin(0, 1)
            .setVisible(true)
            .setScrollFactor(0)
        const inventoryMenuDom = document.getElementById(INVENTORY_MENU_ID) as HTMLInputElement

    }

    createQuickMenu() {
        //create quickMenu phaser element and dom
        this.quickMenuElement = this.scene.add.dom(760, 580, QuickMenu())
            .setOrigin(1, 1)
            .setVisible(true)
            .setScrollFactor(0)
        this.quickMenuDom = document.getElementById(QUICK_MENU_ID) as HTMLInputElement

        this.quickMenuInventoryDom = this.quickMenuDom.querySelector(`#${QUICK_MENU_INVENTORY_ID}`) as HTMLDivElement
        this.addInventoryListener()
    }

    addInventoryListener() {        
        this.quickMenuInventoryDom.onclick = e => {
            const items = this.getAccountItems()
            this.createInventoryMenu(items)
            this.quickMenuElement.destroy()
        }
    }
    
    getAccountItems(): Array<any>{
        //TODO  
        return []
    }
}
