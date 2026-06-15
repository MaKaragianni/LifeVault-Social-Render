import { addFriend } from "../services/friends";
import { useParams } from "react-router-dom";

function AddFriendButton() {
    const { id } = useParams();
    
    function handleAddFriend() {
        const token = localStorage.getItem("token");
        addFriend(token, id);
    }

    return (
        <button className="add-friend" type="submit" onClick={handleAddFriend}>+ Add Friend</button>
    )
}

export default AddFriendButton;