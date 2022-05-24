import {request} from 'gaxios';
import {google} from 'googleapis';

const scopesGoogle = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
];

const generateAuthUrlGoogle = {
    access_type: 'offline',
    scope: scopesGoogle,
}

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
const urlRedirect = oauth2Client.generateAuthUrl(generateAuthUrlGoogle);

export const getUrlRedirect = ()=>{
    return urlRedirect;
}

export const codparser = async(url : string)=>{
    let rawurl=url;
    let unreplacedurl=rawurl.substring(rawurl.indexOf("code=")+5,rawurl.indexOf("&scope="));
    var code=unreplacedurl.replace("%2F","/");
    let {tokens} =await oauth2Client.getToken(code)
    return tokens.access_token
}

export const httpcaller = async (gottoken: string)=>{
    const userdata=await request({
        baseURL: 'https://www.googleapis.com',
        url:'/oauth2/v2/userinfo',
        headers: {'Authorization': 'Bearer ' + gottoken}
    })
    return (userdata.data)
}