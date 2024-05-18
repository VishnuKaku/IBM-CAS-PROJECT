import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, CardText, Badge, Col, ButtonGroup, Button, Form } from 'react-bootstrap';
import ComplaintService from '../services/ComplaintService';
import { useSelector } from 'react-redux';

const ShowComplaint = () => {
  
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [newStatusMap, setNewStatusMap] = useState({});
  const complaintTypes = ['Noise', 'Road Maintenance', 'Waste Management', 'Public Safety', 'Infrastructure', 'Environmental', 'Building Code', 'Traffic'];
  const [selectedType, setSelectedType] = useState('');
  const user = useSelector(store=>store.user.currentUser);
  const userId = user._id;
  const isEmployee = user.role === 'Employee'

  useEffect(() => {
    fetchComplaints()
  }, []);

const fetchComplaints = ()=>{
  if (isEmployee) {
    ComplaintService.getAllComplaints(userId).then((resp) => {
      console.log(resp)
      setComplaints(resp.data);
      setFilteredComplaints(resp.data); // Initially set filtered complaints to all complaints
    }).catch((error) => {
      console.log(error);
    });
  } else {
    ComplaintService.getComplaintByCreatorId(userId).then((resp) => {
      console.log(resp.data)
      setComplaints(resp.data);
      setFilteredComplaints(resp.data); // Initially set filtered complaints to all complaints
    }).catch((error) => {
      console.log(error);
    });
  }
}

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'secondary';
      default:
        return 'light';
    }
  };

  const handleStatusFilter = (status) => {
    if (status === 'all') {
      setFilteredComplaints(complaints); // If 'All' is selected, show all complaints
    } else {
      const filtered = complaints.filter(complaint => complaint.status === status);
      setFilteredComplaints(filtered); // Filter complaints based on selected status
    }
  };

  const handleTypeFilter = (type) => {
    if (type === 'all') {
      setSelectedType('');
      setFilteredComplaints(complaints); // If 'All' is selected, show all complaints
    } else {
      setSelectedType(type);
      const filtered = complaints.filter(complaint => complaint.complaintType === type);
      setFilteredComplaints(filtered); // Filter complaints based on selected complaint type
    }
  };

  const handleStatusChange = async (complaintId) => {
    try {
      const newStatus = newStatusMap[complaintId];
      await ComplaintService.updateComplaint(complaintId,{'status': newStatus});
      fetchComplaints();
      setNewStatusMap(prevState => ({ ...prevState, [complaintId]: undefined }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
<>
      <div className="row justify-content-end mb-3">
        <ButtonGroup>
          <Button variant="outline-primary" onClick={() => handleStatusFilter('all')}>All Status</Button>
          <Button variant="outline-primary" onClick={() => handleStatusFilter('open')}>Open</Button>
          <Button variant="outline-warning" onClick={() => handleStatusFilter('in progress')}>In Progress</Button>
          <Button variant="outline-success" onClick={() => handleStatusFilter('resolved')}>Resolved</Button>
          <Button variant="outline-secondary" onClick={() => handleStatusFilter('dismissed')}>Dismissed</Button>
        </ButtonGroup>
        {/* <ButtonGroup className="ms-3">
          <Button variant="outline-primary" onClick={() => handleTypeFilter('all')}>All Types</Button>
          {complaintTypes.map(type => (
            <Button key={type} variant={selectedType === type ? 'primary' : 'outline-primary'} onClick={() => handleTypeFilter(type)}>{type}</Button>
          ))}
        </ButtonGroup> */}
      </div>
      <div className="row">
        {filteredComplaints.map(complaint => (
          <div className="col-sm-6 mt-4" key={complaint._id}>
            <Col>
              <Card>
                <CardBody>
                <div>
                    {isEmployee && <CardTitle><strong><span className="fw-bold">Complainant: </span>{complaint.creator && complaint.creator.name}</strong></CardTitle>}
                  </div>
                  <div>
                    <CardTitle><span className="fw-bold">Title: </span>{complaint.title}</CardTitle>
                  </div>
                  <div>
                    <span className="fw-bold">Complaint Type: </span>
                    <span>{complaint.complaintType}</span>
                  </div>
                  <div>
                    <CardText><span className="fw-bold">Description: </span>{complaint.description}</CardText>
                  </div>
                  <div>
                    <span className="fw-bold">Address: </span>
                    <span>{complaint.address.addressLine1}, {complaint.address.city}, {complaint.address.state} {complaint.address.pincode}</span>
                  </div>
                  <Badge bg={getStatusBadgeVariant(complaint.status)}>{complaint.status}</Badge>
                  {isEmployee && (
                    <div className="mt-2">
                      <Form.Select
                        onChange={(e) => setNewStatusMap(prevState => ({ ...prevState, [complaint._id]: e.target.value }))}
                        value={newStatusMap[complaint._id] || ''}
                      >
                        <option value="">Select Status</option>
                        <option value="open">Open</option>
                        <option value="in progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                      </Form.Select>
                      <Button variant="primary" onClick={() => handleStatusChange(complaint._id)} className="mt-2">
                        Update Status
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </div>
        ))}
      </div>
      </>
  );
};

export default ShowComplaint;