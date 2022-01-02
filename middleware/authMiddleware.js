const protect = (req, res, next) => {
    const { user } = req.session

    if (!user) {
        return res.status(401).json({
            status: 'failed',
            error: 'Unauthorized'
        })
    }

    next()
}

module.exports = protect