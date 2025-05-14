/** @type {import('next').NextConfig} */
import path from 'node:path';

const nextConfig = {
    experimental: {
        serverActions: {
          allowedOrigins: [process.env.URL_ROOT],
        },
    },
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
    },
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(process.cwd(), 'src');
        return config;
    },
};

export default nextConfig;
