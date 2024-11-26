const logging = (req,res,next) => {
    
    console.log(`Request made at ${new Date()} for ${req.method} ${req.path}`);
    next();
}
module.exports = logging;