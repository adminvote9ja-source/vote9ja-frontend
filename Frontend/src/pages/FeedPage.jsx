import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, MessageCircle, Share, Send } from 'lucide-react';
import '../styles/feed.css';

function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [postingFeed, setPostingFeed] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await api.get('/feed');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPostingFeed(true);
    try {
      await api.post('/feed', { content: newPost });
      setNewPost('');
      fetchFeed();
    } catch (error) {
      alert('Failed to create post');
    } finally {
      setPostingFeed(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/feed/${postId}/like`);
      fetchFeed();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  if (loading) return <div className="loading">Loading feed...</div>;

  return (
    <div className="feed-page">
      {user && (
        <section className="create-post">
          <form onSubmit={handleCreatePost}>
            <div className="post-input-group">
              <input
                type="text"
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <button type="submit" disabled={postingFeed}>
                <Send size={20} />
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="feed-posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post._id} className="feed-post">
              <div className="post-header">
                <div className="author-info">
                  <img src={post.userId.avatar} alt={post.userId.username} />
                  <div>
                    <h4>{post.userId.username}</h4>
                    <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post" />}
              </div>

              <div className="post-actions">
                <button onClick={() => handleLike(post._id)} className="action-btn">
                  <Heart size={18} /> {post.likes.length}
                </button>
                <button className="action-btn">
                  <MessageCircle size={18} /> {post.comments.length}
                </button>
                <button className="action-btn">
                  <Share size={18} /> {post.shares}
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="no-posts">No posts yet. Be the first to post!</p>
        )}
      </section>
    </div>
  );
}

export default FeedPage;
