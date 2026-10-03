import multer from "multer"

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, './temp/uploads')
    },

    filename: function(req,file,cb){
        cb(null,file.originalname + Math.floor(Math.random()*9));
    }

})

const upload = multer({storage:storage})

export {upload}