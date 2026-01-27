import { useEffect, useState } from 'react';
import api from './api';
import './admin.css';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState([]);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchdata = async () => {
        try {
            const response = await api.get('post/');
            setDatas(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch posts");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        setDeletingId(id);
        try {
            await api.delete(`post/${id}/`);
            // Remove the deleted post from state
            setDatas(prevDatas => prevDatas.filter(post => post.id !== id));
        } catch (err) {
            setError("Failed to delete post");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    const formatDateTime = (dateString) => {
        if (!dateString) return 'No date';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateString; // Return as-is if parsing fails
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <div className="error-icon">!</div>
                <h3>{error}</h3>
                <button onClick={fetchdata} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">Post Responses</h1>
                <p className="admin-subtitle">View all submitted responses below</p>
                <button onClick={fetchdata} className="refresh-btn">
                    Refresh Posts
                </button>
            </header>

            <div className="admin-content">
                {datas.length === 0 ? (
                    <div className="no-data">
                        <p>No posts found.</p>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {datas.map((dat, index) => (
                            <div key={dat.id} className="post-card">
                                <div className="post-header">
                                    <span className="post-number">Post #{index + 1}</span>
                                    <span className="post-date">
                                        {formatDateTime(dat.created_at)}
                                    </span>
                                </div>
                                <div className="post-content">
                                    {dat.content || 'No content available'}
                                </div>
                                {dat.author && (
                                    <div className="post-author">
                                        By: {dat.author}
                                    </div>
                                )}
                                <div className="post-actions">
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(dat.id)}
                                        disabled={deletingId === dat.id}
                                    >
                                        {deletingId === dat.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;