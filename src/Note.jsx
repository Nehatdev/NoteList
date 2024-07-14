import React, { useState, useEffect } from 'react';
import './App.css'; // Import your main CSS file for general styles
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, Button } from 'react-bootstrap';

export const Note = () => {
    const [data, setData] = useState({ title: '', content: '' });
    const [userNotes, setUserNotes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/notelist/');
                if (Array.isArray(response.data)) {
                    setUserNotes(response.data);
                } else {
                    setUserNotes([]);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/note', data);
            if (response.data) {
                toast.success('Successfully added note');
                setData({ title: '', content: '' });
                setUserNotes([...userNotes, response.data.note]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/note/${id}`);
            toast.success('Successfully deleted note');
            setUserNotes(userNotes.filter(note => note._id !== id));
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to delete note');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2 className="Note">Add your Notes</h2>
                <div className='input-group'>
                    <label>Title:</label>
                    <input
                        type='text'
                        name='title'
                        placeholder='title'
                        value={data.title}
                        onChange={handleChange}
                    />
                </div>
                <div className='input-group'>
                    <label>Content:</label>
                    <textarea
                        type='text'
                        name='content'
                        placeholder='content'
                        value={data.content}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button className='btn'>Submit</button>
                </div>
            </form>
            
            {Array.isArray(userNotes) && userNotes.map(note => (
                <Card key={note._id} className="note-card">
                    <Card.Body>
                        <Card.Title><strong>Title:</strong>{note.title}</Card.Title>
                        <Card.Text><strong>Content:</strong>{note.content}</Card.Text>
                        <Button variant="danger" onClick={() => deleteNote(note._id)}>Delete</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};
