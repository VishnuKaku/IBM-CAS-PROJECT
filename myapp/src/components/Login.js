import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput} from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import UserService from '../services/UserService';
import { useDispatch } from 'react-redux';
import { setCurrentUser, setLoggedIn, setToken } from '../redux/UserSlice';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username,setUsername] = useState({})
    const [show, setShow] = useState(false);
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (event) => {
        event.preventDefault();


        try {
            console.log(credentials)
            const resp = await UserService.login(credentials);

            if (resp.status === 200) {

                console.log(resp.data.user._id)
                dispatch(setLoggedIn(true))
                dispatch(setCurrentUser(resp.data.user))
                dispatch(setToken(resp.data.token))

                navigate('/profile')
            }
            else {
                toast.error('Invalid credentials')
            }

        } catch (error) {
            toast.error('Invalid credentials')
            // setCredentials({ username: '', password: '' })
            console.error('Login failed:', error.message);
        }
    };

    const handleChange = (event) => {

        setCredentials({ ...credentials, [event.target.name]: event.target.value })
    }

    const handleUsernameChange = (event)=>{

        setUsername({[event.target.name]:event.target.value})

    }

    const handleGetPassword = async ()=>{
        try {
            const resp = await UserService.forgotPassword(username)
            if(resp.status === 200){
               toast.success('Password Sent to Mail')
            }
        } catch (error) {
            toast.error('Username does not exist');
        }
       
        setShow(false)
    }

    return (
        <>
            <MDBContainer className='align-items-center justify-content-center bg-image' fluid style={{ backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)' }}>
            <div className='mask gradient-custom-3'></div>
                <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                    <MDBCol col='12'>

                        <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                            <MDBCardBody className='p-5 w-100 d-flex flex-column'>

                                <h2 className="fw-bold mb-2 text-center">Sign in</h2>
                                <p className="text-white-50 mb-3">Please enter your login and password!</p>
                                <Form onSubmit={handleSubmit}>
                                    <MDBInput wrapperClass='mb-4 w-100' name='username' value={credentials.username} label='Username' type='text' size="lg" onChange={handleChange} />
                                    <MDBInput wrapperClass='mb-4 w-100' name='password' value={credentials.password} label='Password' type='password' size="lg" onChange={handleChange} />
                                    <MDBBtn className="mb-2 w-100" color='info' size='lg' type="submit">Login</MDBBtn>
                                </Form>
                                <hr className="my-4" />


                                <a className='text-muted' href='#' onClick={handleShow}><p className="small mb-4 pb-lg-3 text-center">Forgot password?</p></a>
                                <p className='text-center'>Don't have an account?<Link className='link-no-underline' to={'/signup'}> Register here</Link></p>


                            </MDBCardBody>
                        </MDBCard>

                    </MDBCol>
                </MDBRow>
<br/><br/><br/><br/><br/>
            </MDBContainer>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                name='username'
                onChange={handleUsernameChange}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleGetPassword}>
            Send Password
          </Button>
        </Modal.Footer>
      </Modal>

            <ToastContainer />

        </>
    )
}

export default Login