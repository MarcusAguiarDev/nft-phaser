export function QuickMenu() {
    return (
        <section id="quick-menu" class="quick-menu">
            <QuickMenuItem
                id="quick-menu-inventory"
                text="Inventory"
                icon={<i class="fa fa-solid fa-box-open"></i>} />
            <QuickMenuItem
                id="quick-menu-settings"
                text="Settings"
                icon={<i class="fa fa-solid fa-gear"></i>} />
        </section>
    )
}

export function QuickMenuItem({ id, icon, text }) {
    return (
        <div id={id} class="quick-menu-item" data-content={text}>
            {icon}
        </div>
    )
}

export function InventoryMenu({context, items, inventoryItemClick}) {
    return (
        <section id="inventory-menu" class="inventory-menu">

            <div class="inventory-menu-header feature-header">
                <i class="fa fa-solid fa-box-open"></i>
                Inventory

                <div class="inventory-menu-actions">
                    <div id="inventory-menu-close" class="icon-button close-button">
                        <i class="fa fa-solid fa-close"></i>
                    </div>
                </div>
            </div>

            <div class="inventory-menu-body">
                <div id="inventory-menu-previous" className="icon-button inventory-menu-previous">
                    <i class="fa fa-solid fa-angle-left"></i>
                </div>

                <div class="inventory-menu-items">
                    {items.map(item => {
                        return <InventoryMenuItem
                            id={item.id}
                            title={item.title}
                            nftNumber={item.nftId}
                            imagePath={item.imagePath}
                            clickHandler={inventoryItemClick.bind(context)}/>
                    })}
                </div>

                <div id="inventory-menu-next" className="icon-button inventory-menu-next">
                    <i class="fa fa-solid fa-angle-right"></i>
                </div>
            </div>

        </section>
    )
}

export function InventoryMenuItem({ id, title, nftNumber, imagePath, clickHandler }) {
    return (
        <div class="inventory-menu-item" onclick={clickHandler.bind(null, id)}>
            <div class="inventory-menu-item__title">{title}</div>
            <div class="inventory-menu-item__nft">#{nftNumber}</div>
            <img class="inventory-menu-item__icon" style={`background-image: url("${imagePath}")`} />
        </div>
    )
}