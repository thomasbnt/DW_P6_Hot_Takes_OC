class Responses {
    error(message, res) {
        return res.status(400).json({
            error: message
        });
    }

    invalidCredentials(res) {
        return res.status(401).json({
            error: 'Invalid credentials'
        });
    }

    success(message, res) {
        return res.status(200).json({
            success: message
        });
    }
}

module.exports = new Responses();
