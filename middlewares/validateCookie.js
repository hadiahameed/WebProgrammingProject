
module.exports = async (req,res,next) => {
    if(!req.cookies.AuthCookie)
    {
        res.status(403);
        res.render("pages/error", {message: "You are not logged in to view this page!"});
        return;
    }
    else
    {
        next();
    }
}