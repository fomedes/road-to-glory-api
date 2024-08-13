import Community from "../models/Community.js";
import News from "../models/News.js";


const createNews = async (req,res) => {
    try {
        const community = await Community.findById(req.body.communityId);

        if (!community) {
          return res.status(404).json({ error: "Community not found" });
      }

      const messageTemplates = {
        transfer: (body) => {
          const formattedAmount = new Intl.NumberFormat('es-ES', { 
            style: 'currency', 
            currency: 'EUR',
            minimumFractionDigits: 0, 
            maximumFractionDigits: 0 
          }).format(body.bidAmount);
          return `${body.buyerName} ha fichado a ${body.playerName} por ${formattedAmount}`;
        },

          newUser: (body) => `${body.userName} es el nuevo entrenador de ${body.clubName}`,
          
          newTournament: (body) => `Un nuevo torneo ha sido creado. Inscribete para participar: ${body.tournamentId}.`,
        };
        
        const _createMessage = () => {
          const { type, ...body } = req.body;
          const createMessage = messageTemplates[type];
          return createMessage ? createMessage(body) : '';
        };

        const transferDetails = {
          transferType: req.body.transferType,
          buyerId: req.body.buyerId,
          buyerName: req.body.buyerName,
          buyerCrest: req.body.buyerCrest,
          sellerId: req.body.sellerId,
          sellerName: req.body.sellerName,
          sellerCrest: req.body.sellerCrest,
          playerId: req.body.playerId,
          playerName: req.body.playerName,
          transferAmount: req.body.transferAmount,
        }

        const newsData = {
          message: _createMessage(),
          communityId: req.body.communityId,
          tournamentId: req.body.tournamentId,
          clubCrest: req.body.clubCrest,
          type: req.body.type,
          createdAt: req.body.createdAt || Date.now(),
        }

        const news = new News({ ...newsData, transferDetails });

        await news.save();

        community.news.push(news.id);

        await community.save();

        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNewsByCommunityId = async (req, res) => {
    try {
        const community = await Community.findById(req.params.community_id);

        if (!community) {
            return res.status(404).json({ error: 'Community not found' });
        }

        const communityNewsId = community.news;

        const communityNews = await News.find({ _id: { $in: communityNewsId } });

        res.json(communityNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default {createNews, getNewsByCommunityId}
