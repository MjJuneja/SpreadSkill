'use strict';

const User = require("../schemadefine");
const utils =require("../utils");

const dbOperations= {

    ////////Checking if username exists  ///////////////////// 
    checkUsername:function (object,callback){
         const logger = require("../logger");
            logger.debug('debuggggg');
            logger.error('errorrrrrr');
       
		
        User.find({"username":object.username},function(error,result){
            if(error){
                console.log("Error Occured",error);
            }
            else{ 
                if(result[0]!=undefined){
                    object.notFound=false;
                }
                else
                {
                    object.notFound=true;
                }
            }
            callback();
        });
    },   

    ///////////Email activation /////////////////////////
    ////////Checking token for activation
    checkToken:function(request,response){
        var that=this;
        var activationObject=request.body;

        User.find({
            "$and":[
                {
                    "useremail":activationObject.userEmail
                }, 
                {
                    "emailactivationtoken":activationObject.token
                }
            ]
        }
        ,function(error,result){
            if(error){
                console.log("Error Occured",error);
            }
            else{
                if(result.length<1){
                    response.json({message:"fail"});
                }
                else{
                    that.activateEmail(activationObject.userEmail,response);
                }
            } 
        });
    },

    //////////Activating email
    activateEmail:function (userEmail,response){
        User.update({
            "useremail":userEmail
        },
        {
            $set:{
                "emailverified":true,
                "emailactivationtoken":undefined
            }
        },
        function(error,result){
            if(error){
                console.log("Error Occured",error);
            }
            else{ 
                response.json({message:"success"});
            }
        });
    },  


    // //////////////////Social Signin//////////////////////////
    // ///////////Check if user exists
    // socialSignin:function(request,response){
    //     var that=this;
    //     var SocialObject=request.body;
        
    //     User.find({
    //         "useremail":SocialObject.Email
    //     }
    //     ,function(error,result){
    //         if(error){
    //             console.log("Error Occured",error);
    //         }
    //         else if(result){
    //             if(result[0]===undefined){
    //                 that.socialRegister(request,response);
    //             }
    //             else{
    //                 var sessionData=result[0];
    //                 var responseObject={
    //                     message:"loggedIn",
    //                 };
    //                 utils.fillSession(request,response,sessionData,responseObject);
    //             }
    //         }
    //         else{
    //             response.json({message:"fail"});
    //         }
    //     })
    // },   


    
    
    // ////////Register new User
    // socialRegister:function(request,response){
    //     var SocialObject =request.body;
    //     var aPosition=SocialObject.Email.indexOf("@");
    //     var userName=SocialObject.Email.substring(0,aPosition);

    //     var UserData={};
    //     UserData.userinfo={};
    //     UserData.useremail=SocialObject.Email;
    //     UserData.username=userName;
    //     UserData.password1="social";
    //     UserData.role="customer";
    //     UserData.registrationdate=new Date();
    //     UserData.userinfo.fullname=SocialObject.FullName;
    //     UserData.emailverified=true;
    //     UserData.socialconnection=SocialObject.Social;

    //     User.create(UserData,function(error,result){
    //         if(error){
    //             response.json({message:"Can't Add Error Occured, Try later"});
    //         }
    //         else{
    //             var responseObject={
    //                 message:"registered",
    //             };
    //             utils.fillSession(request,response,result,responseObject);
    //         }
    //     });
    // },

    //////////////////Social Signin//////////////////////////
    ///////////Check if user exists
    socialSignin:function(request,response,done){
        var that=this;
        var SocialObject=request.body;
        
        User.find({
            "useremail":SocialObject.Email
        }
        ,function(error,result){
            if(error){
                console.log("Error Occured",error);
                return done(null);
            }
            else if(result){
                if(result[0]===undefined){
                    that.socialRegister(request,response,done);
                }
                else{
                    var sessionData=result[0];
                    var responseObject={    //No use
                        message:"loggedIn",
                    };
                    utils.fillSession(request,response,sessionData,responseObject);
                    return done(null);
                }
            }
            else{
                return done(null);
            }
        })
    },   


    
    
    ////////Register new User
    socialRegister:function(request,response,done){
        var SocialObject =request.body;
        var aPosition=SocialObject.Email.indexOf("@");
        var userName=SocialObject.Email.substring(0,aPosition+1);
        userName=userName+SocialObject.Social;

        var UserData={};
        UserData.userinfo={};
        UserData.useremail=SocialObject.Email;
        UserData.username=userName;
        UserData.password1="social";
        UserData.role="customer";
        UserData.registrationdate=new Date();
        UserData.userinfo.fullname=SocialObject.FullName;
        UserData.emailverified=true;
        UserData.socialconnection=SocialObject.Social;
        UserData.facebookId=SocialObject.facebookId;
        UserData.facebookAccessToken=SocialObject.accessToken;

        User.create(UserData,function(error,result){
            if(error){
                response.json({message:"Can't Add Error Occured, Try later"});
                return done(null);
            }
            else{
                var responseObject={     //No use
                    message:"registered",
                };
                utils.fillSession(request,response,result,responseObject);
                return done(null);
            }
        });
    },


    ////////////Send Activation/forgotpassword link//////////////
    sendLink:function(UserEmail,Page,TokenType){
        const config =require("../config");
        var RandomToken=utils.randomStringGenerate(32);
        var Query={};
        if(TokenType==="forgotpasswordtoken"){
            Query["passwordtokenstamp"]=new Date();
        }
        Query[TokenType]=RandomToken;
        var Url= config.reqUrl+"/#/"+Page+"?e="+UserEmail+"&t="+RandomToken;

        User.update({
            "useremail":UserEmail
        }, 
        {
            $set:Query
        },
        function(error,result){
            if(error){
                console.log("Error Occured",error);
            }
            else{ 
                utils.sendMail(UserEmail,"sub",Url);
            }
        });
        
    },

    ///////// Mobile Application only operations////////////

    getProfileData:function(id,userData,callback){
        const AppSession=require('../appsessdbschema');
        AppSession.find({sessionid:id},function(error,result){
            if(error){
                console.log(error);
            }
            else{
                userData=result[0];
            }
            callback(userData);
        });
    },
};

module.exports =dbOperations; 
