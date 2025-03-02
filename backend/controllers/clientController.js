import UserModel from "../models/user.js";
const fetchTalent = async (req, res) => {
    try {
        const { search } = req.query;

        // Create a query object to hold search criteria

        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { skills: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { experience: { $elemMatch: { companyName: { $regex: search, $options: 'i' } } } },
                    { certificates: { $elemMatch: { title: { $regex: search, $options: 'i' } } } }
                ]
            };
        }
        

        // Fetch jobs based on the query
        const jobs = await UserModel.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, freelancers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { fetchTalent };