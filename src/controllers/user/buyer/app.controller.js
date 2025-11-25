export const buyerApp = (req, res) => {
    res.render('user/buyer/app/index', {
        title: 'App',
        layout: 'user/buyer/layouts/index'
    });
}