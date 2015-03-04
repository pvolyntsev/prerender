module.exports = {
    beforeSend: function(req, res, next) {
        if(!req.prerender.documentHTML) {
            return next();
        }

        req.prerender.documentHTML = req.prerender.documentHTML.toString().replace(/<!--[^>]*-->/gi, ''); // comments
        req.prerender.documentHTML = req.prerender.documentHTML.toString().replace(/>\s+</gi, '><'); // spaces between tags
        req.prerender.documentHTML = req.prerender.documentHTML.toString().replace(/>\s\s+/g, '> '); // spaces after tags
        req.prerender.documentHTML = req.prerender.documentHTML.toString().replace(/\s\s+</g, ' <'); // spaces before tags
        next();
    }
};
