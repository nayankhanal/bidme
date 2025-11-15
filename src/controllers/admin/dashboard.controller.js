export const dashboardPage = (req, res) => {
    res.render('admin/auctions/index', {
        title: 'Dashboard',
        layout: 'admin/layouts/index'
    });
}