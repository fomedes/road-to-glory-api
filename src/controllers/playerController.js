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

const getFavoritePlayers = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        const favoritePlayers = team.favoritePlayers;
        res.status(200).json(favoritePlayers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addPlayerToFavorites = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        const player = req.params.playerId;
        team.favoritePlayers.push(player);
        await team.save();
        res.status(200).json(team.favoritePlayers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const removePlayerFromFavorites = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        const player = req.params.playerId;
        team.favoritePlayers = team.favoritePlayers.filter(p => p !== player);
        await team.save();
        res.status(200).json(team.favoritePlayers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    getTeamPlayers, getFavoritePlayers, addPlayerToFavorites, removePlayerFromFavorites
};