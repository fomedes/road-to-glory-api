import Team from "../models/Team.js";

const getTeamPlayers = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        const players = team.players;
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getTeamPlayers
};