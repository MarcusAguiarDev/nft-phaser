export const quickMenu = (
    <section id="quick-menu" class="quick-menu">
        <QuickMenuItem
            text="Inventory"
            icon={<i class="fa fa-solid fa-box-open"></i>} />
        <QuickMenuItem
            text="Settings"
            icon={<i class="fa fa-solid fa-gear"></i>} />
    </section>
)

function QuickMenuItem({ icon, text }) {
    return (
        <div class="quick-menu-item" data-content={text}>
            {icon}
        </div>
    )
}