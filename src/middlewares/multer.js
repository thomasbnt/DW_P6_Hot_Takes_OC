const multer = require("multer");
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
}

function getFileNameWithoutExtension(filename) {
    return filename.split('.').slice(0, -1).join('.')
}



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/images')
    },
    filename: (req, file, cb) => {
        /*console.log(MIME_TYPE_MAP[file.mimetype])*/
        cb(null, `${getFileNameWithoutExtension(file.originalname)}-${+Date.now()}.${MIME_TYPE_MAP[file.mimetype]}`)
    }
})

module.exports = multer({storage: storage});
