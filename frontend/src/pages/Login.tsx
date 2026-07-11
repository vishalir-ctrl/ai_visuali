import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import { AuthContext } from "../context/AuthContext";


function Login(){
    const navigate = useNavigate();
    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [message,setMessage] = useState("");


    const auth = useContext(AuthContext);



    async function handleLogin(){

        try{

            const response = await API.post(

                "/auth/login",

                {
                    email,
                    password
                }

            );


            auth?.login(

                response.data.access_token

            );


            setMessage(
                "Login Successful"
            );
            navigate("/dashboard");


        }


        catch(error:any){

            setMessage(

                error.response?.data?.detail ||

                "Login Failed"

            );

        }

    }



    return(

        <div className="min-h-screen flex items-center justify-center">


            <div className="bg-gray-800 p-8 rounded-xl w-96">


                <h1 className="text-3xl font-bold mb-6 text-center">

                    Login

                </h1>



                <input

                className="w-full p-3 mb-3 rounded text-black"

                placeholder="Email"

                onChange={
                    e=>setEmail(e.target.value)
                }

                />



                <input

                className="w-full p-3 mb-3 rounded text-black"

                type="password"

                placeholder="Password"

                onChange={
                    e=>setPassword(e.target.value)
                }

                />



                <button

                className="w-full bg-green-600 p-3 rounded"

                onClick={handleLogin}

                >

                    Login

                </button>



                <p className="text-center mt-4">

                    {message}

                </p>


            </div>


        </div>

    )

}


export default Login;