import { clerkClient } from "@clerk/express";

//Middleware (Protect Educator Routes)

export const ProtectEducator = async (req, res, next)=>{
     try {
       const userId = req.auth.userId;
       const response = await clerkClient.users.getUser(userId);
       
       if(response.publicMetadata.role !== 'educator'){
        return res.json({success:false, message: 'Unaouthorize Access'})
       }
       next()
     } catch (error) {
        
     }
}