const multer = require('multer')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'portaleuploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
// var upload = multer({storage: storage});

module.exports = multer({ storage: storage }).single("uploadEventFile")