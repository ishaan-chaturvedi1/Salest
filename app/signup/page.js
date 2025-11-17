"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

const page = () => {
    const { data: session } = useSession();
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/Dashboard")
        }
    }, [session, router])
    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
            <div className="flex flex-col gap-5 p-8 m-2 justify-center items-center">
                <button onClick={() => { signIn("google") }} className="flex items-center bg-white border border-gray-300 rounded-lg cursor-pointer w-65 shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48" version="1.1">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g transform="translate(-401,-860)">
                                <g transform="translate(401,860)">
                                    <path d="M9.827 24c0-1.524.253-2.986.705-4.356L2.623 13.604C1.082 16.734.214 20.26.214 24c0 3.737.868 7.261 2.407 10.389l7.905-6.051A14.18 14.18 0 0 1 9.827 24Z" fill="#FBBC05" />
                                    <path d="M23.714 10.133c3.311 0 6.302 1.174 8.652 3.093L39.202 6.4C35.036 2.773 29.695.533 23.714.533c-9.287 0-17.269 5.311-21.091 13.071l7.909 6.04c1.822-5.532 7.017-9.511 13.182-9.511Z" fill="#EB4335" />
                                    <path d="M23.714 37.867c-6.165 0-11.36-3.979-13.182-9.511l-7.909 6.039C6.445 42.156 14.427 47.467 23.714 47.467c5.732 0 11.205-2.035 15.312-5.849l-7.507-5.804a13.1 13.1 0 0 1-7.805 2.053Z" fill="#34A853" />
                                    <path d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714v9.067h12.604c-.63 3.091-2.345 5.467-4.8 7.014l7.507 5.804C43.339 37.614 46.145 31.649 46.145 24Z" fill="#4285F4" />
                                </g>
                            </g>
                        </g>
                    </svg>
                    <span>Continue with Google</span>
                </button>
                <button onClick={() => { signIn("github") }} className="flex items-center bg-white border border-gray-300 rounded-lg cursor-pointer w-65 shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 73" version="1.1">
                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g transform="translate(2,2)" fillRule="nonzero">
                                <rect stroke="#000" strokeWidth="2" fill="#000" x="-1" y="-1" width="71" height="71" rx="14" />
                                <path d="M58.307 21.428c-2.411-4.131-5.681-7.401-9.812-9.812C44.364 9.205 39.854 8 34.961 8c-4.892 0-9.403 1.205-13.533 3.616-4.131 2.41-7.401 5.681-9.812 9.812C9.205 25.56 8 30.07 8 34.961c0 5.875 1.714 11.158 5.143 15.851 3.429 4.693 7.858 7.94 13.288 9.742.632.117 1.1.034 1.404-.246.305-.28.457-.632.457-1.053v-8.873c0-.421-.004-1.463-.016-2.657-.012-1.193-.018-2.235-.018-3.123l-.807.14c-.515.094-1.164.134-1.948.122a17.96 17.96 0 0 1-3.439-.245 5.12 5.12 0 0 1-2.352-1.053 4.8 4.8 0 0 1-1.545-2.037l-.351-.808c-.234-.538-.602-1.135-1.106-1.79a5.4 5.4 0 0 0-1.526-1.334c-.163-.117-.315-.258-.455-.422a1 1 0 0 1-.316-.491c-.07-.164-.012-.299.175-.404.188-.105.527-.156 1.019-.156l.702.105c.468.094 1.047.374 1.738.842.69.468 1.257 1.076 1.702 1.825.539.96 1.188 1.691 1.949 2.194.761.504 1.528.755 2.3.755.772 0 1.439-.059 2.001-.175a6.35 6.35 0 0 0 1.579-.527c.211-1.569.784-2.774 1.72-3.616-1.334-.14-2.533-.351-3.598-.632-1.064-.281-2.164-.737-3.299-1.369a11.9 11.9 0 0 1-2.826-2.352 10.9 10.9 0 0 1-1.843-3.687c-.48-1.522-.72-3.277-.72-5.266 0-2.832.924-5.243 2.773-7.232-.866-2.13-.784-4.517.246-7.162.679-.211 1.685-.053 3.019.474 1.334.526 2.311.977 2.931 1.351.621.374 1.118.691 1.493.948 2.177-.608 4.424-.912 6.741-.912 2.317 0 4.564.304 6.741.912l1.334-.842c.912-.562 1.989-1.077 3.229-1.545 1.24-.468 2.188-.597 2.844-.386 1.052 2.645 1.146 5.032.28 7.161 1.849 1.989 2.774 4.4 2.774 7.232 0 1.99-.241 3.751-.72 5.284-.479 1.533-1.099 2.761-1.859 3.686-.761.925-1.709 1.703-2.844 2.334-1.135.632-2.235 1.088-3.3 1.369a33 33 0 0 1-3.605.633c1.217 1.052 1.825 2.714 1.825 4.984v7.407c0 .421.146.772.439 1.053.293.28.755.363 1.387.246 5.43-1.801 9.859-5.048 13.288-9.74C60.209 46.118 61.923 40.836 61.923 34.961c-.001-4.89-1.207-9.401-3.616-13.533Z" fill="#FFF" />
                            </g>
                        </g>
                    </svg>
                    <span>Continue with Github</span>
                </button>
            </div>
        </div>
    )
}

export default page
