class Responses {
    error(message, res) {
        return res.status(400).json({
            error: message
        });
    }

    success(message, res) {
        return res.status(200).json({
            success: message
        });
    }
}

module.exports = new Responses();
