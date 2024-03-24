import 'dotenv/config'
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export class Jwt {
    public generateAccessToken(_id: string, username: string): string {
        const payload = {
            _id: _id,
            userName: username
        }

        const secret = process.env.JWT_SECRET!;

        const accessToken = jwt.sign(
            payload,
            secret,
            { expiresIn: '300s' }
        )

        return accessToken;
    }

    public generateRefreshToken(_id: string, username: string): string {
        const payload = {
            _id: _id,
            userName: username
        }

        const secret = process.env.REFRESHTOKEN_SECRET!;

        const refreshToken = jwt.sign(
            payload,
            secret,
            { expiresIn: '1d' }
        )

        return refreshToken;
    }

    public verify(token: string, secret: string, callback: (err: any, decode: any) => any): any {
        return jwt.verify(
            token,
            secret,
            (err, decode) => {
                callback(err, decode);
            }
        )
    }

}
