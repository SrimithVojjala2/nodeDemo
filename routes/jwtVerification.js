const jwt = require('jsonwebtoken');
const jwtVerification = (req,res,next) => {
    const token = req.header('Authorization').split(' ')[1];
    if(!token){
        return res.status(401).send('Access Denied');
    }
    try{
        const verified = jwt.verify(token,process.env.JWT_SECRET_TOKEN,(err,verified) => {
            if(err){
                req.status(400).send('Invalid Token');
            }
            req.user = verified;
        });
        next();
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}

module.exports = jwtVerification;