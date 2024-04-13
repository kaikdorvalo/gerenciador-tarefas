import app from './app'

declare module 'express-serve-static-core' {
    interface Request {
        user: { _id: string }
    }
}

function main() {
    app.listen(3000, 'localhost', () => {
        console.log('Server running at port 3000')
    })
}

main()