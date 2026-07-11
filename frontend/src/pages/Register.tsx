import { useState } from "react";

import API from "../services/api";


function Register(){

    const [username,setUsername] = useState("");

    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [message,setMessage] = useState("");



    async function handleRegister(){

        try{

            const response = await API.post(
                "/auth/register",
                {
                    username,
                    email,
                    password
                }
            );


            setMessage(
                response.data.message
            );


        }

        catch(error){

            setMessage(
                "Registration failed"
            );

        }

    }



    return(

        <div className="min-h-screen flex items-center justify-center">


            <div className="bg-gray-800 p-8 rounded-xl w-96">


                <h1 className="test">

                    Register

                </h1>



                <input

                className="w-full p-3 mb-3 rounded text-black"

                placeholder="Username"

                onChange={
                    e=>setUsername(e.target.value)
                }

                />



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

                className="w-full bg-blue-600 p-3 rounded"

                onClick={handleRegister}

                >

                    Register

                </button>



                <p className="mt-4 text-center">

                    {message}

                </p>


            </div>


        </div>

    )

}


export default Register;