import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Modal, Form, ListGroup, Badge, ButtonGroup } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SuggestionService from '../services/SuggestionService';
import CommentService from '../services/comment.service';
import { useSelector } from 'react-redux';
import './ShowSuggestion.css';

const ShowSuggestion = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSuggestion, setCurrentSuggestion] = useState(null);
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState('');
    const [modalCommentInput, setModalCommentInput] = useState('');
    const [showCommentBox, setShowCommentBox] = useState({});
    const user = useSelector(store => store.user.currentUser);
    const userId = user._id;
    const isEmployee = user.role === 'Employee';
    const [newStatus, setNewStatus] = useState('');
    const mySuggestion = props.mySuggestion;

    useEffect(() => {
        fetchSuggestions();
    }, [props.mySuggestion]);

    useEffect(() => {
        setFilteredSuggestions(suggestions);
    }, [suggestions]);

    const handleStatusChange = async (suggestionId) => {
        try {
            await SuggestionService.updateSuggestion(suggestionId, { 'status': newStatus });
            fetchSuggestions(); // Refresh suggestions after updating status
            setNewStatus('');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const fetchSuggestions = async () => {
        let response;
        try {
            if (mySuggestion) {
                response = await SuggestionService.getSuggestionByCreatorId(userId);
            } else {
                response = await SuggestionService.getAllSuggestions();
            }
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const fetchComments = async (suggestionId) => {
        try {
            const response = await CommentService.getCommentsBySuggestionId(suggestionId);
            setComments(prevComments => ({ ...prevComments, [suggestionId]: response }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleShowComments = (suggestion) => {
        setCurrentSuggestion(suggestion);
        fetchComments(suggestion._id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setComments({});
        setCommentInput('');
        setModalCommentInput('');
        setShowCommentBox({});
    };

    const handleCommentInputChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleModalCommentInputChange = (e) => {
        setModalCommentInput(e.target.value);
    };

    const handleCommentSubmit = async (e, suggestionId) => {
        e.preventDefault();
        try {
            const newComment = {
                content: commentInput,
                creator: userId,
                suggestion: suggestionId
            };
            await CommentService.createComment(newComment);
            fetchComments(suggestionId); // Refresh comments after posting
            setCommentInput('');
            setShowCommentBox(prevState => ({ ...prevState, [suggestionId]: false })); // Hide the comment box after posting
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleModalCommentSubmit = async (e, suggestionId) => {
        e.preventDefault();
        try {
            const newComment = {
                content: modalCommentInput,
                creator: userId,
                suggestion: suggestionId
            };
            await CommentService.createComment(newComment);
            fetchComments(suggestionId); // Refresh comments after posting
            setModalCommentInput('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleDeleteComment = async (commentId, suggestionId) => {
        try {
            await CommentService.deleteComment(commentId);
            fetchComments(suggestionId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const toggleCommentBox = (suggestionId) => {
        setShowCommentBox(prevState => ({ ...prevState, [suggestionId]: !prevState[suggestionId] }));
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'approved':
                return 'success';
            case 'rejected':
                return 'danger';
            default:
                return 'light';
        }
    };

    const handleStatusFilter = (status) => {
        if (status === 'all') {
            setFilteredSuggestions(suggestions);
        } else {
            const filtered = suggestions.filter(suggestion => suggestion.status === status);
            setFilteredSuggestions(filtered);
        }
    };

    const handleUpvote = async (suggestionId) => {
        try {
            console.log(suggestionId, userId);
            await SuggestionService.upvoteSuggestion(suggestionId, userId);
            fetchSuggestions(); // Refresh suggestions after upvoting
        } catch (error) {
            console.error('Error upvoting suggestion:', error);
        }
    };

    const hasVoted = (suggestion) => {
        return suggestion.votes.includes(userId);
    };

    return (
        <>
            <div className="row justify-content-end mb-3">
                <ButtonGroup>
                    <Button variant="outline-primary" onClick={() => handleStatusFilter('all')}>All Status</Button>
                    <Button variant="outline-success" onClick={() => handleStatusFilter('approved')}>Approved</Button>
                    <Button variant="outline-warning" onClick={() => handleStatusFilter('pending')}>Pending</Button>
                    <Button variant="outline-danger" onClick={() => handleStatusFilter('rejected')}>Rejected</Button>
                </ButtonGroup>
            </div>
            <Container>
                {filteredSuggestions.map((suggestion) => (
                    <Row className="mt-4" key={suggestion._id}>
                        <Col sm={12}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Card.Title><strong>Title: </strong>{suggestion.title}</Card.Title>
                                        <Badge bg={getStatusBadgeVariant(suggestion.status)}>{suggestion.status}</Badge>
                                    </div>
                                    <Card.Text><strong>Description: </strong>{suggestion.description}</Card.Text>
                                    <Card.Text><strong>Category:</strong> {suggestion.category}</Card.Text>
                                    {!mySuggestion && <Card.Text><strong>Creator:</strong> {suggestion.creator &&   suggestion.creator.name}</Card.Text>}
                                    <div className="d-flex align-items-center mt-3">
                                        <Button variant="link" className="p-0 me-3 no-underline" onClick={() => handleShowComments(suggestion)}>
                                            <i className="fas fa-comments me-1"></i> <span className="align-middle">Show Comments</span>
                                        </Button>
                                        <Button variant="link" className="p-0 me-3 no-underline" onClick={() => toggleCommentBox(suggestion._id)}>
                                            <i className="fas fa-reply me-1"></i> <span className="align-middle">Reply</span>
                                        </Button>
                                        {hasVoted(suggestion) ? (
                                            <Button variant="link" className="p-0 no-underline text-primary" disabled>
                                                <i className="fas fa-thumbs-up me-1"></i> <span className="align-middle">{suggestion.votes.length} Upvoted</span>
                                            </Button>
                                        ) : (
                                            <Button variant="link" className="p-0 no-underline" onClick={() => handleUpvote(suggestion._id)}>
                                                <i className="fas fa-thumbs-up me-1"></i> <span className="align-middle">{suggestion.votes.length} Upvote</span>
                                            </Button>
                                        )}
                                    </div>
                                    {isEmployee && (
                                        <Form.Group controlId="newStatus">
                                            <Form.Label>Update Status:</Form.Label>
                                            <Form.Select onChange={(e) => setNewStatus(e.target.value)} value={newStatus}>
                                                <option value="">Select Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </Form.Select>
                                            <Button variant="primary" onClick={() => handleStatusChange(suggestion._id)} className="mt-2">
                                                Update
                                            </Button>
                                        </Form.Group>
                                    )}
                                    {showCommentBox[suggestion._id] && (
                                        <Form onSubmit={(e) => handleCommentSubmit(e, suggestion._id)} className="mt-2">
                                            <Form.Group controlId="commentInput">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={commentInput}
                                                    onChange={handleCommentInputChange}
                                                />
                                            </Form.Group>
                                            <Button variant="primary" type="submit" className="mt-2">
                                                Post Comment
                                            </Button>
                                        </Form>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                ))}
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Details for {currentSuggestion?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentSuggestion && (
                            <div>
                                {!mySuggestion && <p><strong>Creator:</strong> {currentSuggestion.creator.name}</p>}
                                <p><strong>Title:</strong> {currentSuggestion.title}</p>
                                <p><strong>Description:</strong> {currentSuggestion.description}</p>
                                <p><strong>Category:</strong> {currentSuggestion.category}</p>
                                <p><strong>Status:</strong> <Badge bg={getStatusBadgeVariant(currentSuggestion.status)}>{currentSuggestion.status}</Badge></p>
                            </div>
                        )}
                        <h5>Comments</h5>
                        <div className="comments-section">
                            <ListGroup className="comments-list mb-3">
                                {comments[currentSuggestion?._id]?.length > 0 ? (
                                    comments[currentSuggestion._id].map((comment) => (
                                        <ListGroup.Item key={comment._id} style={{ wordBreak: 'break-word' }} className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <strong>{comment.creator.name}:</strong> {comment.content}
                                                <div className="text-muted" style={{ fontSize: '0.8em' }}>
                                                    {new Date(comment.creationDate).toLocaleString()}
                                                </div>
                                            </div>
                                            {comment.creator._id === userId && (
                                                <Button variant="link" className="text-danger" onClick={() => handleDeleteComment(comment._id, currentSuggestion._id)}>
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            )}
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>No comments yet</ListGroup.Item>
                                )}
                            </ListGroup>
                            <Form onSubmit={(e) => handleModalCommentSubmit(e, currentSuggestion._id)} className="comment-form">
                                <Form.Group controlId="modalCommentInput">
                                    <Form.Control
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={modalCommentInput}
                                        onChange={handleModalCommentInputChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-2">
                                    Post Comment
                                </Button>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
};

export default ShowSuggestion;