import multer from "multer";

const storage = multer.memoryStorage();

const upladFile = multer({storage}).single("file");

export default upladFile;