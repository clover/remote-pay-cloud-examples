(function (module) {
    const base64 = require("base64-js");
    const download = require("image-downloader");
    const fs = require("fs");

    var imageUtil = module.exports;

    imageUtil.create = function () {
        return {
            getBase64Image(img, onEncode) {
                const encoded = base64.fromByteArray(img);
                onEncode(encoded);
            },

            loadImageFromURL(url, onLoad, onError) {
                download.image({
                    url: url,
                    dest: "./"
                }).then(({ filename, image}) => {
                    const bitmap = fs.readFileSync(`./${filename}`);
                    onLoad(bitmap);
                    fs.unlink(`./${filename}`, ()=> {
                        console.log("Temporary image file has been removed.");
                    });
                }).catch((error) => {
                    onError(error);
                });
            }
        }
    }
})(module);
