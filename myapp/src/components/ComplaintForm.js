import React, { useState } from 'react';
import ComplaintService from '../services/ComplaintService';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './ComplaintForm.css'; 

const complaintTypes = [
  'Noise', 'Road Maintenance', 'Waste Management', 'Public Safety',
  'Infrastructure', 'Environmental', 'Building Code', 'Traffic'
];

const ComplaintForm = () => {
  const userId = useSelector(store => store.user.currentUser._id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    creator: '',
    address: {
      addressLine1: '',
      state: '',
      city: '',
      pincode: ''
    },
    complaintType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormData = { ...formData, creator: userId };
    try {
      const complaint = await ComplaintService.createComplaint(newFormData);
      if (complaint.status === 201) {
        setFormData({
          title: '',
          description: '',
          status: 'open',
          creator: '',
          address: {
            addressLine1: '',
            state: '',
            city: '',
            pincode: ''
          },
          complaintType: ''
        });
        toast.success('Complaint created successfully!');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later!');
    }
  };

  return (
    <div className="my-5 city-background">
      <div className="card shadow-sm smaller-form form-animation">
        <div className="card-body">
          <h2 className="card-title text-center">Complaint Form</h2>
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <div className="mb-3">
              <label htmlFor="complaintType" className="form-label">Complaint Type</label>
              <select className="form-select" id="complaintType" name="complaintType" value={formData.complaintType} onChange={handleChange} required>
                <option value="">Select Complaint Type</option>
                {complaintTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="addressLine1" className="form-label"><FaMapMarkerAlt />Address Line 1</label>
              <input type="text" className="form-control" id="addressLine1" name="addressLine1" value={formData.address.addressLine1} onChange={handleAddressChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="state" className="form-label">
                <FaMapMarkerAlt /> State
              </label>
              <input type="text" className="form-control" id="state" name="state" value={formData.address.state} onChange={handleAddressChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                <FaMapMarkerAlt /> City
              </label>
              <input type="text" className="form-control" id="city" name="city" value={formData.address.city} onChange={handleAddressChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="pincode" className="form-label">Pincode</label>
              <input type="number" className="form-control" id="pincode" name="pincode" value={formData.address.pincode} onChange={handleAddressChange} required />
            </div>
            <button type="submit" className="btn btn-success w-100">Submit</button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
}

export default ComplaintForm;
