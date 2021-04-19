bcrypt.genSalt(10).then((salt)=>{
    bcrypt.hash(myPassword,salt).then((encryptedPwd)=>{
        var hashcode=encryptedPwd;
        console.log("Hashcode: "+hashcode);
    }).catch((error)=>{
        console.log("Error hash: "+error);
    })
});

bcrypt.compare(myPassword, hashedPassword).then((isMatched)=>{
        if(isMatched){
            console.log("Matched!");
        }else{
            console.log("unmatched!");
        }
    }).catch((err)=>{
        console.log("Error compare: "+err);
    });
    