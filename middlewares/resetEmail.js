module.exports = function (from, to, token) {
    return ({
        from,
        to,
        subject: 'Reset password',
        html :
            `<h1>Вы забыли пароль от аккаунта</h1>
         <p><a href="${from}/auth/password/${token}">Восстановить доступ</a></p>
         `
    })
}
