
const isDev = process.env.NODE_ENV === "development";

const HandleEmptyEnv = (env: string) => {
    if(!env) {
        throw new Error(`${env} is not set`);
    }
    return env;
}
export const config = {
    socketUrl: (() => {
        const socketUrl = isDev ? process.env.NEXT_PUBLIC_SOCKET_URL as string : process.env.NEXT_PUBLIC_SOCKET_URL_PROD as string;
        return HandleEmptyEnv(socketUrl);
    })()
}

