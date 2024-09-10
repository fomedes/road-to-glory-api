import Community from "../models/Community.js";
import News from "../models/News.js";

const createNews = async (newsData) => {
  try {
      const community = await Community.findById(newsData.communityId);
      if (!community) {
          throw new Error("Community not found");
      }

      const messageTemplates = {
          transferPurchase: (body) => `${body.buyerName} ha fichado a ${body.playerName}`,

          transferSale: (body) => `${body.sellerName} ha liberado a ${body.playerName}`,

          newUser: (body) => `${body.username} es el nuevo entrenador de ${body.clubName}`,
          
          newTournament: (body) => `${body.name} acaba de iniciar!`,

        //   newTournament: (body) => `Un nuevo torneo ha sido creado. Inscribete para participar: ${body.tournamentId}.`,

          newSeason: (body) => `¡Empieza la Temporada ${body.seasonNumber}!`,  
          
          bonus: (body) => `${body.message}`,

          penalization: (body) => `${body.message}`,

          other: (body) => `${body.message}`,
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

      const singleTeamDetails = {
          clubName: newsData.clubName,
          clubCrest: newsData.clubCrest,
          teamId: newsData.teamId,
      };

      const budgetAdjustment = {
          amount: newsData.amount,
      }

      const newTournamentData = {
          tournamentId: newsData.tournamentId,
      };

      const newsDefault = {
          message: _createMessage(),
          communityId: newsData.communityId,
          type: newsData.type,
          createdAt: newsData.createdAt || Date.now(),
      };

      const news = new News({ ...newsDefault, ...transferDetails, ...singleTeamDetails, ...budgetAdjustment, ...newTournamentData });

      await news.save();

      community.news.push(news.id);

      await community.save();
      return news;
  } catch (error) {
      console.error('News creation error:', error);
      throw new Error(error.message);
  }
};


export default {
  createNews,
};