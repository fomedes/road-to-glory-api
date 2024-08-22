import Community from "../models/Community.js";
import News from "../models/News.js";

const createNews = async (newsData) => {
  try {
      const community = await Community.findById(newsData.communityId);

      if (!community) {
          throw new Error("Community not found");
      }

      const formattedAmount = new Intl.NumberFormat('es-ES', { 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
      }).format(newsData.transferAmount);

      const messageTemplates = {
          transferPurchase: (body) => `${body.buyerName} ha fichado a ${body.playerName} por ${formattedAmount}`,

          transferSale: (body) => `${body.sellerName} ha liberado a ${body.playerName} por ${formattedAmount}`,

          newUser: (body) => `${body.userName} es el nuevo entrenador de ${body.clubName}`,
          
          newTournament: (body) => `Un nuevo torneo ha sido creado. Inscribete para participar: ${body.tournamentId}.`,
      };
      
      const _createMessage = () => {
          const { type, ...body } = newsData;
          const createMessage = messageTemplates[type];
          return createMessage ? createMessage(body) : '';
      };

      const transferDetails = {
          buyerId: newsData.buyerId,
          buyerName: newsData.buyerName,
          buyerCrest: newsData.buyerCrest,
          sellerId: newsData.sellerId,
          sellerName: newsData.sellerName,
          sellerCrest: newsData.sellerCrest,
          playerId: newsData.playerId,
          playerName: newsData.playerName,
          playerImage: newsData.playerImage,
          transferAmount: newsData.transferAmount,
      };

      const newUserDetails = {
          clubName: newsData.clubName,
          clubCrest: newsData.clubCrest,
          teamId: newsData.teamId,
      };

      const newTournamentData = {
          tournamentId: newsData.tournamentId,
      };

      const newsDefault = {
          message: _createMessage(),
          communityId: newsData.communityId,
          type: newsData.type,
          createdAt: newsData.createdAt || Date.now(),
      };

      const news = new News({ ...newsDefault, ...transferDetails, ...newUserDetails });

      await news.save();

      community.news.push(news.id);

      await community.save();

      return news; // Return the created news document
  } catch (error) {
      throw new Error(error.message);
  }
};


export default {
  createNews,
};