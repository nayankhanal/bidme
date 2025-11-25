export const activeAuctions = (req, res) => {
    res.render('user/seller/auctions/index', {
        title: 'App',
        layout: 'user/seller/layouts/index'
    });
}

export const createAuction = (req, res) => {
    res.render('user/seller/auctions/create', {
        title: 'App',
        layout: 'user/seller/layouts/index'
    });
}