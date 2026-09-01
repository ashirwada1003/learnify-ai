const authorizeRoles = (...allowedRoles)=>{
    // Rest = gathering multiple separate arguments into one array (this is what's happening here — authorizeRoles("instructor", "admin") becomes allowedRoles = ["instructor", "admin"])
    return(req,res,next)=>{
        if(!req.user){
            return res.status(403).json({
                message:"Not authenticated"
            });
        }

        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message:"you do not have permission to perform this action"
            });
        }
        next();
    }
};

module.exports = authorizeRoles;