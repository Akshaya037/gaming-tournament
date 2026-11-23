const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Team = require("./models/Team");

const seedTeams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const users = await User.find({ role: "player" }).limit(4);

        if (users.length < 2) {
            throw new Error("At least 2 users are required to create teams.");
        }

        const teams = [
            {
                name: "Team Thunder",
                captain: users[0]._id,
                members: [users[0]._id, users[1]._id]
            },
            {
                name: "Team Phoenix",
                captain: users[1]._id,
                members: [users[1]._id, users[0]._id]
            }
        ];

        for (const teamData of teams) {
            const existingTeam = await Team.findOne({ name: teamData.name });

            if (!existingTeam) {
                await Team.create(teamData);
                console.log(teamData.name + " created successfully!");
            } else {
                console.log(teamData.name + " already exists.");
            }
        }

        console.log("Team seeding completed!");
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB Disconnected");
    }
};

seedTeams();