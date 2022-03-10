/**
 *  GameUi class
 *  responsible for the menu interactions to open other features,
 *  setup configurations, etc
 */

import { InventoryMenu, QuickMenu } from "~/dom-components/ui-components"


const QUICK_MENU_ID = 'quick-menu'
const INVENTORY_MENU_ID = 'inventory-menu'
const QUICK_MENU_INVENTORY_ID = "quick-menu-inventory"
const QUICK_MENU_SETTINGS_ID = "quick-menu-settings"
const QUICK_MENU_CLOSE = "inventory-menu-close"

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

        //test
        // this.inventoryItemClick(2)
    }

    inventoryItemClick(itemId: number) { 

        const x = 0
        const y = 0
    }

    createInventoryMenu(items: Array<InventoryItem>) {
        const props = {
            context: this,
            items,
            inventoryItemClick: this.inventoryItemClick,
        }
        const inventoryMenuElement = this.scene.add.dom(0, 580, InventoryMenu(props))
            .setOrigin(0, 1)
            .setVisible(true)
            .setScrollFactor(0)
        const inventoryMenuDom = document.getElementById(INVENTORY_MENU_ID) as HTMLInputElement

        const closeMenu = inventoryMenuDom.querySelector(`#${QUICK_MENU_CLOSE}`) as HTMLDivElement
        closeMenu.onclick = () => {
            inventoryMenuElement.destroy()
            this.createQuickMenu()
        }
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

    getAccountItems(): Array<InventoryItem> {
        //TODO  
        return mockIventoryItems
    }
}

interface InventoryItem {
    id: number,
    title: string,
    nftId: string,
    imagePath: string
}

const mockIventoryItems = [
    { id: 1, title: "Renan", nftId: "2424", imagePath: "assets/objects/renan.jpg" },
    { id: 2, title: "Marcus", nftId: "1234", imagePath: "assets/objects/marcus.jpg" },
    { id: 3, title: "Bolsonaro", nftId: "1717", imagePath: "assets/objects/bolsonaro.jpg" },
]