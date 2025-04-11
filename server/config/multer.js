import multer from "multer";

console.log("hii")
const storage = multer.diskStorage({})

const upload = multer({storage})

export default upload