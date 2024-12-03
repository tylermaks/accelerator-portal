/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'v5.airtableusercontent.com',
                port: '',
            }, 
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                port:''
            }
        ]
    },
    logging:{
        fetches: {
            fullUrl: true,
        }
    }  
};

export default nextConfig;
