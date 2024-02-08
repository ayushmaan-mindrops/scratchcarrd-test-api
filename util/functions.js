const fs = require("fs");

const deleteImage = (imagePath) => {
  try {
    if (imagePath !== "/images/default.jpg") {
      const fullPath = __dirname + "/../" + imagePath;

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Deleted image: ${fullPath}`);
      } else {
        console.log(`Image not found: ${fullPath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting image: ${error.message}`);
  }
};

module.exports = deleteImage;
