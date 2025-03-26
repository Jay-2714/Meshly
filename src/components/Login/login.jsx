import React, { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import "./login.css";
import { auth } from "../../firebase/firebase";
import { toast } from "react-hot-toast";

const Login = () => {
 const navigate = useNavigate();

    useEffect(() => {
        setEmail("");
        setPassword("");
      }, []);

      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [isPasswordVisible, setIsPasswordVisible] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        

        try {
            if(auth.currentUser?.emailVerified){
            await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            toast.success("Logged in successfully!");
            setEmail("");
            setPassword("");   
            navigate("/");
          }
            else{
              toast.error("Please verify your email address first.");
      
            }
          
      
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
                <p className="error-paragraph" aria-live="polite">
                </p>
                <h3>Login</h3>
                
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
                    <Link to={'/forgot-password'} className="forgot-pass">Forgot password?</Link>
                </div>
                <button className="sign-in-button">
                    Login
                </button>
                <p className="sign-in-redirect-p">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </main>
    );
};

export default Login;