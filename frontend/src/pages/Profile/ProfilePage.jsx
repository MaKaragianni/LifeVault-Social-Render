import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../../services/users";
import Post from "../../components/post";
import LogoutButton from "../../components/LogoutButton";

export function ProfilePage() {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        getUser(id)
            .then((userData) => {
                setUser(userData.user);
                setPosts(userData.posts || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
}, [id]);

    if (loading) return <p>Loading profile...</p>;
    if (!user) return <p>User not found.</p>;

    return (
        <>
            <h2>Profile</h2>

            {user.profilePic && (
                <img src={user.profilePic} alt="Profile" width="200" />
            )}

            <div>
                <p>Username: {user.username}</p>
                <p>Bio: {user.bio}</p>
            </div>

            <div className="feed" role="feed">
                {posts.map((post) => (
                    <Post post={post} key={post._id} />
                ))}
            </div>

            <LogoutButton />
        </>
    );
}