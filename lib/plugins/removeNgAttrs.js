module.exports = {
    beforeSend: function(req, res, next) {
        if(!req.prerender.documentHTML) {
            return next();
        }

        req.prerender.documentHTML = req.prerender.documentHTML.toString().replace(/\sng-\w+="[^"]+"/gi, ''); // ng-attr="binding"
        req.prerender.documentHTML = req.prerender.documentHTML.toString().replace(/\sng-\w+-\w+="[^"]+"/gi, ''); // ng-attr-content="binding"
        next();
    }
};
