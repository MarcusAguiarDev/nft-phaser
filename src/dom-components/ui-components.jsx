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

export function InventoryMenu(items) {
    return (
        <section class="inventory-menu">
            {items.map(item => {
                <InventoryMenuItem
                    title={item.title}
                    nftNumber={item.nftNumber}
                    image={item.image} />
            })}
        </section>
    )
}

export function InventoryMenuItem({ title, nftNumber, image }) {
    return (
        <div class="inventory-menu-item">
            <div class="inventory-menu-item__title">{title}</div>
            <div class="inventory-menu-item__nft">#{nftNumber}</div>
            <div class="inventory-menu-item__icon">

            </div>
        </div>
    )
}