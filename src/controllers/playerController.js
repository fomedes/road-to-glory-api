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

const getFavouritePlayers = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        const favouritePlayers = team.favouritePlayers;
        res.status(200).json(favouritePlayers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addPlayerToFavourites = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        const player = req.params.playerId;
        team.favouritePlayers.push(player);
        await team.save();
        res.status(200).json(team.favouritePlayers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const removePlayerFromFavourites = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        const player = req.params.playerId;
        team.favouritePlayers = team.favouritePlayers.filter(p => p !== player);
        await team.save();
        res.status(200).json(team.favouritePlayers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getTeamPlayers, getFavouritePlayers, addPlayerToFavourites, removePlayerFromFavourites
};