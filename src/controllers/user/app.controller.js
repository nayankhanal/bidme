export const buyerApp = (req, res) => {
    res.render('user/buyer/app/index', {
        title: 'App',
        layout: 'user/buyer/layouts/index'
    });
}

export const sellerApp = (req, res) => {
    res.render('user/seller/app/index', {
        title: 'App',
        layout: 'user/seller/layouts/index'
    });
}

export const activeAuctions = (req, res) => {
    res.render('user/seller/auctions/index', {
        title: 'App',
        layout: 'user/seller/layouts/index'
    });
}