export const sellerDashboard = (req, res) => {
    res.render('user/seller/dashboard/index', {
        title: 'App',
        layout: 'user/seller/layouts/index'
    });
}