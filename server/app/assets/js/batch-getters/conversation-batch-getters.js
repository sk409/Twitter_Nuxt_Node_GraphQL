const _ = require("lodash");
const repositories = require("../../../repositories");

const { tweetRepository } = repositories;

const makeConversations = async keys => {
  const replies = await tweetRepository.findAll({
    where: {
      parentId: {
        $in: keys.map(key => key.parentId)
      }
    },
    order: [["id", "desc"]]
  });
  if (!replies) {
    return [];
  }
  //
  // if (args.userId) {
  //   replies = replies.fliter(reply => {
  //     return reply.userId === args.userId;
  //   });
  // }
  //
  const conversations = {};
  const depth = keys[0].depth || Number.MAX_SAFE_INTEGER;
  const limit = keys[0].limit || 1;
  for (const reply of replies) {
    if (!conversations[reply.parentId]) {
      conversations[reply.parentId] = [];
    }
    if (limit <= conversations[reply.parentId].length) {
      continue;
    }
    const conversation = [reply];
    while (conversation.length < depth) {
      const child = await tweetRepository.findOne({
        where: {
          // userId: { $or: [parent.userId, reply.userId] },
          parentId: conversation[conversation.length - 1].id
        },
        limit: 1
      });
      if (!child) {
        break;
      }
      conversation.push(child);
    }
    conversations[reply.parentId].push(conversation);
  }
  return conversations;
};

const conversationBatchGetter = async keys => {
  const conversations = await makeConversations(keys);
  return new Promise(resolve => {
    resolve(keys.map(key => conversations[key.parentId] || []));
  });
};

const conversationLengthBatchGetter = async keys => {
  const conversations = await makeConversations(keys);
  return new Promise(resolve => {
    resolve(
      keys.map(key =>
        conversations[key.parentId]
          ? conversations[key.parentId].map(conversation => conversation.length)
          : [0]
      )
    );
  });
};

module.exports = {
  conversationBatchGetter,
  conversationLengthBatchGetter
};
