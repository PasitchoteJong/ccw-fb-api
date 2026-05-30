
export function register(req,res){
    res.json({
        message:'Register controller'    
    })
}

export function login(req,res) {
    res.json({
    msg : 'Login controller',
    body : req.body
  })
}