const multer = require("multer");
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        /*console.log(file)
        console.log(MIME_TYPE_MAP[file.mimetype])*/
        cb(null, `${file.originalname}-${+Date.now()}.${MIME_TYPE_MAP[file.mimetype]}`)
    }
})

module.exports = multer({storage: storage});
