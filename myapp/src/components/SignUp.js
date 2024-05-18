import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
}
from 'mdb-react-ui-kit';
import './SignUp.css'
import UserService from '../services/UserService';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';

function SignUp() {

    const navigate = useNavigate()

    const [newUser,setNewUser] = useState({
        name:'',
        email:'',
        username:'',
        phone:'',
        password:''
    })
  

    const handleSubmit = (event)=>{
      event.preventDefault();
        UserService.registerUser(newUser).then((resp)=>{
            console.log("registered")
            toast.success(`${newUser.username} is registered!`)
            setTimeout(() => {
                navigate('/login')
            }, 2000);
        }).catch((error)=>{
            console.log("error in registering")
        })
    }

   const handleChange = (event)=>{
    setNewUser({...newUser,[event.target.name]:event.target.value})
   }

  return (
    <>
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)' }}>
    <div className='mask gradient-custom-3'></div>
    <MDBCard className='m-5' style={{ maxWidth: '600px' }}>
      <MDBCardBody className='px-5'>
        <h2 className="text-uppercase text-center mb-5">Create an account</h2>
        <Form onSubmit={handleSubmit}>
        <MDBInput wrapperClass='mb-4' name='name' value={newUser.name} label='Your Name' size='lg' id='form1' type='text' onChange={handleChange} />
        <MDBInput wrapperClass='mb-4' name='email' value={newUser.email} label='Your Email' size='lg' id='form2' type='email' onChange={handleChange} />
        <MDBInput wrapperClass='mb-4' name='username' value={newUser.username} label='Username' size='lg' id='form3' type='text' onChange={handleChange} />
        <MDBInput wrapperClass='mb-4' name='phone' value={newUser.phone} label='Phone Number' size='lg' id='form6' type='number' onChange={handleChange} />
        <MDBInput wrapperClass='mb-4' name='password' value={newUser.password} label='Password' size='lg' id='form4' type='password' onChange={handleChange} />
        <MDBInput wrapperClass='mb-4' name='repeatPass' label='Repeat your password' size='lg' id='form5' type='password' />
        {/* <div className='d-flex flex-row justify-content-center mb-4'>
          <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree to all statements in Terms of service' />
        </div> */}
        <br/>
        <MDBBtn className='mb-4 w-100' color='info' size='lg' type='submit'>Register</MDBBtn>
        </Form>
      </MDBCardBody>
    </MDBCard>
  </MDBContainer>
  <ToastContainer/>
  </>
  );
}

export default SignUp;