export const loginPage = (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        layout: false
    });
}

export const registerPage = (req, res) => {
    res.render('auth/signup', {
        title: 'Sign Up',
        layout: false
    });
}

export const adminLoginPage = (req, res) => {
    res.render('admin/login', {
        title: 'Admin Login',
        layout: false
    });
}