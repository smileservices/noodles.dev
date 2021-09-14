export const toggleSidebarUtil = () => {
    if (innerWidth > 600) {
        document.querySelector('body').classList.toggle('sidebar-visible');
    } else {
        document.querySelector('body').classList.toggle('sidebar-visible-mobile');
    }
}