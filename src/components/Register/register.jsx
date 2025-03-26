import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification 
} from "firebase/auth";
import "./register.css";
import { auth } from "../../firebase/firebase";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);






    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCred = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCred.user;
            await sendEmailVerification(user);
            toast.success("Email verification link sent");
            setEmail("");
            setPassword("");
            navigate("/login");
          } catch (err) {
            if (err instanceof Error) {
              toast.error(err.message);
            } else {
              toast.error("An error occurred while logging in.");
            }
          }
        };
      
    

    return (
        <main className="main-sign_in_container">
            <form onSubmit={handleSubmit} className="sign-in-container">
                <h3>Register</h3>
                
                <div className="input-div">
                    <label htmlFor="email">Email</label>
                    <input 
                        name="email" 
                        id="email" 
                        type="email"
                        placeholder="Enter your email" 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>
                <div className="input-div">
                    <label htmlFor="password">Password</label>
                    <input 
                        name="password" 
                        id="password" 
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <Link to={'#'} className="forgot-pass">Forgot password?</Link>
                </div>
                <button className="sign-in-button" >
                    Register
                </button>
                <p className="sign-in-redirect-p">
                    Don't have an account? <Link to="/Login">Login</Link>
                </p>
            </form>
        </main>
    );
};

export default Register;
