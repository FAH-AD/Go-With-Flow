import Message from '../models/message.js';
import JobMessageTrack from '../models/jobMessageTrack.js';

// Fetch messages between two users
const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};



// Get the count of freelancers a client has messaged for a job
const getMessagedFreelancerCount = async (req, res) => {
  const { jobId, clientId } = req.params;
  try {
    const track = await JobMessageTrack.findOne({ jobId, clientId });
    res.json(track ? track.messagedFreelancers.length : 0);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tracked messages" });
  }
};
export { getMessages, getMessagedFreelancerCount };