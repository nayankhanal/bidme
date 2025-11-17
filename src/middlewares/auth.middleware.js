export const isAuthenticated = (req, res, next) => {

    if (req.session.user) {
        next()
    } else {
        // return res.status(401).json({
        //     success: false,
        //     message: "Unauthorized"
        // })

        req.flash('error_msg', 'Unauthorized');
        return res.redirect('/login');
    }
}

export const isAdmin = (req, res, next) => {

    if (req.session.user.role === 'ADMIN') {
        next()
    } else {
        // return res.status(401).json({
        //     success: false,
        //     message: "Unauthorized"
        // })

        req.flash('error_msg', 'Unauthorized');
        return res.redirect('/login');
    }
}