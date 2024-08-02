import Community from "../models/Community.js";

const joinCommunity = async (userId, communityId) => {
  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return { status: 404, message: "Community not found" };
    }

    if (community.users.includes(userId)) {
      return { status: 400, message: "User is already a member" };
    }

    community.users.push(userId);
    await community.save();

    return { status: 200, message: "Successfully joined the community" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal server error" };
  }
};

export default { joinCommunity };
