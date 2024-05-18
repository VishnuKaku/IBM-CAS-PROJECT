import React, { useEffect, useState } from 'react';
import { MDBCol, MDBBtn, MDBIcon, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './Profile.css'
import { ToastContainer, toast } from 'react-toastify';
import {useSelector} from 'react-redux';
import UserService from '../services/UserService';

const Profile = () => {

  const [userData, setUserData] = useState({});
  const [show, setShow] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [updateData, setUpdateData] = useState({});

  const user = useSelector(store=>store.user.currentUser);
    useEffect(()=>{
        setUserData(user)
    },[user])

  const token = useSelector(obj=>obj.user.token);


  const handleClose = () => setShow(false);
  const handlePasswordClose = () => setShowChangePassword(false)

  const handleShow = () => {

    setUpdateData({
      name: userData.name,
      email: userData.email,
      username: userData.username,
      phone: userData.phone
    })
    setShow(true);
  }

  const handleShowPassword = () => setShowChangePassword(true)

  const handleInputChange = (event) => {
    setUpdateData({ ...updateData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async () => {

    UserService.updateUser(userData._id,token,updateData).then((resp)=>{
      setUserData({...userData,...updateData})
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
    

    setShow(false) || setShowChangePassword(false)

  }

  return (
    <>
      <section className="vh-80" style={{ backgroundColor: '#f4f5f7' }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="6" className="mb-4 mb-lg-0">
              <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                <MDBRow className="g-0">
                  <MDBCol md="4" className="gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <MDBCardImage src="https://cdn2.iconfinder.com/data/icons/shopping-colorline/64/admin-1024.png"
                      alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                    <MDBTypography tag="h5">{userData.name}</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    {user.designation?<><MDBCardText >Designation: </MDBCardText>
                    <MDBCardText >{userData.designation}</MDBCardText></>:<><MDBCardText >Role:</MDBCardText>
                    <MDBCardText >{userData.role}</MDBCardText></>}
                   {/* <MDBIcon far icon="edit mb-5" /> */}
                  </MDBCol>
                  <MDBCol md="8">
                    <MDBCardBody className="p-4">
                      <MDBTypography tag="h6">Information</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">{userData.email}</MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Phone</MDBTypography>
                          <MDBCardText className="text-muted">{userData.phone}</MDBCardText>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Username</MDBTypography>
                          <MDBCardText className="text-muted">{userData.username}</MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Password</MDBTypography>
                          <MDBBtn className='btn-sm' color='danger' onClick={handleShowPassword} >Change Password</MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <hr className="mt-0 mb-4" />

                      {/* <Button className='btn-sm' variant="primary" onClick={handleShow}>Update</Button> */}


                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                        <Button className='btn-sm' variant="primary" onClick={handleShow}>Update</Button>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Created on</MDBTypography>
                          <MDBCardText className="text-muted">{userData.registrationDate && userData.registrationDate.slice(0,10) }</MDBCardText>
                        </MDBCol>
                      </MDBRow>

                      <div className="d-flex justify-content-start">
                      </div>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>


      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={updateData.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="email" value={updateData.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="number" name="phone" value={updateData.phone} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> 


      <Modal show={showChangePassword} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="text" name="password" value={updateData.password} onChange={handleInputChange} />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePasswordClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default Profile