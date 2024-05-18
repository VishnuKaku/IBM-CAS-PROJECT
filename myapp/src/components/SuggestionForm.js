import React, { useState } from 'react';
import SuggestionService from '../services/SuggestionService';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

const SuggestionForm = () => {
    const userId = useSelector(store => store.user.currentUser._id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '' // Add category field to the initial state
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        const newFormData = { ...formData, creator: userId };
        try {
           const resp = await SuggestionService.createSuggestion(newFormData);
           console.log(resp)
            if(resp.status===201){
                toast.success('Suggestion submitted')
            }
            setFormData({
                title: '',
                description: '',
                category: ''
            });
        } catch (error) {
            toast.error('Please try again later!')
        }
    };

    return (
        <div className="my-5 city-background container-fluid">
      <div className="card shadow-sm smaller-form form-animation">
        <div className="card-body">
          <h1 className="card-title text-center">Suggestion Form</h1>
          <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Public Services">Public Services</option>
                        <option value="Environment">Environment</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            </div>
            </div>
            <ToastContainer position="top-center" autoClose={5000} />
        </div>
    );
};

export default SuggestionForm;
