const path = require('path')
const multer = require('multer')
const d = require('debug')("app:multer")

var storage = multer.diskStorage({
    // destination: (req, file, cb) => {

    //     d('destination file %O', file)

    //     cb(null, 'images')
    // },
    destination: 'backend/public/files/portaleuploads',
    filename: (req, file, cb) => {

        //d('filename file %O percorso %s', file, __dirname)

        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
// var upload = multer({storage: storage});

module.exports = multer({ storage: storage }).single("uploadEventFile")