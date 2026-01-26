import { useEffect, useState } from 'react';
import api from './api';
import './admin.css'
const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [datas, setDatas] = useState([]);
    const [error, setError] = useState('');

    const fetchdata = async () => {
        try {
            const data = await api.get('post/');
            setDatas(data.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch posts");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

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
            </header>

            <div className="admin-content">
                {datas.length === 0 ? (
                    <div className="no-data">
                        <p>No posts found.</p>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {datas.map((dat, index) => (
                            <div key={index} className="post-card">
                                <div className="post-header">
                                    <span className="post-number">Post #{index + 1}</span>
                                    <span className="post-date">
                                        {dat.created_at ? new Date(dat.created_at).toLocaleDateString() : 'No date'}
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;