class Responses {
    error(message, res) {
        return res.status(400).json({
            error: message
        });
    }

    notFound(res) {
        return res.status(404).json({
            error: 'Not found'
        });
    }

    conflict(msg, res) {
        return res.status(409).json({
            error: msg || 'Conflict!'
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
