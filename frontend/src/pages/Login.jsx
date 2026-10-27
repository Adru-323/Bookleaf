import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [formData , setFormData] = useState({
        email :"",password:""
    })
    const [error , setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e)=> {
        setFormData((prev) =>({...prev,[e.target.name]:e.target.value}));
    };

    const handleSubmit = async(e)=> {
        
        try{
             e.preventDefault();
            const response = await axios.post(`${API_URL}/auth/login`,formData,{withCredentials:true});
           console.log("Login response:", response.data);
           console.log("User role:", response.data.role);
              const { role } = response.data;
             
        if (role === "author") {
            navigate("/author/dashboard");
        } else if (role === "admin") {
            navigate("/admin/dashboard");
        } else {
            setError("Invalid user role");
        }
            
        }catch(error){
            setError(error.response?.data?.message|| "something went wrong ")
            console.error(error.response?.data || error.message);        
        }
    }



    return (  
    <div className="container mt-5 py-5 justify-content-center ">
   <form onSubmit={handleSubmit}>
    <h1>{error}</h1>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" onChange={handleChange} name="email" value={formData.email} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>

  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input   type="password" onChange={handleChange} name="password" value={formData.password} className="form-control" id="exampleInputPassword1"/>
  </div>

  <button type="submit" className="btn btn-primary mb-5">Submit</button>
</form>
<button type="button" className="btn btn-secondary" onClick={ ()=> navigate("/")}>Back</button>
    </div>
    );
}

export default Login;
