export const orders = (req, res) => {
    res.render('user/seller/orders/index', {
        title: 'App',
        layout: 'user/seller/layouts/index'
    });
}